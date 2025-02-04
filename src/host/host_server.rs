use std::sync::{mpsc,MutexGuard};

use super::super::message::Message_event_bus;

pub struct HostServer {id:i32}
impl HostServer {
    pub fn new(id:i32) -> Self {
        HostServer {id:id}
    }
    pub fn getRunMethod(self: HostServer) -> impl FnOnce(){
        move || {
            println!("server running with id {}",self.id);
        }
    }
}
