import GameObject from "../GameObject.js"
import { loginToServer } from "../game.js"
import { loginToServerHost } from "../game.js"
import { generateItem } from "../game.js"
import { font } from "../game.js"
import Inventory from "./Inventory.js"

export default class ButtonGameObject extends GameObject {
    constructor(posx, posy, widthButton, heightButton, eventString, eventObject, scene, text) {
        super(scene)
        this.posx = posx
        this.posy = posy
        this.widhtButton = widthButton
        this.heightButton = heightButton

        this.eventObject = eventObject
        this.eventString = eventString

        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        this.scene.eventBus.registerListner("click_on_canvas", this)
        this.scene.eventBus.registerListner("textInputFinished", this)
        this.scene.eventBus.registerListner("textInputFinishedLoginField", this)
        this.scene.eventBus.registerListner("textInputFinishedCraftField", this)
        this.scene.eventBus.registerListner("optionSelected", this)
        this.is_hovered = false
        this.text = text
        this.textSize = font
        this.textColor = "black"
        this.ButtonPrimaryColor = "green"
        this.ButtonScondaryColor = "yellow"
        this.eventObject = eventObject
        this.textOfLoginField = ""
        this.textOfCraftField = ""
        this.serverToLogin = undefined

        this.isLocked = false

    }
    
    lockButton() {
        this.isLocked = true
    }

    unlockButton() {
        this.isLocked = false
    }

    process() {
        if (this.isLocked != true && this.scene.mousex > this.posx && this.scene.mousex < this.posx + this.widhtButton &&
            this.scene.mousey > this.posy && this.scene.mousey < this.posy + this.heightButton) {
            this.is_hovered = true

        }
        else {
            this.is_hovered = false
        }


    }

    render() {
        this.ctx.fillStyle = this.ButtonPrimaryColor;
        if (this.is_hovered == true) {
            this.ctx.fillStyle = this.ButtonScondaryColor
        }
        this.ctx.fillRect(this.posx, this.posy, this.widhtButton, this.heightButton)

        this.ctx.fillStyle = this.textColor;
        this.ctx.strokeStyle = this.textColor;
        this.ctx.font = this.textSize;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText(this.text, this.posx + (this.widhtButton / 2), this.posy + (this.heightButton / 2));
        //this.ctx.strokeText(text, this.posx+(this.widhtButton / 2), this.posy+(this.heightButton / 2));
    }

    buttonPresed(eventObject) {
        //this.scene.eventBus.triggerEvent("test",null)
        if (this.eventString == "switchScene") {
            this.scene.eventBus.triggerEvent("switchScene", eventObject)
            console.log(eventObject.sceneToSwitch)
        }
        if (this.eventString == "loginToServer") {
            if (this.serverToLogin != undefined) {
                loginToServer(this.serverToLogin)
            }

        }
        if (this.eventString == "loginToServerHost") {
            if (self.textOfTextField != "") {
                loginToServerHost(this.textOfLoginField)
            }
        }
        if (this.eventString == "generateItem") {
            generateItem(eventObject)
        }
        if (this.eventString == "combineStacks") {
            this.scene.eventBus.triggerEvent("combineStacks", eventObject)
        }
        if (this.eventString == "selectAll") {
            this.scene.eventBus.triggerEvent("selectAll", eventObject)
        }
        if (this.eventString == "splitStack") {
            this.scene.eventBus.triggerEvent("splitStack", eventObject)
        }
        if (this.eventString == "craftsticks") {
            this.scene.eventBus.triggerEvent("craftsticks", eventObject)
        }
        if (this.eventString == "CraftRequest") {
            if (self.textOfTextField != "") {
                this.scene.eventBus.triggerEvent("CraftRequest", { recipe: this.textOfCraftField })
            }
            else {
            }
        }
        if (this.eventString == "equipItem") {
            this.scene.eventBus.triggerEvent("equipItem", eventObject)
        }

    }

    event(eventString, eventObject) {
        if (eventString == "click_on_canvas" && this.is_hovered == true) {
            this.buttonPresed(this.eventObject)
            console.log("button Pressed")
        }
        if (eventString == "textInputFinishedLoginField") {
            this.textOfLoginField = eventObject.storedText
        }
        if (eventString == "textInputFinishedCraftField") {
            this.textOfCraftField = eventObject.storedText
        }
        if (eventString == "optionSelected") {
            this.serverToLogin = eventObject
        }


    }

    setTextSize(size) {
        this.textSize = size
    }

    setTextColor(color) {
        this.textColor = color
    }

    setButtonColorPrimary(color) {
        this.ButtonPrimaryColor = color
    }

    setButtonColorSecondary(color) {
        this.ButtonScondaryColor = color
    }

}
