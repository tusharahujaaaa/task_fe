import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Task, TaskStats } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchTasks(): Observable<Task[]> {
    this.loadingSubject.next(true);
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.tasksSubject.next(tasks)),
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    this.loadingSubject.next(true);
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([newTask, ...currentTasks]);
      }),
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateTaskStatus(taskId: string, newStatus: string): Observable<Task> {
    // Optimistic Update
    const currentTasks = this.tasksSubject.getValue();
    const taskIndex = currentTasks.findIndex(t => t._id === taskId);
    let originalStatus = '';

    if (taskIndex > -1) {
      originalStatus = currentTasks[taskIndex].status;
      currentTasks[taskIndex].status = newStatus as any;
      this.tasksSubject.next([...currentTasks]);
    }

    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, { status: newStatus }).pipe(
      catchError((error) => {
        // Revert optimistic update on error
        if (taskIndex > -1) {
          currentTasks[taskIndex].status = originalStatus as any;
          this.tasksSubject.next([...currentTasks]);
        }
        return throwError(() => error);
      })
    );
  }

  deleteTask(taskId: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.delete(`${this.apiUrl}/${taskId}`).pipe(
      tap(() => {
        const remainingTasks = this.tasksSubject.getValue().filter(t => t._id !== taskId);
        this.tasksSubject.next(remainingTasks);
      }),
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private handleError(error: any) {
    console.error('Task API Error:', error);
    return throwError(() => error);
  }
}
