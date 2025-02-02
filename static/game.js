import GameSceneFactory from './GameSceneFactory.js';
import Player from './Player.js';
import Scene from './Scene.js';
import SceneSwitcher from './SceneSwitcher.js';
import Tree from './tree.js';
import Zombie from "./zombie.js";
import Wall from "./Wall.js";
import Door from './Door.js';
import Chest from './Chest.js';

export const font = "20px Arial"

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.font = font
const webSocketHost = new WebSocket('ws://' + window.location.host + '/game/server')
const webSocket = new WebSocket('ws://' + window.location.host + '/game/login')
let serverID = ""
webSocket.onmessage = function(e) {
    const data = JSON.parse(e.data)
    //console.log("")
    //console.log(data)
    if (data.type == "runningservers"){
        console.log("running servers:")
        console.log(data.servers)
        scene.eventBus.triggerEvent("runningServers", data.servers)
    }

    if (data.type == "deletedGameObject") {

        scene.eventBus.triggerEvent("deletedGameObject", { ID: data.entityID, type: data.entityType })
        console.log(data)
    }

    if (data.type == "InventoryUpdate") {
        console.log(e)
        console.log(data)
        scene.eventBus.triggerEvent("inventory", data.Inventory)
        return
    }


    if (data.type == "connectionRefused") {
        console.log("connectionRefused")
        retry = true
    }
    if (data.type == "connectionAccepted") {
        console.log("connectionAccepted")
        isStarted = true
        scene.eventBus.triggerEvent("switchScene", { sceneToSwitch: 2 })
    }

    if (data.type == "position") {
        scene.eventBus.triggerEvent("position", { type: data.entityType, ID: data.ID, posx: data.posx, posy: data.posy })
        return
    }

    if (data.type == "healthUpdate") {
        scene.eventBus.triggerEvent("healthUpdate", { type: data.entityType, ID: data.ID, HP: data.HP })
        console.log("Health update IST DAAAA " + data.HP)
        return
    }
    if (data.type == "wallInformation") {
        scene.eventBus.triggerEvent("wallInformation", { wallID: data.wallID, posx2: data.posx2, posy2: data.posy2, thickness: data.thickness })

        return
    }

    if (data.type == "newGameObject") {
        if (data.entityType == "Wall") {
            const W = new Wall(scene, data.ID)
            scene.addObject(W)
            return
        }

        if (data.entityType == "Tree") {
            const t = new Tree(scene, data.ID)
            scene.addObject(t)
            return
        }
        if (data.entityType == "Player") {
            let player = new Player(100, 100, 20, 20, 'blue', 5, scene, data.ID)
            scene.addObject(player)
            return
        }
        if (data.entityType == "Zombie") {
            const z = new Zombie(scene, data.ID)
            scene.addObject(z)
        }
        if (data.entityType == "Door") {
            const d = new Door(scene, data.ID)
            scene.addObject(d)
        }
        if (data.entityType == "Chest") {
            console.log("Neue Kist?")
            const c = new Chest(scene, data.ID)
            scene.addObject(c)
        }

    }

    console.log(data)

    /*if(data.type == "position" && data.entityType == "Player"){
        scene.gameObjects[scene.playerIndex].posx = data.posx
        scene.gameObjects[scene.playerIndex].posy = data.posy
    }*/
}

webSocketHost.onmessage = function (e){
    const data = JSON.parse(e.data)
    switch (data.type) {
        case "serverReadyForPlayer":
            canConnect = true
            retry = false
            break;
    
        default:
            break;
    }
}

// Canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;




window.addEventListener('keydown', (e) => {
    //keys[e.key] = true;
    scene.eventBus.triggerEvent("keydown", { key: e.key, status: true })
});

window.addEventListener('keyup', (e) => {
    //keys[e.key] = false;
    scene.eventBus.triggerEvent("keydown", { key: e.key, status: false })
});

window.addEventListener("wheel", (e) => {
    scene.eventBus.triggerEvent("wheel", e.wheelDelta)
})


function websocket() { }

function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
    scene.process()
    scene.render()
    if (isStarted) {
        if (isDelayed == true) {
            if (frameCount >= 1) {
                updateToServer()
                frameCount = 0
            }
        }
        if (frameCount >= 10) {
            isDelayed = true
        }
        frameCount += 1
    }
    

    requestAnimationFrame(gameLoop); // Call the next frame
}


