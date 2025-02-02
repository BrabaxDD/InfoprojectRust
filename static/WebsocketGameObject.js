import GameObject from "./GameObject.js"
import GameSceneFactory from './GameSceneFactory.js';
import Player from './Player.js';
import Scene from './Scene.js';
import SceneSwitcher from './SceneSwitcher.js';
import Tree from './tree.js';
import Zombie from "./zombie.js";



export default class websocketGameObjectClient extends GameObject {
    constructor(scene, serverName) {
        super(scene)
        this.serverName = serverName
        this.webSocket = new WebSocket('ws://' + window.location.host + '/game/login')
        this.webSocket.onmessage = function(e) {
            const data = JSON.parse(e.data)
            //console.log("")
            //console.log(data)


            if (data.type == "InventoryUpdate") {
                console.log(e)
                console.log(data)
                this.scene.eventBus.triggerEvent("inventory", data.Inventory)
            }

            if (data.type == "position") {
                this.scene.eventBus.triggerEvent("position", { type: data.entityType, ID: data.ID, posx: data.posx, posy: data.posy })
            }

            if (data.type == "newGameObject") {

                if (data.entityType == "Tree") {
                    const t = new Tree(scene, data.ID)
                    this.scene.addObject(t)
                    console.log(scene.gameObjects)
                }
                if (data.entityType == "Player") {
                    let player = new Player(100, 100, 20, 20, 'blue', 5, scene, data.ID)
                    this.scene.addObject(player)
                }
                if (data.entityType == "Zombie") {
                    const z = new Zombie(scene, data.ID)
                    this.scene.addObject(z)
                    console.log("new Zombie")
                    console.log(scene.gameObjects)
                }

            }

            /*if(data.type == "position" && data.entityType == "Player"){
                scene.gameObjects[scene.playerIndex].posx = data.posx
                scene.gameObjects[scene.playerIndex].posy = data.posy
            }*/




        }

    }
}

