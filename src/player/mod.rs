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
            println!("got message");
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
                                    let server_id = typeMap.get("serverID").unwrap();
                                    let mut server_event_bus = data.serverEventBus.lock().unwrap();
                                    server_event_bus.get_sender_by_id(server_id.to_string());
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
