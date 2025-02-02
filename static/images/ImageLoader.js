export default class ImageLoader {
    constructor() {
        this.cache = new Map(); // Cache loaded images
    }

    load(fileName, onLoadCallback, onErrorCallback) {
        if (this.cache.has(fileName)) {
            // If already cached, return the image
            onLoadCallback(this.cache.get(fileName));
            return;
        }

        const img = new Image();
        img.src = `/static/images/${fileName}`; // Adjust based on static file location

        img.onload = () => {
            this.cache.set(fileName, img); // Cache the loaded image
            onLoadCallback(img);
        };

        img.onerror = (e) => {
            console.error(`Failed to load image: ${fileName}`, e);
            if (onErrorCallback) {
                onErrorCallback(e);
            }
        };
    }
}