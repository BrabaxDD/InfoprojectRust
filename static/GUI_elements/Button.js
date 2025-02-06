import GameObject from "../GameObject.js"
import { settings } from "../game.js"
import Inventory from "./Inventory.js"
import { websocketObject} from "../game.js"

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
        this.textSize = settings.font
        this.textColor = "black"
        this.ButtonPrimaryColor = settings.primaryColor
        this.ButtonScondaryColor = settings.secondaryColor
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

        //Pop up next to recipie selection
        if (this.eventString == "selectRecipe" && this.is_hovered) {
            this.ctx.fillStyle = this.ButtonPrimaryColor;
            this.ctx.fillRect(this.posx + this.widhtButton, this.posy - this.heightButton / 2 , this.widhtButton, 2*this.heightButton)
            this.ctx.strokeStyle = this.textColor;
            this.ctx.fillStyle = this.textColor;
            this.ctx.fillText(this.eventObject.requires, this.posx + (3*this.widhtButton / 2), this.posy );
            this.ctx.fillText("-> "+this.eventObject.produces, this.posx + (3*this.widhtButton / 2), this.posy + (this.heightButton));
        }
    }

    buttonPresed(eventObject) {
        //this.scene.eventBus.triggerEvent("test",null)
        if (this.eventString == "switchScene") {
            this.scene.eventBus.triggerEvent("switchScene", eventObject)
        }
        if (this.eventString == "loginToServer") {
            if (this.serverToLogin != undefined) {
                let loginID = Math.floor(Math.random() * 3000000001)
                websocketObject.loginToServer(this.serverToLogin, loginID)
            }

        }
        if (this.eventString == "loginToServerHost") {
            if (this.textOfLoginField != "") {
                websocketObject.loginToServerHost(this.textOfLoginField)
            }
        }
        if (this.eventString == "generateItem") {
            websocketObject.generateItem(eventObject)
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
            if (this.textOfCraftField != "") {
                this.scene.eventBus.triggerEvent("CraftRequest", { recipe: this.textOfCraftField })
            }
            else {
            }
        }
        if (this.eventString == "increaseQuantity"){
            this.scene.eventBus.triggerEvent("increaseQuantity", eventObject)
        }
        if (this.eventString == "decreaseQuantity"){
            this.scene.eventBus.triggerEvent("decreaseQuantity", eventObject)
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
