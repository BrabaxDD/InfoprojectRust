use std::sync::mpsc::*;
use super::message::Message_event_bus;
use std::string::String;
use std::collections::HashMap;


pub struct ServerEventBus {
    senders: HashMap<String,Sender<Message_event_bus>>
}


impl ServerEventBus{
    pub fn new() -> Self {
        ServerEventBus{ senders: HashMap::new()}
    }
    pub fn get_sender_by_id(&self,id:String)-> Option<Sender<Message_event_bus>>{
        self.senders.get(&id).cloned()
    }
    pub fn register_sender_by_id(&mut self,sender: Sender<Message_event_bus>, id: String) -> () {
        self.senders.insert(id,sender.clone());
    }
/*    pub fn registerListner(&mut self,event_bus_receiver: Receiver<Message_event_bus>) -> Receiver<Message_event_bus> {
        let (event_bus_sender,communicator_receiver) = channel();
        self.communicaters.push((event_bus_sender,event_bus_receiver));
        communicator_receiver
    }*/
/*    pub fn start_event_handling(&mut self) {
        loop {
            for communicator in self.communicaters.iter(){
                for message in &communicator.1{
                    match message {
                        Message_event_bus::StartServer(string) => {println!("{}",string)}
                    }
                }
            }
        }
    }*/
}
