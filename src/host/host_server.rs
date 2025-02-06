use std::sync::{mpsc, MutexGuard};
use std::time::Instant;

use super::super::message::Message_event_bus;

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
    ) -> impl FnOnce() {
        move || {
            println!("server running with id {}", self.id);
            let mut last_time = Instant::now();
            loop {
                for message in &receiver {
                    match message {
                        Message_event_bus::PlayerLogin(player_id,to_client_sender) => {
                        }
                    }
                }
                let elapsed = last_time.elapsed();
                last_time = Instant::now()
            }
        }
    }
}
