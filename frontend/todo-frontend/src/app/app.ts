import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTask = '';

  tasks: Task[] = [
    {
      id: 1,
      title: 'Learn Angular',
      completed: false
    }
  ];

  addTask() {
    if (this.newTask.trim() === '') {
      return;
    }

    this.tasks.push({
      id: Date.now(),
      title: this.newTask,
      completed: false
    });

    this.newTask = '';
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }
}