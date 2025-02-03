use std::sync::mpsc::*;
use super::message::Message;


pub struct ServerEventBus {
    communicaters: Vec<(Sender<Message>,Receiver<Message>)>
}


impl ServerEventBus{
    pub fn new() -> Self {
        ServerEventBus{ communicaters:vec![]}
    }
    pub fn registerListner(&mut self,event_bus_receiver: Receiver<Message>) -> Receiver<Message> {
        let (event_bus_sender,communicator_receiver) = channel();
        self.communicaters.push((event_bus_sender,event_bus_receiver));
        communicator_receiver
    }
}
