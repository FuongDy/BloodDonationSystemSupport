// src/utils/imageUtils.js

/**
 * Compress an image file to reduce its size while maintaining quality
 * @param {File} file - The image file to compress
 * @param {number} maxSizeKB - Maximum size in KB (default: 900KB for safety)
 * @param {number} quality - Image quality (0-1, default: 0.7)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, maxSizeKB = 900, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    // If file is already small enough, return it as is
    if (file.size <= maxSizeKB * 1024) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // More aggressive compression for large files
      let compressionRatio = 1;
      const fileSizeMB = file.size / (1024 * 1024);
      
      // Calculate compression ratio based on file size
      if (fileSizeMB > 5) {
        compressionRatio = 0.4; // Very aggressive for files > 5MB
      } else if (fileSizeMB > 3) {
        compressionRatio = 0.5; // Aggressive for files > 3MB
      } else if (fileSizeMB > 2) {
        compressionRatio = 0.6; // Moderate for files > 2MB
      } else {
        compressionRatio = 0.7; // Light compression for smaller files
      }

      // Calculate new dimensions with compression ratio
      const MAX_WIDTH = 1000 * compressionRatio;
      const MAX_HEIGHT = 1000 * compressionRatio;
      
      let { width, height } = img;
      
      // Apply compression ratio to dimensions
      width = Math.floor(width * compressionRatio);
      height = Math.floor(height * compressionRatio);
      
      // Further scale down if still too large
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.floor((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.floor((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      // Ensure minimum readable dimensions
      const MIN_WIDTH = 400;
      const MIN_HEIGHT = 300;
      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        const scale = Math.max(MIN_WIDTH / width, MIN_HEIGHT / height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Optimize canvas context for compression
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';

      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Adjust quality based on file size
      let adjustedQuality = quality;
      if (fileSizeMB > 3) {
        adjustedQuality = Math.max(0.4, quality - 0.3);
      } else if (fileSizeMB > 2) {
        adjustedQuality = Math.max(0.5, quality - 0.2);
      }

      // Convert canvas to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }

          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: file.type === 'image/png' ? 'image/jpeg' : file.type, // Convert PNG to JPEG for better compression
            lastModified: Date.now(),
          });

          // If still too large, try with even lower quality
          if (compressedFile.size > maxSizeKB * 1024 && adjustedQuality > 0.2) {
            // Recursive compression with lower quality
            const newQuality = Math.max(0.2, adjustedQuality - 0.15);
            const newMaxSize = Math.floor(maxSizeKB * 0.9); // Reduce target size
            
            compressImage(file, newMaxSize, newQuality)
              .then(resolve)
              .catch(reject);
          } else {
            console.log(`Image compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${((1 - compressedFile.size/file.size) * 100).toFixed(1)}% reduction)`);
            resolve(compressedFile);
          }
        },
        file.type === 'image/png' ? 'image/jpeg' : file.type, // Convert PNG to JPEG
        adjustedQuality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL and load image
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    // Clean up object URL after image loads
    img.addEventListener('load', () => {
      URL.revokeObjectURL(objectUrl);
    }, { once: true });
  });
};

/**
 * Ultra aggressive image compression for very large files
 * @param {File} file - The image file to compress
 * @param {number} targetSizeKB - Target size in KB (default: 800KB)
 * @returns {Promise<File>} Ultra compressed image file
 */
export const ultraCompressImage = (file, targetSizeKB = 800) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Ultra aggressive dimensions
      const MAX_SIZE = 800; // Max width or height
      let { width, height } = img;
      
      // Calculate scale to fit within MAX_SIZE
      const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);
      
      if (scale < 1) {
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      // Ensure even dimensions for better compression
      width = width % 2 === 0 ? width : width - 1;
      height = height % 2 === 0 ? height : height - 1;

      canvas.width = width;
      canvas.height = height;

      // Optimize for compression
      ctx.imageSmoothingEnabled = false; // Disable smoothing for smaller file size
      ctx.drawImage(img, 0, 0, width, height);

      // Start with very low quality and increase if needed
      let quality = 0.3;
      
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg', // Force JPEG for best compression
              lastModified: Date.now(),
            });

            if (compressedFile.size <= targetSizeKB * 1024) {
              console.log(`Ultra compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${((1 - compressedFile.size/file.size) * 100).toFixed(1)}% reduction)`);
              resolve(compressedFile);
            } else if (quality > 0.1) {
              quality -= 0.05;
              tryCompress();
            } else {
              // Last resort: reduce dimensions further
              canvas.width = Math.floor(width * 0.8);
              canvas.height = Math.floor(height * 0.8);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              quality = 0.3;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.addEventListener('load', () => {
      URL.revokeObjectURL(objectUrl);
    }, { once: true });
  });
};

/**
 * Get human readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  const result = {
    isValid: true,
    error: null
  };

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    result.isValid = false;
    result.error = 'Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG';
    return result;
  }

  // Check file size (max 20MB before compression)
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    result.isValid = false;
    result.error = `Kích thước file quá lớn (${formatFileSize(file.size)}). Tối đa 20MB`;
    return result;
  }

  return result;
};
