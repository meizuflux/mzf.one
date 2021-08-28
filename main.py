from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.responses import Response, RedirectResponse, JSONResponse
from starlette.requests import Request


from random import choices
from string import hexdigits

base_url = "https://mzf.one/"

async def set_url(request: Request) -> JSONResponse:
    data = await request.json()
    url = data.get("url")
    if url is None:
        return JSONResponse({"message": "No URL provided."}, status_code=400)
    
    key = "".join(choices(hexdigits, k=5))

    return JSONResponse({"key": key})


routes = [
    Route("/set", endpoint=set_url, methods=["POST"]),
    Mount("/", StaticFiles(directory="dist/", html=True))
]

app = Starlette(routes=routes)