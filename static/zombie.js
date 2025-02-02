import GameObject from "./GameObject.js"
import { hit } from "./game.js"
import { addTestInv } from "./game.js"
import Inventory from "./GUI_elements/Inventory.js"

export default class Zombie extends GameObject {
    constructor(scene, ID) {
        super(scene)
        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        this.scene.eventBus.registerListner("position", this)
        this.ID = ID
        this.posx = 0
        this.posy = 0
    }
    event(eventString, eventObject){
        if (eventString == "position" && eventObject.type == "Zombie" && eventObject.ID == this.ID) {
            this.posx = eventObject.posx
            this.posy = eventObject.posy
        }
    }

    render(){
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth/2) , this.posy - (this.scene.camera.posy- this.scene.camera.cameraHeight/2), 40, 40);
        
    }
    process(){}






}
