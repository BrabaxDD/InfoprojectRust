import GameObject from "../GameObject.js"
import { settings } from "../game.js"
import InventorySlot from "./InventorySlot.js"
import ButtonGameObject from "./Button.js"

export default class EquippedInventory extends GameObject {
    constructor(scene, inv, posx, posy) {
        super(scene)

        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")

        this.parentInventory = inv
        this.posx = posx
        this.posy = posy
        this.invWidth = 100
        this.invHeight = 100

        this.focusedStack = {}
        this.updateSlots()
    }

    updateSlots() {
        let image = this.parentInventory.dummyItem

        let c = this.focusedStack.itemID; // Get the item ID
        if (this.parentInventory.images[c]) {
            image = this.parentInventory.images[c];
        }
        this.handSlot = new InventorySlot(this.scene, this.posx, this.posy, this.imageSize, image, this.focusedStack)
    }

    render() {
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillSytle = settings.primaryColor
        this.ctx.fillRect(this.posx, this.posy, this.invWidth, this.invHeight);
        this.ctx.globalAlpha = 1;

        this.handSlot.render()
    }

    process() {

    }

    setFocusedItem(stack) {
        this.focusedStack = stack
    }
}
