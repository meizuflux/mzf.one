use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use r2d2_sqlite::{self, SqliteConnectionManager};

mod db;
use db::{Pool};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let manager = SqliteConnectionManager::file("data.db");
    let pool = Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(hello)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}