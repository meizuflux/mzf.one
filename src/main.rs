#[macro_use]
extern crate log;

use actix_web::{get, post, web, App, HttpServer, Result, HttpResponse};
use anyhow;
use actix_files::{NamedFile, Files};
use sqlx::sqlite::SqlitePool;
use serde::{Deserialize, Serialize};
use dotenv::dotenv;
use std::env;

use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

#[derive(Deserialize)]
struct URL {
    url: String,
}

#[derive(Serialize, Deserialize)]
struct ShortnerResponse {
    url: String,
    key: String,
    code: i32
}

#[get("/")]
async fn index() -> Result<NamedFile> {
    Ok(NamedFile::open("dist/index.html")?)
}

#[post("/set")]
async fn update(pool: web::Data<SqlitePool>, data: web::Json<URL>) -> Result<HttpResponse> {
    let key: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(5)
        .map(char::from)
        .collect();

    sqlx::query!(
        r#"
insert into urls (key, url) values ($1, $2)
        "#,
        key.to_string(), data.url.to_string()
    ).execute(pool)
    .await;

    Ok(HttpResponse::Ok().json(ShortnerResponse {
        url: data.url.to_string(),
        key: key.to_string(),
        code: 200
    }))
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
            .service(Files::new("/", "dist/").show_files_listing())
    })
    .bind(env::var("ADDR").expect("ADDR is not set in .env file"))?
    .run()
    .await?;

    Ok(())
}