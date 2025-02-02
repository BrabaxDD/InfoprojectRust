use actix_web::{get, App, HttpResponse,web, HttpServer, Responder};
use std::path::Path;
mod host;
mod player;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
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
