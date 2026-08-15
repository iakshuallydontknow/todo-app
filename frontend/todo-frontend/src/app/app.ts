import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  todos: Todo[] = [];
  newTodo = '';

  constructor(
    private todoService: TodoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load todos:', error);
      }
    });
  }

  addTodo(): void {
    const title = this.newTodo.trim();

    if (!title) {
      return;
    }

    this.newTodo = '';

    this.todoService.addTodo(title).subscribe({
      next: (todo) => {
        this.todos.push(todo);

        // Immediately update the UI
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Failed to add todo:', error);

        this.newTodo = title;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  toggleTodo(todo: Todo): void {
    const previousState = todo.completed;

    // Update UI immediately
    todo.completed = !todo.completed;
    this.changeDetectorRef.detectChanges();

    this.todoService.updateTodo(
      todo.id,
      todo.title,
      todo.completed
    ).subscribe({
      error: (error) => {
        console.error('Failed to update todo:', error);

        todo.completed = previousState;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteTodo(id: number): void {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return;
    }

    const deletedTodo = this.todos[todoIndex];

    // Remove immediately from UI
    this.todos.splice(todoIndex, 1);
    this.changeDetectorRef.detectChanges();

    this.todoService.deleteTodo(id).subscribe({
      error: (error) => {
        console.error('Failed to delete todo:', error);

        // Restore if deletion fails
        this.todos.splice(todoIndex, 0, deletedTodo);
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}