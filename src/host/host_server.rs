use super::super::channel_dispatcher::ChannelDispatcher;
use std::sync::{mpsc,MutexGuard};

use super::super::message::Message;

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
    pub fn register_as_channel_receiver(&self,dispatcher: &mut MutexGuard<'_, ChannelDispatcher>){
        let (sender,receiver) = mpsc::channel();
        dispatcher.registerChannelReceiver(self.id,sender);
    }

}
