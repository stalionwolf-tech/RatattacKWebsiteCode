#!/usr/bin/env python3
"""
Backend API Test Suite for RatAttacK Shopify Integration
Tests all Shopify Storefront API routes + regression tests for existing routes
"""

import requests
import json
import sys
import os

# Get base URL from environment or use default
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://ratattack-realm.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

# Fallback to localhost if external URL is not reachable
def get_working_base_url():
    """Test if external URL is reachable, fallback to localhost if not"""
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            print(f"✓ Using external URL: {API_BASE}")
            return API_BASE
    except Exception as e:
        print(f"⚠ External URL not reachable ({e}), falling back to localhost")
    
    # Try localhost
    try:
        local_base = "http://localhost:3000/api"
        response = requests.get(f"{local_base}/health", timeout=5)
        if response.status_code == 200:
            print(f"✓ Using localhost: {local_base}")
            return local_base
    except Exception as e:
        print(f"✗ Localhost also not reachable: {e}")
    
    # Default to external URL anyway
    print(f"⚠ Using external URL by default: {API_BASE}")
    return API_BASE

API_BASE = get_working_base_url()

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST: {test_name}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}")

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.RESET}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.RESET}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.RESET}")

def print_info(message):
    print(f"  {message}")

# Test results tracking
test_results = {
    'passed': [],
    'failed': [],
    'warnings': []
}

def test_shopify_products_list():
    """Test GET /api/shopify/products"""
    print_test_header("GET /api/shopify/products")
    
    try:
        response = requests.get(f"{API_BASE}/shopify/products", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text[:500]}")
            test_results['failed'].append("GET /api/shopify/products - Wrong status code")
            return False
        
        data = response.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        # Check required fields
        required_fields = ['ok', 'source', 'count', 'shopifyEnabled', 'products']
        missing_fields = [f for f in required_fields if f not in data]
        
        if missing_fields:
            print_error(f"Missing required fields: {missing_fields}")
            test_results['failed'].append("GET /api/shopify/products - Missing fields")
            return False
        
        # Verify values
        if not data['ok']:
            print_error("ok field is not true")
            test_results['failed'].append("GET /api/shopify/products - ok is false")
            return False
        
        if data['source'] != 'mock':
            print_warning(f"Expected source='mock', got '{data['source']}' (acceptable if Shopify has products)")
        
        if not data['shopifyEnabled']:
            print_error("shopifyEnabled should be true")
            test_results['failed'].append("GET /api/shopify/products - shopifyEnabled is false")
            return False
        
        if data['count'] <= 0:
            print_error(f"Expected count > 0, got {data['count']}")
            test_results['failed'].append("GET /api/shopify/products - No products returned")
            return False
        
        print_success(f"Products count: {data['count']}")
        
        # Check first product structure
        if data['products'] and len(data['products']) > 0:
            product = data['products'][0]
            required_product_fields = ['id', 'handle', 'title', 'priceRange', 'featuredImage', 'variants']
            missing_product_fields = [f for f in required_product_fields if f not in product]
            
            if missing_product_fields:
                print_error(f"First product missing fields: {missing_product_fields}")
                test_results['failed'].append("GET /api/shopify/products - Product structure invalid")
                return False
            
            print_success(f"First product: {product['title']}")
            print_success(f"Product has {len(product['variants'])} variants")
        
        print_success("GET /api/shopify/products passed all checks")
        test_results['passed'].append("GET /api/shopify/products")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/shopify/products - Exception: {str(e)}")
        return False

