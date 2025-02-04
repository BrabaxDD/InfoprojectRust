use std::sync::{mpsc,MutexGuard};

use super::super::message::Message_event_bus;

pub struct HostServer {id:String}
impl HostServer {
    pub fn new(id:String) -> Self {
        HostServer {id:id}
    }
    pub fn getRunMethod(self: HostServer, receiver: std::sync::mpsc::Receiver::<Message_event_bus>) -> impl FnOnce(){
        move || {
            println!("server running with id {}",self.id);
            loop {
                receiver.recv().unwrap();
                println!("got Message from client")
            }
        }
    }
}
