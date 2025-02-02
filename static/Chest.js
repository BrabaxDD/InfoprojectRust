import GameObject from "./GameObject.js"
import { font } from "./game.js"

export default class Chest extends GameObject {
    constructor(scene, ID) {
        super(scene)
        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        this.ID = ID

        this.scene.eventBus.registerListner("position", this)
        this.posx = 0
        this.posy = 0
        this.isToRender = false
        this.image = null
        this.scene.imageLoader.load(
            "Chest.png",
            (image) => {
                this.image = image;
            },
            (error) => {
                console.error(`Error preloading tile image: ${fileName}`, error);
            }
        );
        console.log("Neue Kist wir generiert ")
    }

    render() {
        if (this.isToRender == true) {
            this.ctx.fillStyle = "brown";
            this.ctx.fillRect(this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth / 2), this.posy - (this.scene.camera.posy - this.scene.camera.cameraHeight / 2), 10, 10);

            if (this.image != null) {
                this.ctx.drawImage(
                    this.image,
                    this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth / 2),
                    this.posy - (this.scene.camera.posy - this.scene.camera.cameraHeight / 2),
                    32,
                    32
                );
            }
        }
    }


    process() {
    }

    event(eventString, eventObject) {
        if (eventString == "position" && eventObject.type == "Chest" && eventObject.ID == this.ID) {
            this.posx = eventObject.posx
            this.posy = eventObject.posy
            if (this.isToRender == false) {
                this.isToRender = true
                console.log("Chest can now be seen")
            }
        }
    }
}