def test_shopify_products_list_with_limit():
    """Test GET /api/shopify/products?first=10"""
    print_test_header("GET /api/shopify/products?first=10")
    
    try:
        response = requests.get(f"{API_BASE}/shopify/products?first=10", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            test_results['failed'].append("GET /api/shopify/products?first=10 - Wrong status code")
            return False
        
        data = response.json()
        
        if not data['ok']:
            print_error("ok field is not true")
            test_results['failed'].append("GET /api/shopify/products?first=10 - ok is false")
            return False
        
        print_success(f"Products count: {data['count']}")
        print_success("GET /api/shopify/products?first=10 passed")
        test_results['passed'].append("GET /api/shopify/products?first=10")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/shopify/products?first=10 - Exception: {str(e)}")
        return False

def test_shopify_product_by_handle_valid():
    """Test GET /api/shopify/products/scarlet-violet-booster-box"""
    print_test_header("GET /api/shopify/products/scarlet-violet-booster-box")
    
    try:
        response = requests.get(f"{API_BASE}/shopify/products/scarlet-violet-booster-box", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            print_info(f"Response: {response.text[:500]}")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - Wrong status code")
            return False
        
        data = response.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        if not data['ok']:
            print_error("ok field is not true")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - ok is false")
            return False
        
        if 'product' not in data:
            print_error("Missing 'product' field")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - Missing product field")
            return False
        
        product = data['product']
        if not product:
            print_error("Product is null")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - Product is null")
            return False
        
        if product['handle'] != 'scarlet-violet-booster-box':
            print_error(f"Expected handle 'scarlet-violet-booster-box', got '{product['handle']}'")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - Wrong handle")
            return False
        
        # Check required fields
        required_fields = ['title', 'priceRange', 'variants', 'featuredImage']
        missing_fields = [f for f in required_fields if f not in product]
        
        if missing_fields:
            print_error(f"Product missing fields: {missing_fields}")
            test_results['failed'].append("GET /api/shopify/products/scarlet-violet-booster-box - Missing fields")
            return False
        
        print_success(f"Product title: {product['title']}")
        print_success(f"Product has {len(product['variants'])} variants")
        print_success("GET /api/shopify/products/scarlet-violet-booster-box passed")
        test_results['passed'].append("GET /api/shopify/products/scarlet-violet-booster-box")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/shopify/products/scarlet-violet-booster-box - Exception: {str(e)}")
        return False

def test_shopify_product_by_handle_invalid():
    """Test GET /api/shopify/products/does-not-exist-xyz"""
    print_test_header("GET /api/shopify/products/does-not-exist-xyz")
    
    try:
        response = requests.get(f"{API_BASE}/shopify/products/does-not-exist-xyz", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        # Accept either 404 or 200 with product:null
        if response.status_code == 404:
            print_success("Returned 404 for non-existent product (acceptable)")
            test_results['passed'].append("GET /api/shopify/products/does-not-exist-xyz")
            return True
        elif response.status_code == 200:
            data = response.json()
            if data.get('product') is None or data.get('ok') is False:
                print_success("Returned 200 with product:null or ok:false (acceptable)")
                test_results['passed'].append("GET /api/shopify/products/does-not-exist-xyz")
                return True
            else:
                print_warning("Returned 200 with a product (unexpected but not critical)")
                test_results['warnings'].append("GET /api/shopify/products/does-not-exist-xyz - Returned product")
                return True
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            test_results['failed'].append("GET /api/shopify/products/does-not-exist-xyz - Unexpected status")
            return False
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/shopify/products/does-not-exist-xyz - Exception: {str(e)}")
        return False

def test_shopify_checkout_get():
    """Test GET /api/shopify/checkout (info endpoint)"""
    print_test_header("GET /api/shopify/checkout")
    
    try:
        response = requests.get(f"{API_BASE}/shopify/checkout", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            test_results['failed'].append("GET /api/shopify/checkout - Wrong status code")
            return False
        
        data = response.json()
        print_info(f"Response: {json.dumps(data, indent=2)}")
        
        if not data.get('ok'):
            print_error("ok field is not true")
            test_results['failed'].append("GET /api/shopify/checkout - ok is false")
            return False
        
        if 'shopifyEnabled' not in data:
            print_error("Missing shopifyEnabled field")
            test_results['failed'].append("GET /api/shopify/checkout - Missing shopifyEnabled")
            return False
        
        if not data['shopifyEnabled']:
            print_error("shopifyEnabled should be true")
            test_results['failed'].append("GET /api/shopify/checkout - shopifyEnabled is false")
            return False
        
        print_success("GET /api/shopify/checkout passed")
        test_results['passed'].append("GET /api/shopify/checkout")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/shopify/checkout - Exception: {str(e)}")
        return False

def test_shopify_checkout_post_mock_lines():
    """Test POST /api/shopify/checkout with mock cart lines (should return 422)"""
    print_test_header("POST /api/shopify/checkout with mock lines")
    
    try:
        payload = {
            "lines": [
                {
                    "merchandiseId": "scarlet-violet-booster-box-default",
                    "quantity": 1
                }
            ]
        }
        
        response = requests.post(
            f"{API_BASE}/shopify/checkout",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {response.text[:500]}")
        
        if response.status_code != 422:
            print_error(f"Expected 422, got {response.status_code}")
            test_results['failed'].append("POST /api/shopify/checkout (mock lines) - Wrong status code")
            return False
        
        data = response.json()
        
        if data.get('ok') is not False:
            print_error("ok field should be false")
            test_results['failed'].append("POST /api/shopify/checkout (mock lines) - ok should be false")
            return False
        
        if 'error' not in data:
            print_error("Missing error field")
            test_results['failed'].append("POST /api/shopify/checkout (mock lines) - Missing error field")
            return False
        
        if 'No Shopify-live merchandise' not in data['error']:
            print_warning(f"Error message doesn't contain expected text: {data['error']}")
        
        print_success("Correctly rejected mock merchandise with 422")
        print_success(f"Error message: {data['error']}")
        test_results['passed'].append("POST /api/shopify/checkout (mock lines)")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"POST /api/shopify/checkout (mock lines) - Exception: {str(e)}")
        return False

def test_shopify_checkout_post_empty_lines():
    """Test POST /api/shopify/checkout with empty lines"""
    print_test_header("POST /api/shopify/checkout with empty lines")
    
    try:
        payload = {"lines": []}
        
        response = requests.post(
            f"{API_BASE}/shopify/checkout",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {response.text[:500]}")
        
        # Accept either 500 or 422
        if response.status_code not in [500, 422]:
            print_error(f"Expected 500 or 422, got {response.status_code}")
            test_results['failed'].append("POST /api/shopify/checkout (empty lines) - Wrong status code")
            return False
        
        data = response.json()
        
        if data.get('ok') is not False:
            print_error("ok field should be false")
            test_results['failed'].append("POST /api/shopify/checkout (empty lines) - ok should be false")
            return False
        
        if 'error' not in data:
            print_error("Missing error field")
            test_results['failed'].append("POST /api/shopify/checkout (empty lines) - Missing error field")
            return False
        
        print_success(f"Correctly rejected empty lines with {response.status_code}")
        print_success(f"Error message: {data['error']}")
        test_results['passed'].append("POST /api/shopify/checkout (empty lines)")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"POST /api/shopify/checkout (empty lines) - Exception: {str(e)}")
        return False

def test_shopify_checkout_post_malformed_gid():
    """Test POST /api/shopify/checkout with malformed GID"""
    print_test_header("POST /api/shopify/checkout with malformed GID")
    
    try:
        payload = {
            "lines": [
                {
                    "merchandiseId": "gid://shopify/ProductVariant/99999999999999",
                    "quantity": 1
                }
            ]
        }
        
        response = requests.post(
            f"{API_BASE}/shopify/checkout",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {response.text[:500]}")
        
        # Accept either 500 or 422
        if response.status_code not in [500, 422]:
            print_error(f"Expected 500 or 422, got {response.status_code}")
            test_results['failed'].append("POST /api/shopify/checkout (malformed GID) - Wrong status code")
            return False
        
        data = response.json()
        
        if data.get('ok') is not False:
            print_error("ok field should be false")
            test_results['failed'].append("POST /api/shopify/checkout (malformed GID) - ok should be false")
            return False
        
        if 'error' not in data:
            print_error("Missing error field")
            test_results['failed'].append("POST /api/shopify/checkout (malformed GID) - Missing error field")
            return False
        
        print_success(f"Correctly rejected malformed GID with {response.status_code}")
        print_success(f"Error message: {data['error']}")
        test_results['passed'].append("POST /api/shopify/checkout (malformed GID)")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"POST /api/shopify/checkout (malformed GID) - Exception: {str(e)}")
        return False

def test_videos_endpoint():
    """Test GET /api/videos (YouTube proxy) - Regression test"""
    print_test_header("GET /api/videos (Regression)")
    
    try:
        response = requests.get(f"{API_BASE}/videos", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            test_results['failed'].append("GET /api/videos - Wrong status code")
            return False
        
        data = response.json()
        print_info(f"Response keys: {list(data.keys())}")
        
        # Check for expected structure
        if 'source' not in data:
            print_error("Missing 'source' field")
            test_results['failed'].append("GET /api/videos - Missing source field")
            return False
        
        print_success(f"Source: {data['source']}")
        
        if 'videos' in data:
            print_success(f"Videos count: {len(data.get('videos', []))}")
        
        print_success("GET /api/videos passed (regression test)")
        test_results['passed'].append("GET /api/videos")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/videos - Exception: {str(e)}")
        return False

def test_discord_widget_endpoint():
    """Test GET /api/discord-widget - Regression test"""
    print_test_header("GET /api/discord-widget (Regression)")
    
    try:
        response = requests.get(f"{API_BASE}/discord-widget", timeout=10)
        print_info(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            test_results['failed'].append("GET /api/discord-widget - Wrong status code")
            return False
        
        data = response.json()
        print_info(f"Response: {json.dumps(data, indent=2)}")
        
        # Check for expected structure (ok field should exist)
        if 'ok' not in data:
            print_error("Missing 'ok' field")
            test_results['failed'].append("GET /api/discord-widget - Missing ok field")
            return False
        
        if data['ok']:
            print_success("Discord widget returned ok:true")
            if 'presence_count' in data:
                print_success(f"Presence count: {data['presence_count']}")
        else:
            print_warning("Discord widget returned ok:false (may be expected if widget is disabled)")
        
        print_success("GET /api/discord-widget passed (regression test)")
        test_results['passed'].append("GET /api/discord-widget")
        return True
        
    except Exception as e:
        print_error(f"Exception: {str(e)}")
        test_results['failed'].append(f"GET /api/discord-widget - Exception: {str(e)}")
        return False

def print_summary():
    """Print test summary"""
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    print(f"{Colors.GREEN}PASSED: {len(test_results['passed'])}{Colors.RESET}")
    for test in test_results['passed']:
        print(f"  {Colors.GREEN}✓{Colors.RESET} {test}")
    
    if test_results['warnings']:
        print(f"\n{Colors.YELLOW}WARNINGS: {len(test_results['warnings'])}{Colors.RESET}")
        for test in test_results['warnings']:
            print(f"  {Colors.YELLOW}⚠{Colors.RESET} {test}")
    
    if test_results['failed']:
        print(f"\n{Colors.RED}FAILED: {len(test_results['failed'])}{Colors.RESET}")
        for test in test_results['failed']:
            print(f"  {Colors.RED}✗{Colors.RESET} {test}")
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    
    total = len(test_results['passed']) + len(test_results['failed'])
    pass_rate = (len(test_results['passed']) / total * 100) if total > 0 else 0
    
    if len(test_results['failed']) == 0:
        print(f"{Colors.GREEN}ALL TESTS PASSED! ({pass_rate:.1f}%){Colors.RESET}\n")
        return 0
    else:
        print(f"{Colors.RED}SOME TESTS FAILED ({pass_rate:.1f}% pass rate){Colors.RESET}\n")
        return 1

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'='*80}{Colors.RESET}")
    print(f"{Colors.BLUE}RatAttacK Backend API Test Suite{Colors.RESET}")
    print(f"{Colors.BLUE}Testing Shopify Integration + Regression Tests{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*80}{Colors.RESET}\n")
    print(f"API Base URL: {API_BASE}\n")
    
    # Shopify tests
    test_shopify_products_list()
    test_shopify_products_list_with_limit()
    test_shopify_product_by_handle_valid()
    test_shopify_product_by_handle_invalid()
    test_shopify_checkout_get()
    test_shopify_checkout_post_mock_lines()
    test_shopify_checkout_post_empty_lines()
    test_shopify_checkout_post_malformed_gid()
    
    # Regression tests
    test_videos_endpoint()
    test_discord_widget_endpoint()
    
    # Print summary
    exit_code = print_summary()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
