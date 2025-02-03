use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use std::path::Path;
use std::sync::mpsc::{Receiver, Sender};
use std::sync::Mutex;
use channel_dispatcher::ChannelDispatcher;
mod channel_dispatcher;
mod message;
mod host;
mod player;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let counter = web::Data::new(Appstate {
        dispatcher: Mutex::new(channel_dispatcher::ChannelDispatcher::new()),
    });
    HttpServer::new(move || {
        App::new()
            .app_data(counter.clone())
            .route("/game/server", web::get().to(host::ws))
            .service(hello)
            .service(actix_files::Files::new(
                "/static",
                Path::new(&format!("./static")),
            ))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

struct Appstate {
    dispatcher: Mutex<channel_dispatcher::ChannelDispatcher>,
}
