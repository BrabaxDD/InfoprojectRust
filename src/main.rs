use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use std::path::Path;
use std::sync::mpsc::{Receiver, Sender};
use std::sync::Mutex;
//use channel_dispatcher::ChannelDispatcher;
//mod channel_dispatcher;
mod host;
mod message;
mod player;
mod server_event_bus;
#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let counter = web::Data::new(Appstate {
        serverEventBus: Mutex::new(server_event_bus::ServerEventBus::new()),
    });
    HttpServer::new(move || {
        App::new()
            .app_data(counter.clone())
            .route("/game/server", web::get().to(host::ws))
            .route("/game/login", web::get().to(player::ws))
            .service(hello)
            .service(actix_files::Files::new(
                "/static",
                Path::new(&format!("./static")),
            ))
    })
    .workers(10)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

struct Appstate {
    serverEventBus: Mutex<server_event_bus::ServerEventBus>,
}
