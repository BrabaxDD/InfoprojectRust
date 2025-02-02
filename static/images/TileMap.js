import GameObject from "../GameObject.js";
import ImageLoader from "./ImageLoader.js";

export default class TileMap extends GameObject {
    constructor(scene, tileSize, mapName) {
        super(scene);
        this.tileSize = tileSize;
        this.scene = scene;
        this.canvas = this.scene.canvas;
        this.ctx = this.scene.canvas.getContext("2d");
        this.fileName = mapName;

        this.imageLoader = this.scene.imageLoader;
        this.tileMap = {
            0: "Water.png",
            1: "Sand.png",
            2: "FloorNew.png",
            3: "Street.png",
            4: "WoodenFloor.png",
            5: "Grass.png",
            6: "GrassCity.png"
        };

        this.preloadedImages = {}; // Store preloaded images
        this.map = [];

        if (this.fileName) {
            this.loadMap(this.fileName).then((map) => {
                if (map) this.map = map;
            });
        }

        this.preloadTileImages();
    }

    async loadMap(fileName) {
        try {
            const response = await fetch(`/static/images/TileMaps/${fileName}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const mapData = (await response.text()).trim().split("\n").map(row => row.split(",").map(Number));
            return mapData;
        } catch (error) {
            console.error("Error loading map file:", error);
            return null;
        }
    }

    preloadTileImages() {
        for (const [tile, fileName] of Object.entries(this.tileMap)) {
            this.imageLoader.load(
                fileName,
                (image) => {
                    this.preloadedImages[tile] = image;
                },
                (error) => {
                    console.error(`Error preloading tile image: ${fileName}`, error);
                }
            );
        }
    }

    render() {
        if (!this.map.length) return;
    
        const { posx, posy, cameraWidth, cameraHeight } = this.scene.camera;
        const tileSize = this.tileSize;
        const ctx = this.ctx;
        const renderRadius = 200; // Maximum render distance in pixels
    
        ctx.imageSmoothingEnabled = false;
        ctx.save();
        ctx.translate(
            Math.floor(-(posx - cameraWidth / 2)),
            Math.floor(-(posy - cameraHeight / 2))
        );
    
        const startX = Math.max(0, Math.floor((posx - cameraWidth / 2) / tileSize));
        const endX = Math.min(this.map[0].length, Math.ceil((posx + cameraWidth / 2) / tileSize));
        const startY = Math.max(0, Math.floor((posy - cameraHeight / 2) / tileSize));
        const endY = Math.min(this.map.length, Math.ceil((posy + cameraHeight / 2) / tileSize));
    
        for (let row = startY; row < endY; row++) {
            for (let column = startX; column < endX; column++) {
                const tile = this.map[row][column];
                const image = this.preloadedImages[tile];
    
                if (image) {
                    // Calculate the center of the current tile
                    const tileCenterX = column * tileSize + tileSize / 2;
                    const tileCenterY = row * tileSize + tileSize / 2;
    
                    // Calculate the distance from the camera's center to the tile
                    const dx = tileCenterX - posx;
                    const dy = tileCenterY - posy;
                    const distance = Math.sqrt(dx * dx + dy * dy);
    
                    // Render only if within the specified render radius
                    if (distance <= this.scene.camera.cullingDisance) {
                        ctx.drawImage(
                            image,
                            Math.floor(column * tileSize),
                            Math.floor(row * tileSize),
                            tileSize + 1,
                            tileSize + 1
                        );
                    }
                }
            }
        }
    
        ctx.restore();
    }
    
    

    
}
