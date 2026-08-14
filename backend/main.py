from fastapi import FastAPI

app = FastAPI(title="Todo API")


@app.get("/api/health")
def health_check():
    return {"message": "Todo API is running"}