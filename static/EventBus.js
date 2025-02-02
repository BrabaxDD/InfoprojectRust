export default class EventBus {
    constructor() {
        this.listners = {}
    };
    registerListner(eventString, listnerObject) {//Event sollte ein String sein
        if (eventString in this.listners) {
            this.listners[eventString].push(listnerObject)
        } else {
            this.listners[eventString] = [listnerObject]
        }
    }
    triggerEvent(eventString, eventObject) {
        if (eventString in this.listners) {
            try {
                for (let i = 0; i < this.listners[eventString].length; i++) {
                    this.listners[eventString][i].event(eventString, eventObject)
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
