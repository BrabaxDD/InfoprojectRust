import GameSceneFactory from "./GameSceneFactory.js";
import {switchScene} from "./game.js";

export default class SceneSwitcher{
    constructor(scene){
        this.scene = scene
        this.scene.eventBus.registerListner("switchScene", this)
    }

    getScene(){
        return this.scene
    }

    event(eventString, eventObject){
        console.log("switching Scene to: "+eventObject.sceneToSwitch)
        if (eventString == "switchScene"){
            switchScene(eventObject.sceneToSwitch)
        }
    }



}
