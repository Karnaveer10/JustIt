FROM python:3.12-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy models and lookups
COPY models/ ./models/
COPY data/lookups/ ./data/lookups/

# Copy API code
COPY src/api.py ./src/api.py

EXPOSE 8000

CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]