# backend/Dockerfile
FROM python:3.12-slim

# Instala dependencias del SO necesarias para wheel, bcrypt, etc.
RUN apt-get update && apt-get install -y build-essential libffi-dev git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos solo el backend y la config; el front se servirá por Nginx
COPY app ./app
COPY .env .
COPY uploads ./uploads          

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
