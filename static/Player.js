import GameObject from "./GameObject.js"
import { settings } from "./game.js"
import Inventory from "./GUI_elements/Inventory.js"
import { websocketObject } from "./game.js"


export default class Player extends GameObject {
    constructor(x, y, width, height, color, speed, scene, playerID) {
        super(scene)
        this.posx = x
        this.posy = y
        this.width = width
        this.height = height
        this.color = color
        this.speed = speed
        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        //this.keys = keys
        //this.scene.eventBus.registerListner("test", this)
        this.scene.eventBus.registerListner("position", this)
        this.scene.eventBus.registerListner("healthUpdate", this)
        this.scene.eventBus.registerListner("playerSet", this)
        this.up = false
        this.down = false
        this.left = false
        this.right = false
        this.playerID = playerID
        this.onCooldown = 0

        this.hp = 999999

        
        //this.inventory = new Inventory(this.scene)
        //this.scene.addObject(this.inventory)
        
        console.log("my ID: ", this.playerID, " serverPlayerID: ", this.scene.mainPlayerID)
    }

    process() {
        if (this.scene.keys[settings.forwardKey]) {
            this.up = true
            if (this.posy > 0) { }
            //this.posy -= this.speed; // Move up
        } else {
            this.up = false
        }


        if (this.scene.keys[settings.backKey]) {
            this.down = true
            if (this.posy < this.canvas.height - this.height) {
                //this.posy += this.speed; // Move down
            }
        } else {
            this.down = false
        }

        if (this.scene.keys[settings.leftKey]) {
            this.left = true
            if (this.posx > 0) {
                //this.posx -= this.speed; // Move left
            }
        } else { this.left = false }

        if (this.scene.keys[settings.rightKey]) {
            this.right = true
            if (this.posx < this.canvas.width - this.width) {
                //this.posx += this.speed; // Move right
            }
        }
        else {
            this.right = false
        }

        if (this.scene.keys[settings.hitKey] == true && this.onCooldown <= 0) {
            websocketObject.hit()
            //addTestInv()
            this.onCooldown = 10
        }
        if (this.scene.keys[settings.interactKey] == true) {
            websocketObject.interact()
        }

        if (this.onCooldown >= 0){
            this.onCooldown -= 1
        }

        if (this.scene.keys["t"] == true) {
            this.scene.eventBus.triggerEvent("alert", {text:"Player triggered alert"})
        }
    }

    render() {
        this.ctx.fillStyle = settings.playerColor;
        this.ctx.fillRect(this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth / 2), this.posy - (this.scene.camera.posy - this.scene.camera.cameraHeight / 2), this.width, this.height);


        //Render Health bar
        if (this.playerID == this.scene.mainPlayerID) {
            const healthString = "Health: " + (this.hp).toString()
            const sString = this.ctx.measureText(healthString)

            const heightHealth = 40
            let widthHealth = Math.ceil(sString.width / 5) * 6

            const xHealth = heightHealth/2
            const yHealth = heightHealth/2

            this.ctx.fillStyle = settings.primaryColor;
            this.ctx.globalAlpha = 0.4;
            this.ctx.fillRect(xHealth, yHealth, widthHealth, heightHealth);
            this.ctx.globalAlpha = 1;

            this.ctx.fillStyle = 'black';

            this.ctx.font = settings.font;
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(healthString, xHealth + widthHealth / 2, yHealth + heightHealth / 2);
        }
    }
    event(eventString, eventObject) {
        if (eventString == "position" && eventObject.type == "Player" && eventObject.ID == this.playerID) {
            this.posx = eventObject.posx
            this.posy = eventObject.posy
        }
        if (eventString == "healthUpdate" && eventObject.type == "Player" && eventObject.ID == this.playerID) {
            this.hp = eventObject.HP
        }
    }
}
