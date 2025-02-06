import Chest from "./Chest.js"
import Door from "./Door.js"
import Player from "./Player.js"
import Tree from "./tree.js"
import Wall from "./Wall.js"
import Zombie from "./zombie.js"
import { start } from "./game.js"
import { DOM } from "./game.js"

export default class WebsocketGameObjectClient {
    constructor(scene) {

        this.scene = scene
        this.webSocketHost = new WebSocket('ws://' + window.location.host + '/game/server')
        this.webSocket = new WebSocket('ws://' + window.location.host + '/game/login')

        this.loginID = -100
        this.canConnect = false
        this.serverToConnect = undefined
        this.retry = true
        this.serverID = ""
    }

    setScene(scene) {
        this.scene = scene;
        this.webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (data.type == "runningservers") {
                console.log("running servers: " + data.servers)
                this.scene.eventBus.triggerEvent("runningServers", data.servers)
                return
            }

            if (data.type == "deletedGameObject") {

                this.scene.eventBus.triggerEvent("deletedGameObject", { ID: data.entityID, type: data.entityType })
                return
            }

            if (data.type == "InventoryUpdate") {
                this.scene.eventBus.triggerEvent("inventory", data.Inventory)
                return
            }


            if (data.type == "connectionRefused") {
                console.log("connectionRefused")
                this.scene.eventBus.triggerEvent("alert", { text: "Connection to Server refused" })
                DOM.updateDOMConnectionStatus("Connection Failed")
                return
            }
            if (data.type == "connectionAccepted") {
                console.log("connectionAccepted")
                start()
                this.scene.eventBus.triggerEvent("switchScene", { sceneToSwitch: 2 })
                DOM.updateDOMConnectionStatus("Connected")
                return
            }

            if (data.type == "position") {
                this.scene.eventBus.triggerEvent("position", { type: data.entityType, ID: data.ID, posx: data.posx, posy: data.posy })
                return
            }

            if (data.type == "healthUpdate") {
                this.scene.eventBus.triggerEvent("healthUpdate", { type: data.entityType, ID: data.ID, HP: data.HP })
                console.log("Health Update Received: " + data.HP)
                return
            }
            if (data.type == "wallInformation") {
                this.scene.eventBus.triggerEvent("wallInformation", { wallID: data.wallID, posx2: data.posx2, posy2: data.posy2, thickness: data.thickness })
                return
            }

            if (data.type == "newGameObject") {
                if (data.entityType == "Wall") {
                    const W = new Wall(scene, data.ID)
                    this.scene.addObject(W)
                    return
                }

                if (data.entityType == "Tree") {
                    const t = new Tree(scene, data.ID)
                    this.scene.addObject(t)
                    return
                }
                if (data.entityType == "Player") {
                    let player = new Player(100, 100, 20, 20, 'blue', 5, scene, data.ID)
                    this.scene.addObject(player)
                    return
                }
                if (data.entityType == "Zombie") {
                    const z = new Zombie(scene, data.ID)
                    this.scene.addObject(z)
                    return
                }
                if (data.entityType == "Door") {
                    const d = new Door(scene, data.ID)
                    this.scene.addObject(d)
                    return
                }
                if (data.entityType == "Chest") {
                    const c = new Chest(scene, data.ID)
                    this.scene.addObject(c)
                    return
                }

            }


        }

        this.webSocket.onclose = (event) => {
            this.scene.eventBus.triggerEvent("alert", { text: "Connection To Server Disrupted" })
            DOM.updateDOMConnectionStatus("Connection Failed")
            console.log('WebSocket closed:', event);
            console.log(`Code: ${event.code}, Reason: ${event.reason}`);
        };

        this.webSocketHost.onmessage = (e) => {
            const data = JSON.parse(e.data)
            switch (data.type) {
                case "serverReadyForPlayer":
                    this.canConnect = true
                    break;

                default:
                    break;
            }
        }

