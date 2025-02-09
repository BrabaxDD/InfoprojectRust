use super::message::Message_event_bus;
use super::Appstate;
use actix_web::{web, HttpRequest, Responder};
use actix_ws::Message;
use futures_util::StreamExt;
use host_server::HostServer;
use serde_json::Value;
use std::collections::HashMap;
mod host_server;

pub async fn ws(
    data: web::Data<Appstate>,
    req: HttpRequest,
    body: web::Payload,
) -> actix_web::Result<impl Responder> {
    let (response, mut session, mut msg_stream) = actix_ws::handle(&req, body)?;

    actix_web::rt::spawn(async move {

        fn start_server(
            host_id: String,
            data: &web::Data<Appstate>,
            session: actix_ws::Session
        ) -> () {
            let (_to_server_sender, from_socket_receiver) =
                std::sync::mpsc::channel::<super::message::Message_event_bus_websocket_to_host>();
            let (to_socket_sender, _from_server_receiver) =
                std::sync::mpsc::channel::<super::message::Message_event_bus_websocket_to_host>();

            let mut server_event_bus = data.serverEventBus.lock().unwrap();
            let (host_channel_sender, host_receiver) =
                std::sync::mpsc::channel::<Message_event_bus>();
            server_event_bus.register_sender_by_id(host_channel_sender, host_id.to_string());
            std::thread::spawn(HostServer::new(host_id.to_string()).getRunMethod(
                host_receiver,
                to_socket_sender,
                from_socket_receiver,
                session
                
//                sender_to_webscoket_message_sender,
            ));
        }

        loop {
            match msg_stream.next().await {
                Some(Ok(msg)) => {
                    match msg {
                        Message::Ping(bytes) => {
                            if session.pong(&bytes).await.is_err() {
                                return;
                            }
                        }
                        Message::Text(msg) => {
                            println!("Got text: {msg}");
                            let type_map: HashMap<String, Value> =
                                serde_json::from_str(&msg).unwrap(); //die hasmap enthält die Subjekte der ershiedenen Atrribute der Json root
                            match type_map.get("type") {
                                Some(Value::String(message_type)) => match message_type.as_str() {
                                    "startserver" => {
                                        let server_id_value = type_map.get("serverID");
                                        match server_id_value {
                                            Some(Value::String(string)) => {
                                                start_server(
                                                    string.to_string(),
                                                    &data,
                                                    session.clone()
                                                )
                                                /*                                                let host_id = string;
                                                let mut server_event_bus =
                                                    data.serverEventBus.lock().unwrap();
                                                let (host_channel_sender, to_host_receiver) =
                                                    std::sync::mpsc::channel::<Message_event_bus>();
                                                server_event_bus.register_sender_by_id(
                                                    host_channel_sender,
                                                    host_id.to_string(),
                                                );

                                                std::thread::spawn(
                                                    HostServer::new(host_id.to_string())
                                                        .getRunMethod(to_host_receiver),
                                                );*/
                                            }
                                            _ => {}
                                        }
                                    }
                                    _ => {}
                                },
                                _ => {}
                            }
                        }

                        _ => break,
                    }
                }
                _ => break,
            }
        }
    });

    Ok(response)
}
