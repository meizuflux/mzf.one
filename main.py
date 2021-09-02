from typing import Optional
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.responses import Response, RedirectResponse, JSONResponse
from starlette.requests import Request
from starlette.background import BackgroundTask

from databases import Database

from random import choices
from string import hexdigits



database = Database("sqlite:///./data.db")
cache = {}

async def startup():
    await database.connect()

    ret = await database.fetch_all(query="SELECT key, url FROM urls")
    global cache
    cache = {url: key for url, key in ret}

async def shutdown():
    await database.disconnect()

async def add_url(key: str, url: str) -> None:
    query = "INSERT INTO urls (key, url) VALUES (:key, :url)"
    values = {"key": key, "url": url}
    await database.execute(query=query, values=values)


async def set_url(request: Request) -> JSONResponse:
    data = await request.json()
    url = data.get("url")
    if url is None:
        return JSONResponse({"message": "No url provided."}, status_code=400)
    
    key = None
    task = None
    for k, u in cache.items():
        if u == url:
            key = k
            break

    if key is None:
        key = "".join(choices(hexdigits, k=5))
        cache[key] = url

        task = BackgroundTask(add_url, key, url)


    return JSONResponse({"key": key}, background=task)

async def get_url(request: Request) -> Optional[RedirectResponse]:
    key = request.path_params["key"]


    url = cache.get(key)
    if url is None:
        return JSONResponse({"message": "No url with that key is found."}, 404)

    return RedirectResponse(url)

routes = [
    Route("/set", endpoint=set_url, methods=["POST"]),
    Route("/{key}", endpoint=get_url),
    Mount("/", StaticFiles(directory="dist/", html=True)),
]

app = Starlette(
    routes=routes,
    on_startup=[startup],
    on_shutdown=[shutdown]
)