        this.webSocketHost.onclose = (event) => {
            this.scene.eventBus.triggerEvent("alert", { text: "Connection To Admin Socket Disrupted" })
            DOM.updateDOMConnectionStatus("Connection Failed")
            console.log('WebSocket closed:', event);
            console.log(`Code: ${event.code}, Reason: ${event.reason}`);
        };
    }

    updateToServer() {
        if (!this.webSocket.readyState == this.webSocket.OPEN) {
            DOM.updateDOMConnectionStatus("Disconnected")
            return
        }

        this.webSocket.send(JSON.stringify({
            type: "action",
            up: this.scene.gameObjects[this.scene.playerIndex].up,
            down: this.scene.gameObjects[this.scene.playerIndex].down,
            left: this.scene.gameObjects[this.scene.playerIndex].left,
            right: this.scene.gameObjects[this.scene.playerIndex].right,
            actiontype: "movement"
        }))



    }

    getServerID() { return this.serverID }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loginToServer(serverName, loginID) {
        this.serverID = serverName

        console.log("PLAYER ID: " + this.scene.mainPlayerID + "  LOGGIN IN TO SERVER: " + serverName)
        this.webSocket.send(JSON.stringify({ type: "login", ID: loginID, serverID: this.serverID }))
        DOM.updateDOMServerName(serverName)
        //    isStarted = true
    }

    async loginToServerHost(serverName) {
        console.log("SETTING UP NEW SERVER: " + serverName)
        this.webSocketHost.send(JSON.stringify({ type: "startserver", serverID: serverName }))
        let d = new Date()
        this.loginID = Math.floor(Math.random() * 3000000001)
        this.scene.eventBus.triggerEvent("switchScene", { sceneToSwitch: "waitForLogin" })

        while (this.canConnect == false) {
            console.log("Trying to connect ...")
            await this.wait(1000)
        }
        this.loginToServer(serverName, this.loginID)
    }

    generateItem(object) {
        console.log("Generating Item: " + object)
        this.webSocket.send(JSON.stringify({ type: "generateItem", itemID: object }))
    }
    sendCombineStacksRequest(ID1, ID2) {
        console.log("Sending combine Stacks Request: " + ID1 + " " + ID2)
        this.webSocket.send(JSON.stringify({ type: "combineStacks", stackID1: ID1, stackID2: ID2 }))
    }
    sendCraftingRequest(recipe) {
        this.webSocket.send(JSON.stringify({ type: "craft", recipe: recipe }))
    }

    getMainPlayerID() {
        return this.scene.mainPlayerID
    }

    hit() {
        console.log("HIT")
        this.webSocket.send(JSON.stringify({ type: "action", actiontype: "hit", direction: 100 }))
    }
    interact() {
        console.log("interact")
        this.webSocket.send(JSON.stringify({ type: "action", actiontype: "interact" }))
    }
    addTestInv() {
        this.scene.eventBus.triggerEvent("inventory", { "items": [{ "size": 99, "itemID": "Stick", "tags": [] }, { itemID: "Stick", size: 3, tags: {} }, { itemID: 2, size: 5, tags: {} }, { itemID: "Stick", size: 5, tags: {} }, { itemID: "Stick", size: 8, tags: {} }, { "size": 99, "itemID": "Stick", "tags": [] }, { itemID: "Stick", size: 3, tags: {} }, { itemID: 2, size: 5, tags: {} }, { itemID: "Stick", size: 5, tags: {} }, { itemID: "Stick", size: 8, tags: {} }] })
    }

    setHotbarSlot(stackID, slotNumber) {
        console.log("sending new Hotbarslot to Server: stackID:" + stackID + "  into slot number:" + slotNumber)
        this.webSocket.send(JSON.stringify({ type: "setHotbar", stackID: stackID, hotbarSlot: slotNumber }))
    }
    getServers() {
        this.webSocket.send(JSON.stringify({ type: "getRunningServers" }))
    }
    setSLotNumber(number) {
        this.webSocket.send(JSON.stringify({ type: "setActiveSlot", slot: number }))
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

