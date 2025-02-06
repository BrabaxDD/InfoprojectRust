import GameSceneFactory from './GameSceneFactory.js';
import WebsocketGameObjectClient from "./WebsocketGameObject.js"
import Player from './Player.js';
import Scene from './Scene.js';
import SceneSwitcher from './SceneSwitcher.js';
import Tree from './tree.js';
import Zombie from "./zombie.js";
import Wall from "./Wall.js";
import Door from './Door.js';
import Chest from './Chest.js';
import DOMHandler from './DOMHandler.js';

export const font = "20px Arial"
export let settings = undefined

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.font = font
let serverID = ""


// Canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

//Startup Game
starupGame()

let factory = undefined
let scene = undefined

let frameCount = 0
let isDelayed = false
export const DOM = new DOMHandler()
let isStarted = false
export let websocketObject = undefined


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

canvas.addEventListener('click', (event) => {
    scene.eventBus.triggerEvent("click_on_canvas")
});

canvas.addEventListener("mousedown", (event) => {
    scene.eventBus.triggerEvent("mouseDown", { status: true })
});
canvas.addEventListener("mouseup", (event) => {
    scene.eventBus.triggerEvent("mouseDown", { status: false })
});


function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
    scene.process()
    scene.render()
    if (isStarted) {
        if (isDelayed == true) {
            if (frameCount >= 1) {
                websocketObject.updateToServer()
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

async function starupGame() {
    settings = await loadSettings()
    websocketObject = new WebsocketGameObjectClient(undefined)
    factory = new GameSceneFactory(canvas, null)
    scene = factory.buildGameScene("mainMenu")
    DOM.updateDOMControls()

    
    // Start the game loop
    gameLoop();
}



async function loadSettings() {
    try {
        const response = await fetch(`/static/settings/settings.txt`);
        if (!response.ok) throw new Error("Network response was not ok");

        const settingsText = await response.text();
        const settings = settingsText
            .trim() // Remove any leading/trailing whitespace
            .split("\n") // Split into lines
            .reduce((acc, line) => {
                const [key, value] = line.split(":").map(part => part.trim()); // Split by colon and trim whitespace
                if (key && value) {
                    acc[key] = value; // Add key-value pair to the result object
                }
                return acc;
            }, {}); // Initialize an empty object to accumulate results

        console.log("Settings:", settings);
        return settings;
    } catch (error) {
        console.error("Error loading settings file:", error);
        return null;
    }
}

export function switchScene(sceneToSwitch) {
    websocketObject.getServers()
    scene = factory.buildGameScene(sceneToSwitch)
    websocketObject.setScene(scene)
    //webSocketHost = new WebSocket('ws://' + window.location.host + '/game/server')
    //webSocket = new WebSocket('ws://' + window.location.host + '/game/login')

}

export function start(){
    isStarted = true
}






/*window.addEventListener("error", function (e) {
    alert("Error occurred: " + e.error.message);
    scene.eventBus.triggerEvent("alert", { text: e.error.message })
    return false;
 })*/
