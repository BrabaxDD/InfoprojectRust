use std::string::String;
use std::sync::mpsc;

pub enum Message_event_bus {
    PlayerLogin(String, mpsc::Sender<Message_event_bus_to_client>),
}

pub enum Message_event_bus_to_client {}
