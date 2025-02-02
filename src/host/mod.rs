use actix_web::{ web, HttpRequest, Responder};
use actix_ws::Message;
use futures_util::StreamExt;
use std::time::{SystemTime, UNIX_EPOCH};
use serde_json::{Value,Map};
use std::collections::HashMap;


pub async fn ws(req: HttpRequest, body: web::Payload) -> actix_web::Result<impl Responder> {
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
                        Some(Value::String(str)) => {
                            println!("{}",str)
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
