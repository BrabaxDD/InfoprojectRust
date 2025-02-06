import Player from "./Player.js";
import Scene from "./Scene.js";
import ButtonGameObject from "./GUI_elements/Button.js"
import GameObject from "./GameObject.js";
import CanvasTextInput from "./GUI_elements/TextInput.js";
import TileMap from "./images/TileMap.js";
import Tree from "./tree.js"
import { websocketObject } from "./game.js";
import Inventory from "./GUI_elements/Inventory.js";
import Dropdown from "./GUI_elements/Dropdown.js"
import CreateGameMenu from "./GUI_elements/CreateGameMenu.js";
import CraftingMenu from "./GUI_elements/CraftingMenu.js";
import WebsocketGameObjectClient from "./WebsocketGameObject.js";
export default class GameSceneFactory extends GameObject {
    constructor(canvas, keys, sceneObject) {
        super(sceneObject)
        this.canvas = canvas
        this.keys = keys

    }

    buildGameScene(wichSceneToRender) { //Das ist das Startfeld
        let scene = null
        switch (wichSceneToRender) {
            case "mainMenu":
            case 0:
                scene = new Scene(this.canvas, "");
                let button = new ButtonGameObject(this.canvas.width / 2 - 100, this.canvas.height / 3 - 28, 200, 56, "switchScene", { sceneToSwitch: "hostOrLogin" }, scene, "Play")
                scene.addObject(button)

                let button2 = new ButtonGameObject(this.canvas.width / 2 - 100, this.canvas.height / 3 * 2 - 28, 200, 56, "switchScene", { sceneToSwitch: "optionsMenu" }, scene, "Options")
                scene.addObject(button2)

                const recipes = [
                                                { name: "Wood", image: "wooden-stick.png" },
                                                { name: "Stone Axe (not working)", image: "stone-axe.png" },
                                                { name: "Iron Sword (not working)", image: "iron-sword.png" },
                                            ];
                const inv = new CraftingMenu(scene,50, 50, recipes)
                scene.addObject(inv)

                //let HostTest = new ButtonGameObject(this.canvas.width/3*2-100,this.canvas.height/5 -28,200,56,"loginToServerHost",{},scene,"Login as host ((test for message))")
              //scene.addObject(HostTest)

                //console.log(button.eventObject.sceneToSwitch)

                break;

            case "optionsMenu":
            case 1:
                scene = new Scene(this.canvas, "");
                let b2 = new ButtonGameObject(this.canvas.width / 2 - 100, this.canvas.height / 3 * 2 - 28, 200, 56, "switchScene", { sceneToSwitch: 0 }, scene, "Back To Main Menu")
                scene.addObject(b2)

                break;

            case "game":
            case 2:
                scene = new Scene(this.canvas, websocketObject.getServerID() + ".txt");
                scene.eventBus.triggerEvent("createInv")
                scene.eventBus.triggerEvent("createCraftMenu")
                
                //let tree = new Tree(scene)
                //scene.addObject(tree)
                //let lotTest = new ButtonGameObject(this.canvas.width/3-100,this.canvas.height/5-28,200,56,"generateItem","erstes Item",scene,"Generate erstes Item")
                //scene.addObject(lotTest)

                break;

            case "hostOrLogin":
            case 3:
                scene = new Scene(this.canvas, "");
                let menu = new CreateGameMenu(scene)
                scene.addObject(menu)
                break;
                
            case "waitForLogin":
            case 4:
                scene = new Scene(this.canvas, "")
                let but = new ButtonGameObject(this.canvas.width / 2 - 100, this.canvas.height / 3 - 28, 200, 56, "", {}, scene, "WAIT A BIT")
                scene.addObject(but)

                break;
        }
        //console.log(scene.gameObjects)
        return scene
    }

}
