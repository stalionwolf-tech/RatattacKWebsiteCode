#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build a premium RatAttacK Account Center with pages for profile, orders,
  order/[id], wishlist, vault, addresses, payment, security, settings. Use
  mock data shaped for Shopify Customer Accounts. Preserve the existing
  dark-fantasy premium aesthetic.

frontend:
  - task: "Account Center — /account overview"
    implemented: true
    working: true
    file: "app/account/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Verified via screenshot. Shows stats (orders, wishlist, vault, achievements), current order card, recommended-for-you strip. Sidebar with rank + points progress. Dark fantasy aesthetic preserved."

  - task: "Account Center — /account/orders"
    implemented: true
    working: true
    file: "app/account/orders/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Renders 4 mock orders with status pills (DELIVERED, IN_TRANSIT), pricing, tracking numbers, and item thumbnails."

  - task: "Account Center — /account/order/[id]"
    implemented: true
    working: true
    file: "app/account/order/[id]/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Dynamic order detail route tested with /account/order/RAT-1042. Shows tracking, line items, subtotal/shipping/total."

  - task: "Account Center — /account/profile"
    implemented: true
    working: true
    file: "app/account/profile/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Profile form (first/last name, email, phone) + shipping address section. Save Changes CTA."

  - task: "Account Center — /account/wishlist"
    implemented: true
    working: true
    file: "app/account/wishlist/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Empty-state 'Your Reliquary is Empty' with Browse Store CTA. Reads from localStorage."

  - task: "Account Center — /account/vault"
    implemented: true
    working: true
    file: "app/account/vault/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Three vault collections (Pull Targets, Singles Wishlist, Merch Drops) with item counts + thumbnails, plus New Collection CTA."

  - task: "Account Center — /account/addresses"
    implemented: true
    working: true
    file: "app/account/addresses/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Two mock addresses with default tag, Edit/Set Default/Delete actions, Add Address CTA."

  - task: "Account Center — /account/payment"
    implemented: true
    working: true
    file: "app/account/payment/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Two masked cards (Visa 4242 default, Mastercard 8319). Shopify Customer Accounts hand-off note included."

  - task: "Account Center — /account/security"
    implemented: true
    working: true
    file: "app/account/security/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Password change, email change, 2FA sections."

  - task: "Account Center — /account/settings"
    implemented: true
    working: true
    file: "app/account/settings/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Notification preferences (order updates, restock, community, promo) + security shortcuts."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Visually verified all 10 Account Center routes via screenshot tool. All render correctly with the dark-fantasy aesthetic. Mock data from lib/account.js is wired to every page. No regressions detected on the storefront, homepage, or other flows."
  - agent: "main"
    message: "Wired live Shopify Storefront API. Added env vars, created /app/lib/shopify.js (GraphQL fetch + adapter + safe fallback to mock catalog), API routes /api/shopify/products, /api/shopify/products/[handle], /api/shopify/checkout (cartCreate → hosted checkoutUrl). Updated /store, /store/product/[slug], /store/category/[slug] server components to fetch live products with graceful fallback. Cart page, Cart drawer, and mock Checkout 'Place Order' now POST cart lines to /api/shopify/checkout and redirect to Shopify checkoutUrl on success; fallback to preview /checkout on 422 (no Shopify variants yet). Shopify store is currently empty so mock catalog continues to render — will auto-switch to live products once merchant adds items in Shopify admin. Also added /privacy and /terms pages with matching aesthetic; wired Footer legal links. Added Profile link to Account Center sidebar."
  - agent: "testing"
    message: "BACKEND TESTING COMPLETE: All Shopify Storefront API routes tested and working correctly. Test results: 8/10 tests passed via external URL, 10/10 passed via localhost. The 2 POST request failures on external URL are due to Kubernetes ingress routing (502 Bad Gateway), NOT code issues - verified working correctly via localhost. All core functionality validated: product listing, product detail, checkout validation, error handling, graceful fallback to mock catalog. Regression tests passed: /api/videos (YouTube) and /api/discord-widget both working. No code changes needed."

backend:
  - task: "Shopify Storefront — fetch wrapper + fallback"
    implemented: true
    working: true
    file: "lib/shopify.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Storefront token verified with a live GraphQL call to ratattack-tcg.myshopify.com. Empty catalog → graceful fallback to mock via getAllProductsLive/getProductByHandleLive/getCollectionProductsLive."
      - working: true
        agent: "testing"
        comment: "TESTED: Shopify integration working correctly. shopifyEnabled:true, graceful fallback to 16 mock products when Shopify store is empty. All adapter functions (getAllProductsLive, getProductByHandleLive) working as designed."

  - task: "API — GET /api/shopify/products"
    implemented: true
    working: true
    file: "app/api/shopify/products/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "curl returned ok:true, source:'mock', shopifyEnabled:true, 16 items (mock fallback because Shopify store is empty)."
      - working: true
        agent: "testing"
        comment: "TESTED: Returns 200 with {ok:true, source:'mock', count:16, shopifyEnabled:true, products:[...]}. All required fields present. Product structure validated (id, handle, title, priceRange, featuredImage, variants). Query param ?first=10 also working."

  - task: "API — GET /api/shopify/products/[handle]"
    implemented: true
    working: true
    file: "app/api/shopify/products/[handle]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Dynamic product proxy with automatic mock fallback."
      - working: true
        agent: "testing"
        comment: "TESTED: Valid handle (scarlet-violet-booster-box) returns 200 with correct product. Invalid handle (does-not-exist-xyz) returns 404. Error handling working correctly."

  - task: "API — POST /api/shopify/checkout"
    implemented: true
    working: true
    file: "app/api/shopify/checkout/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Validates merchandiseId GID prefix; returns 422 with clear error for non-Shopify (mock) keys; POSTs cartCreate to Shopify and returns checkoutUrl when real variant IDs are provided."
      - working: true
        agent: "testing"
        comment: "TESTED: GET endpoint returns info correctly. POST with mock merchandiseId returns 422 with 'No Shopify-live merchandise' error (correct behavior). POST with empty lines returns 500 with 'No lines provided'. POST with malformed Shopify GID returns 500 with proper Shopify error. All validation working as designed. Note: External URL POST requests return 502 (Kubernetes ingress routing issue, not code issue - verified working via localhost)."

  - task: "API — GET /api/videos (regression)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "testing"
        comment: "TESTED: Regression test passed. Returns 200 with {source:'data-api', count:12, videos:[...]}. YouTube API integration working correctly."

  - task: "API — GET /api/discord-widget (regression)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "testing"
        comment: "TESTED: Regression test passed. Returns 200 with {ok:true, name:'RatAttacK', presence_count:4}. Discord widget integration working correctly."