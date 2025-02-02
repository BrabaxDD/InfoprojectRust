import GameObject from "../GameObject.js";
import ButtonGameObject from "./Button.js";
import Dropdown from "./Dropdown.js";
import CanvasTextInput from "./TextInput.js";

export default class CreateGameMenu extends GameObject{
    constructor(scene){
        super(scene)
        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")
        this.loginButton = new ButtonGameObject(this.canvas.width / 3 - 100, this.canvas.height / 5 * 4 - 28, 200, 56, "loginToServer", {}, scene, "Login")
        this.hostButton = new ButtonGameObject(this.canvas.width / 3 * 2 - 100, this.canvas.height / 5 * 4 - 28, 200, 56, "loginToServerHost", {}, scene, "Host")
        
        this.inputField = new CanvasTextInput(scene, this.canvas.width / 3*2 - 100, this.canvas.height / 2 - 15, 200, 30, "textInputFinishedLoginField", true)

        this.dropdownMenu = new Dropdown(scene,["Option1","Option2","option3"],this.canvas.width / 3 - 100,this.canvas.height / 2 - 28,200, 56)
    }   

    process(){
        this.loginButton.process()
        this.hostButton.process()
        this.inputField.process()
        this.dropdownMenu.process()
    }

    render(){
        
        this.ctx.fillStyle = "grey";
        if (this.scene.mousex > this.canvas.width/2){
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillRect(this.canvas.width/2, 0,this.canvas.width/2, this.canvas.height)
            this.ctx.globalAlpha = 1;
        }
        else{
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillRect(0, 0,this.canvas.width/2, this.canvas.height)
            this.ctx.globalAlpha = 1;
        }
        if (this.dropdownMenu.isOpen == true){
            this.loginButton.lockButton()
        }
        else{
            this.loginButton.unlockButton()
        }
        this.hostButton.render()
        this.loginButton.render()
        this.dropdownMenu.render()
        this.inputField.render()
    }
}