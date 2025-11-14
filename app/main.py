from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .users import routers as users
from .tasks import routers as tasks

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    except Exception as e:
        pass
    finally:
        pass

app = FastAPI(
    title="API для приложения 'Рядом'",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://5.23.48.26:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "API для приложения 'Рядом'",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


app.include_router(users.router, prefix='/api/v1')
app.include_router(tasks.router, prefix='/api/v1')