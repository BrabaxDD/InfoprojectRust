use super::Appstate;
use std::sync::mpsc::*;
use actix_web::Handler;
use actix_web::HttpResponse;
use actix_web::{web, HttpRequest, Responder};
use actix_ws::Message;
use futures_util::StreamExt;
use host_server::HostServer;
use log::info;
use serde_json::{Map, Value};
use std::collections::HashMap;
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};
mod host_server;


pub async fn ws(
    data: web::Data<Appstate>,
    req: HttpRequest,
    body: web::Payload,
) -> actix_web::Result<impl Responder> {
    let (response, mut session, mut msg_stream) = actix_ws::handle(&req, body)?;
    let a = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("time went backwards");
    let mut server_event_bus = data.serverEventBus.lock().unwrap();
    let (_sender_self,receiver_event_bus) = channel();
    let _receiver_self = server_event_bus.registerListner(receiver_event_bus);
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
                    let typeMap: HashMap<String, Value> = serde_json::from_str(&msg).unwrap(); //die hasmap enthält die Subjekte der ershiedenen Atrribute der Json root
                    match typeMap.get("type") {
                        Some(Value::String(string)) => match string.as_str() {
                            "startserver" => {
                                info!("new Server started with ID {}", string);
                                let server_id_value = typeMap.get("serverID");
                                match server_id_value {
                                    Some(Value::String(string)) => {
                                        let server = HostServer::new(0);
                                        let _server_threat_handler = 
                                            thread::spawn(HostServer::getRunMethod(server));
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


        let _ = session.close(None).await;
    });

    Ok(response)
}

/*pub fn get_ws_handler() -> impl FnOnce(HttpRequest,web::Payload) -> actix_web::Result<HttpResponse> {
    move |req: HttpRequest, body: web::Payload| {
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
                        let typeMap: HashMap<String, Value> = serde_json::from_str(&msg).unwrap(); //die hasmap enthält die Subjekte der ershiedenen Atrribute der Json root
                        match typeMap.get("type") {
                            Some(Value::String(string)) => match string.as_str() {
                                "startserver" => {
                                    info!("new Server started with ID {}", string);
                                    let serverThreatHandler = thread::spawn(|| {});
                                }
                                _ => {}
                            },
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
}*/
