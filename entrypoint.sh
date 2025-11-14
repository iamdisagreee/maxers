#!/bin/bash

echo "Create database migration..."
alembic revision --autogenerate -m "Initial migration"

echo "Connect database migration..."
alembic upgrade head

uvicorn app.main:app --host 0.0.0.0 --reload --port 8000

