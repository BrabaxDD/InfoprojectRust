import GameObject from "./GameObject.js"
import { settings } from "./game.js"

export default class Camera extends GameObject{
    constructor(scene){
        super(scene)

        this.canvas = this.scene.canvas
        this.ctx = this.scene.canvas.getContext("2d")

        this.posx = this.canvas.width/2
        this.posy = this.canvas.height/2

        this.cameraWidth = this.canvas.width
        this.cameraHeight = this.canvas.height

        this.lockedPlayer = null

        this.cullingDisance = settings.cullinDistance//((this.cameraHeight < this.cameraWidth) ? this.cameraWidth : this.cameraHeight)
    }

    /*
    To use the camera, to get objects to render into camera, use
    this.posx - (this.scene.camera.posx - this.scene.camera.cameraWidth/2)
    this.posy - (this.scene.camera.posy- this.scene.camera.cameraHeight/2)
    in the render function of the object in question

    To use Culling: 
    maximum disance is the camera width or height (what is larger?) for rendering.
    */

    setLockedPlayer(player){
        this.lockedPlayer = player
    }

    process(){
        if (this.lockedPlayer != null){
            this.posx = this.lockedPlayer.posx
            this.posy = this.lockedPlayer.posy
        }
    }
    
    render(){
    }
}
