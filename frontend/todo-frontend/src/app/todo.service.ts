import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = 'http://127.0.0.1:8000/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, {
      title: title,
      completed: false
    });
  }

  updateTodo(
    id: number,
    title: string,
    completed: boolean
  ): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, {
      title: title,
      completed: completed
    });
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}