let factory = new GameSceneFactory(canvas, null)
let scene = factory.buildGameScene("mainMenu")
let loginID = -100
var frameCount = 0
var isDelayed = false
var isStarted = false
let canConnect = false
let serverToConnect = undefined
let retry = true
// Start the game loop
gameLoop();



canvas.addEventListener('click', (event) => {
    scene.eventBus.triggerEvent("click_on_canvas")
});

canvas.addEventListener("mousedown", (event) => {
    scene.eventBus.triggerEvent("mouseDown", { status: true })
});
canvas.addEventListener("mouseup", (event) => {
    scene.eventBus.triggerEvent("mouseDown", { status: false })
});

export function switchScene(sceneToSwitch) {
    console.log("NEW SCENE")
    getServers()
    scene = factory.buildGameScene(sceneToSwitch)
    //webSocketHost = new WebSocket('ws://' + window.location.host + '/game/server')
    //webSocket = new WebSocket('ws://' + window.location.host + '/game/login')

}


function updateToServer() {
    //console.log("Server update")
    if (scene.gameObjects[scene.playerIndex].object.constructor.name != "Player"){
        return
    }
    webSocket.send(JSON.stringify({ type: "action", up: scene.gameObjects[scene.playerIndex].up, down: scene.gameObjects[scene.playerIndex].down, left: scene.gameObjects[scene.playerIndex].left, right: scene.gameObjects[scene.playerIndex].right, actiontype: "movement" }))
}
export function getServerID() { return serverID }
export function loginToServer(serverName, loginID) {
    serverID = serverName

    console.log("PLAYER ID:")
    console.log(scene.mainPlayerID)
    console.log("LOGGIN IN TO SERVER: " + serverName)
    webSocket.send(JSON.stringify({ type: "login", ID: loginID, serverID: serverName }))
    //    isStarted = true
}

export async function loginToServerHost(serverName) {
    console.log("SETTING UP NEW SERVER: " + serverName)
    webSocketHost.send(JSON.stringify({ type: "startserver", serverID: serverName }))
    let d = new Date()
    loginID = Math.floor(Math.random() * 3000000001)
    scene.eventBus.triggerEvent("switchScene", { sceneToSwitch: "waitForLogin" })

    while (canConnect != true) {
        if (retry == true) {
            console.log("Trying to connect ...")
        }
        await wait(1000)
    }
    loginToServer(serverName, loginID)
}

export function generateItem(object) {
    console.log("Generating Item: " + object)
    webSocket.send(JSON.stringify({ type: "generateItem", itemID: object }))
}
export function sendCombineStacksRequest(ID1, ID2) {
    console.log("Sending combine Stacks Request: " + ID1 + " " + ID2)
    webSocket.send(JSON.stringify({ type: "combineStacks", stackID1: ID1, stackID2: ID2 }))
}
export function sendCraftingRequest(recipe) {
    webSocket.send(JSON.stringify({ type: "craft", recipe: recipe }))

}

export function getMainPlayerID() {
    return scene.mainPlayerID
}

export function hit() {
    console.log("HIT")
    webSocket.send(JSON.stringify({ type: "action", actiontype: "hit", direction: 100 }))
}
export function interact() {
    console.log("interact")
    webSocket.send(JSON.stringify({ type: "action", actiontype: "interact" }))


}
export function addTestInv() {
    scene.eventBus.triggerEvent("inventory", { "items": [{ "size": 99, "itemID": "Stick", "tags": [] }, { itemID: "Stick", size: 3, tags: {} }, { itemID: 2, size: 5, tags: {} }, { itemID: "Stick", size: 5, tags: {} }, { itemID: "Stick", size: 8, tags: {} }, { "size": 99, "itemID": "Stick", "tags": [] }, { itemID: "Stick", size: 3, tags: {} }, { itemID: 2, size: 5, tags: {} }, { itemID: "Stick", size: 5, tags: {} }, { itemID: "Stick", size: 8, tags: {} }] })
}

export function setHotbarSlot(stackID, slotNumber) {
    console.log("sending new Hotbarslot to Server: stackID:" + stackID + "  into slot number:" + slotNumber)
    webSocket.send(JSON.stringify({ type: "setHotbar", stackID: stackID, hotbarSlot: slotNumber }))
}
export function getServers() {
    webSocket.send(JSON.stringify({ type: "getRunningServers"}))
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
