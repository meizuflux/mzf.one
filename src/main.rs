use actix_web::{get, App, HttpServer, Result};
use actix_files::{NamedFile, Files};
use r2d2_sqlite::{self, SqliteConnectionManager};

mod db;
use db::{Pool};

#[get("/")]
async fn hello() -> Result<NamedFile> {
    Ok(NamedFile::open("dist/index.html")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let manager = SqliteConnectionManager::file("data.db");
    let pool = Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(hello)
            .service(Files::new("/assets", "dist/assets").show_files_listing())
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}