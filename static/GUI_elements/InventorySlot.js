import GameObject from "../GameObject.js";
import { settings } from "../game.js";

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

        this.ctx.drawImage(
            this.image,
            this.posx,
            this.posy,
            this.size,
            this.size
        );

        if (this.isHovered) {
            this.ctx.fillStyle = settings.primaryColor;
            this.ctx.globalAlpha = 0.4;
            this.ctx.fillRect(this.posx, this.posy, this.size, this.size);
            this.ctx.globalAlpha = 1;
        }

        if (this.isSelected) {
            this.ctx.fillStyle = "red";
            this.ctx.lineWidth = 7
            this.ctx.strokeRect(this.posx, this.posy, this.size, this.size);
        }

        this.ctx.fillStyle = settings.invStackSizeColor;
        this.ctx.textBaseline = 'left';
        this.ctx.font = settings.font;
        if (this.itemStack.itemID != "Empty") {
            this.ctx.fillText(this.itemStack.size, this.posx + this.size - 5, this.posy + this.size);
        }
    }

    event(eventString, eventObject) {
        if (eventString == "click_on_canvas" && this.isHovered) {
            this.isSelected = !this.isSelected
        }
    }

}
