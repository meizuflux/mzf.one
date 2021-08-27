from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.responses import Response, RedirectResponse
from starlette.requests import Request


routes = [
    Mount("/", StaticFiles(directory="dist/", html=True))
]

app = Starlette(routes=routes)