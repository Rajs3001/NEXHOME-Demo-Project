const path = require('path');
const fs = require('fs');

/**
 * Image Service
 * Handles image operations for properties
 */

class ImageService {
    /**
     * Get image URL from filename
     */
    static getImageUrl(filename) {
        if (!filename) return null;
        // If it's already a URL, return as is
        if (filename.startsWith('http')) {
            return filename;
        }
        // Return relative path for local files
        return `/uploads/properties/${filename}`;
    }

    /**
     * Get multiple image URLs
     */
    static getImageUrls(imageString) {
        if (!imageString) return [];
        
        // If it's a JSON string, parse it
        if (imageString.startsWith('[') || imageString.startsWith('{')) {
            try {
                const parsed = JSON.parse(imageString);
                if (Array.isArray(parsed)) {
                    return parsed.map(img => this.getImageUrl(img));
                }
            } catch (e) {
                // If parsing fails, treat as single image
            }
        }
        
        // Treat as comma-separated string or single image
        const images = imageString.split(',').map(img => img.trim()).filter(Boolean);
        return images.map(img => this.getImageUrl(img));
    }

    /**
     * Save image filenames as JSON string
     */
    static saveImageString(filenames) {
        if (!filenames || filenames.length === 0) return null;
        if (Array.isArray(filenames)) {
            return JSON.stringify(filenames);
        }
        return filenames;
    }

    /**
     * Delete image file
     */
    static deleteImage(filename) {
        if (!filename || filename.startsWith('http')) {
            return; // Don't delete external URLs
        }
        
        const filePath = path.join(__dirname, '../../uploads/properties', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Delete multiple images
     */
    static deleteImages(imageString) {
        if (!imageString) return;
        
        try {
            const images = JSON.parse(imageString);
            if (Array.isArray(images)) {
                images.forEach(img => this.deleteImage(img));
            }
        } catch (e) {
            // If not JSON, treat as single image
            this.deleteImage(imageString);
        }
    }
}

module.exports = ImageService;

