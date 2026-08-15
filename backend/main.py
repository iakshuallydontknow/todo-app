from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Todo
from schemas import TodoCreate, TodoResponse

app = FastAPI()

# Allow Angular frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(
        title=todo.title,
        completed=todo.completed
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo: TodoCreate,
    db: Session = Depends(get_db)
):
    existing_todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if existing_todo is None:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    existing_todo.title = todo.title
    existing_todo.completed = todo.completed

    db.commit()
    db.refresh(existing_todo)

    return existing_todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    existing_todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if existing_todo is None:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    db.delete(existing_todo)
    db.commit()

    return {"message": "Todo deleted successfully"}