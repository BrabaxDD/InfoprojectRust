use std::sync::mpsc::*;
use std::collections::HashMap;
use super::message::Message;


pub struct ChannelDispatcher{
    channels: HashMap<i32,Sender<Message>>,
}


impl ChannelDispatcher{
    pub fn getChannelSenderByID(&self,id:i32) -> Option<Sender<Message>> {
        self.channels.get(&id).cloned()
    }
    pub fn registerChannelReceiver(&mut self,id:i32,sender: Sender<Message>) -> (){
        self.channels.insert(id,sender);
    }
    pub fn new() -> Self {
        ChannelDispatcher{channels: HashMap::new()}
    }

}
