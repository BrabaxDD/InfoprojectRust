use super::Appstate;
use actix_web::Handler;
use actix_web::HttpResponse;
use actix_web::{web, HttpRequest, Responder};
use actix_ws::Message;
use futures_util::StreamExt;
use log::info;
use serde_json::{Map, Value};
use std::collections::HashMap;
use std::thread;
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
                    let mut counter = data.counter.lock().unwrap();
                    *counter += 1;
                    println!("{}", counter);



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
