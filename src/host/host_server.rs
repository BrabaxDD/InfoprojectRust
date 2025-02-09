use std::sync::{mpsc, MutexGuard};
use std::time::Instant;

use super::super::message::Message_event_bus;
mod world;

pub struct HostServer {
    id: String,
}
impl HostServer {
    pub fn new(id: String) -> Self {
        HostServer { id: id }
    }
    pub fn getRunMethod(
        self: HostServer,
        receiver: std::sync::mpsc::Receiver<Message_event_bus>,
        _sender_to_websocket: std::sync::mpsc::Sender<
            super::super::message::Message_event_bus_websocket_to_host,
        >,
        _receiver_from_websocket: std::sync::mpsc::Receiver<
            super::super::message::Message_event_bus_websocket_to_host,
        >,
        mut session: actix_ws::Session, //sender_to_websocket_sender_threat: tokio::sync::mpsc::Sender<String>
    ) -> impl FnOnce() {
        move || {
            println!("server running with id {}", self.id);
            let mut session_clone = session.clone();
            let mut world = world::world::new();
            std::thread::spawn(move || {
                futures::executor::block_on(session_clone.text("{\"type\":\"serverReadyForPlayer\"}"));
            });
            loop {
                for message in &receiver {
                    match message {
                        Message_event_bus::PlayerLogin(_player_id, _to_client_sender) => {}
                    }
                }
            }
        }
    }
}
