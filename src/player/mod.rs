use super::message::Message_event_bus;
use super::Appstate;
use actix_web::{web, HttpRequest, Responder};
use actix_ws::Message;
use futures_util::StreamExt;
use serde_json::{Map, Value};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

pub async fn ws(
    data: web::Data<Appstate>,
    req: HttpRequest,
    body: web::Payload,
) -> actix_web::Result<impl Responder> {
    let (response, mut session, mut msg_stream) = actix_ws::handle(&req, body)?;
    let a = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("time went backwards");

    actix_web::rt::spawn(async move {
        while let Some(Ok(msg)) = msg_stream.next().await {
            match msg {
                Message::Ping(bytes) => {
                    if session.pong(&bytes).await.is_err() {
                        return;
                    }
                }
                Message::Text(msg) => {
                    println!("Got text: {msg}");
                    let typeMap: HashMap<String, Value> = serde_json::from_str(&msg).unwrap();
                    match typeMap.get("type") {
                        Some(Value::String(message_type)) => {
                            let message_type_converted = &message_type[..];
                            match message_type_converted {
                                "login" => {
                                    let server_id = typeMap.get("serverID");
                                    println!("{}", server_id.unwrap());
                                    if let Some(serde_json::Value::String(server_id)) = server_id {
                                        if let Some(serde_json::Value::Number(player_id)) =
                                            typeMap.get("ID")
                                        {
                                            let mut server_event_bus =
                                                data.serverEventBus.lock().unwrap();
                                            let to_host_sender_result = server_event_bus
                                                .get_sender_by_id(server_id.to_string());
                                            let (to_me_sender, from_host_receiver) =
                                                std::sync::mpsc::channel();
                                            if let Some(to_host_sender) = to_host_sender_result {
                                                to_host_sender.send(
                                                    Message_event_bus::PlayerLogin(
                                                        player_id.to_string(),
                                                        to_me_sender,
                                                    ),
                                                );
                                            }
                                            session
                                                .text("{\"type\" : \"connectionAccepted\"}")
                                                .await
                                                .unwrap();
                                        } else {
                                            session
                                                .text("{\"type\" : \"connectionRefused\"}")
                                                .await
                                                .unwrap();
                                        }
                                    } else {
                                        println!("connectoiin Refused");
                                        session
                                            .text("{\"type\" : \"connectionRefused\"}")
                                            .await
                                            .unwrap();
                                    }
                                }
                                _ => {}
                            }
                        }
                        _ => {}
                    }
                }

                _ => break,
            }
        }

        let _ = session.close(None).await;
    });

    Ok(response)
}
