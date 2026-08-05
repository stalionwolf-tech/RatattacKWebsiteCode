'use client';

/**
 * Compress an uploaded image File into a JPEG/PNG data URL sized for the web.
 *
 * Images are stored directly in MongoDB as data URLs, so we downscale and
 * re-encode to keep documents well under Mongo's 16MB limit while staying
 * crisp for the pack artwork / chase card displays.
 *
 * @param {File} file
 * @param {{ maxDim?: number, quality?: number }} [opts]
 * @returns {Promise<string>} data URL
 */
export async function compressImageToDataUrl(file, opts = {}) {
  const { maxDim = 1200, quality = 0.85 } = opts;

  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please choose a valid image file.');
  }

  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  // Preserve transparency for PNGs, otherwise use JPEG for smaller size.
  const hasAlpha = file.type === 'image/png' || file.type === 'image/webp';
  const mime = hasAlpha ? 'image/png' : 'image/jpeg';
  return canvas.toDataURL(mime, quality);
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the image.'));
    img.src = src;
  });
}
