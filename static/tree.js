import GameObject from "./GameObject.js"

export default class Tree extends GameObject {
    constructor(scene, ID) {
        super(scene)
        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        this.scene.eventBus.registerListner("position", this)
        this.ID = ID
        this.posx = 0
        this.posy = 0
        this.image = null
        this.scene.imageLoader.load(
            "Tree1.png",
            (image) => {
                this.image = image;
            },
            (error) => {
                console.error(`Error preloading tile image: ${fileName}`, error);
            }
        );
    }

    render() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth / 2), this.posy - (this.scene.camera.posy - this.scene.camera.cameraHeight / 2), 10, 10);

        if (this.image != null) {
            this.ctx.drawImage(
                this.image,
                this.posx - 64 - (this.scene.camera.posx - this.scene.camera.cameraWidth / 2),
                this.posy - 64 - (this.scene.camera.posy - this.scene.camera.cameraHeight / 2),
            );
        }
    }


    process() { }

    event(eventString, eventObject) {
        if (eventString == "position" && eventObject.type == "Tree" && eventObject.ID == this.ID) {
            this.posx = eventObject.posx
            this.posy = eventObject.posy
        }
    }
}
