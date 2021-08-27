#[macro_use]
extern crate log;

use actix_web::{get, post, web, App, HttpServer, Result};
use anyhow;
use actix_files::{NamedFile, Files};
use sqlx::sqlite::SqlitePool;
use serde::Deserialize;
use dotenv::dotenv;
use std::env;

#[derive(Deserialize)]
struct URL {
    url: String,
}

#[get("/")]
async fn index() -> Result<NamedFile> {
    Ok(NamedFile::open("dist/index.html")?)
}

#[post("/set")]
async fn update(_pool: web::Data<SqlitePool>, data: web::Json<URL>) -> Result<String> {
    

    Ok(format!("testurl {}", data.url))
}

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let pool = SqlitePool::connect(&database_url).await?;

    info!("Running server");

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(index)
            .service(update)
            .service(Files::new("/assets", "dist/assets").show_files_listing())
    })
    .bind(env::var("ADDR").expect("ADDR is not set in .env file"))?
    .run()
    .await?;

    Ok(())
}