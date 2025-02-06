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
        img.src = `/static/images/${fileName}`;

        img.onload = () => {
            this.cache.set(fileName, img); 
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