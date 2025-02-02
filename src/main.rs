use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
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
