import GameObject from "../GameObject.js";
import { font } from "../game.js";

export default class InventorySlot extends GameObject {
    constructor(scene, posx, posy, size, image, itemStack) {
        super(scene)

        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")

        this.scene.eventBus.registerListner("click_on_canvas", this)

        this.posx = posx
        this.posy = posy
        this.size = size

        this.image = image

        this.isSelected = false
        this.itemStack = itemStack
        console.log(this.image)
    }

    process() {
        if (this.scene.mousex > this.posx && this.scene.mousex < this.posx + this.size &&
            this.scene.mousey > this.posy && this.scene.mousey < this.posy + this.size) {
            this.isHovered = true
        }
        else {
            this.isHovered = false
        }
    }

    render() {
        this.ctx.fillStyle = ((this.isHovered == true) ? "red" : "green");
        this.ctx.fillRect(this.posx, this.posy, this.size, this.size);

        this.ctx.drawImage(
            this.image,
            this.posx,
            this.posy,
            this.size,
            this.size
        );

        if (this.isHovered) {
            this.ctx.fillStyle = "green";
            this.ctx.globalAlpha = 0.4;
            this.ctx.fillRect(this.posx, this.posy, this.size, this.size);
            this.ctx.globalAlpha = 1;
        }

        if (this.isSelected) {
            this.ctx.fillStyle = "red";
            this.ctx.lineWidth = 7
            this.ctx.strokeRect(this.posx, this.posy, this.size, this.size);
        }

        this.ctx.fillStyle = 'yellow';
        this.ctx.textBaseline = 'left';
        this.ctx.font = font;
        if (this.itemStack.itemID != "Empty") {
            this.ctx.fillText(this.itemStack.size, this.posx + this.size - 5, this.posy + this.size);
        }
    }

    event(eventString, eventObject) {
        if (eventString == "click_on_canvas" && this.isHovered) {
            console.log("clicked on itemstack: " + this.itemStack)
            this.isSelected = !this.isSelected
        }
    }

}
