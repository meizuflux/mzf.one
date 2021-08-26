use actix_web::{get, post, web, App, HttpServer, Result};
use actix_files::{NamedFile, Files};
use r2d2_sqlite::{self, SqliteConnectionManager};
use serde::Deserialize;

mod db;
use db::{Pool};

#[derive(Deserialize)]
struct URL {
    url: String,
}

#[get("/")]
async fn index() -> Result<NamedFile> {
    Ok(NamedFile::open("dist/index.html")?)
}

#[post("/set")]
async fn update(_pool: web::Data<Pool>, data: web::Json<URL>) -> Result<String> {
    

    Ok(format!("testurl {}", data.url))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let manager = SqliteConnectionManager::file("data.db");
    let pool = Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(index)
            .service(update)
            .service(Files::new("/assets", "dist/assets").show_files_listing())
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}