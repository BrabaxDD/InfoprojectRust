import GameObject from "../GameObject.js";
import { settings } from "../game.js";

export default class CanvasTextInput extends GameObject{
    constructor(scene, posx, posy, widthButton, heightButton,eventString, focusedOnCreation) {

        super(scene)
        this.canvas = this.scene.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.inputText = ''; 
        this.isFocused = (focusedOnCreation == true) ? true : false;
        this.storedText = ""; 
        this.textSize = settings.font;
        
        this.posx = posx//100
        this.posy = posy//50
        this.widthBox = widthButton//200
        this.heightBox = heightButton//30;

        this.scene.eventBus.registerListner("click_on_canvas",this)
        this.eventString = eventString
        
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    
    event(eventString, eventObject) {
        if (eventString == "click_on_canvas"){
            this.isFocused = true;
            if (this.scene.mousex >  this.posx && this.scene.mousex < this.posx + this.widthBox && 
                this.scene.mousey >  this.posy && this.scene.mousey < this.posy + this.heightBox){
                this.isFocused = true;
                
            } 
            else{
                this.isFocused = false;
                this.inputText = this.storedText
            }
        }
        
    }

    process(){
        
    }

    handleKeyDown(event) {
        if (!this.isFocused) return;

        if (event.key === 'Enter') {
            this.storedText = this.inputText; 
            //this.inputText = ''; 
            this.scene.eventBus.triggerEvent(this.eventString,{storedText:this.storedText})
        } else if (event.key === 'Backspace') {
            this.inputText = this.inputText.slice(0, -1); 
        } else if (event.key.length === 1) {
            this.inputText += event.key; 
        }
        this.storedText = this.inputText; 
        this.scene.eventBus.triggerEvent(this.eventString,{storedText:this.storedText})
        this.render();
    }

   
    render() {
       
        this.ctx.strokeStyle = this.isFocused ? settings.textInputFocusedColor : settings.textInputUnFocusedColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.posx, this.posy, this.widthBox, this.heightBox);
        

        this.ctx.font = this.textSize;
        this.ctx.fillStyle = 'black';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.inputText, this.posx + (this.widthBox/2), this.posy + (this.heightBox / 2));

        //  Draw stored text for debugging
        /*if (this.storedText !== null) {
            this.ctx.fillStyle = 'gray';
            this.ctx.fillText(`Stored: ${this.storedText}`, this.posx, this.posy + this.heightBox + 20);
        }*/
    }
}

