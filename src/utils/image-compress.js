import { IMAGE_MAX_SIZE_BYTES, IMAGE_FORMAT } from '../../lib/constants.js';

export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > 1200) { height = (height * 1200) / width; width = 1200; }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (blob.size > IMAGE_MAX_SIZE_BYTES) {
          reject(new Error(`Image too large: ${(blob.size / 1024).toFixed(1)}KB > 500KB`));
        } else {
          resolve(blob);
        }
      }, `image/${IMAGE_FORMAT}`, 0.8);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
