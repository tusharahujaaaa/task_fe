import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { KanbanBoard } from '../../components/kanban-board/kanban-board';
import { Task, TaskStats } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KanbanBoard, ButtonModule],
  template: `
    <div class="dashboard-container max-w-7xl mx-auto py-5 relative">
      <!-- Loader Overlay -->
      <div *ngIf="loading" class="absolute top-0 left-0 w-full h-full bg-black-alpha-10 flex align-items-center justify-content-center z-5 border-round">
         <i class="pi pi-spin pi-spinner text-primary text-4xl"></i>
      </div>

      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-5">
        <div>
           <h2 class="text-3xl font-bold m-0 text-color">Dashboard</h2>
           <p class="text-color-secondary mt-2 mb-0">Welcome back! Here's your task overview.</p>
        </div>
        <button pButton icon="pi pi-plus" label="New Task" class="p-button-primary shadow-2" (click)="createNewTask()"></button>
      </div>

      <!-- Stats Row -->
      <div class="grid mb-5">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="premium-card p-4 flex flex-column justify-content-between h-full bg-surface-section">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-color-secondary font-medium">Total Tasks</span>
              <div class="w-2.5rem h-2.5rem border-circle bg-primary-100 flex align-items-center justify-content-center text-primary">
                <i class="pi pi-bars text-xl"></i>
              </div>
            </div>
            <div class="text-4xl font-black text-color">{{stats.total}}</div>
          </div>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <div class="premium-card p-4 flex flex-column justify-content-between h-full bg-surface-section border-top-3 border-blue-500">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-color-secondary font-medium">Todo</span>
              <div class="w-2.5rem h-2.5rem border-circle bg-blue-100 flex align-items-center justify-content-center text-blue-500">
                <i class="pi pi-list text-xl"></i>
              </div>
            </div>
            <div class="text-4xl font-black text-color">{{stats.todo}}</div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="premium-card p-4 flex flex-column justify-content-between h-full bg-surface-section border-top-3 border-yellow-500">
             <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-color-secondary font-medium">In Progress</span>
              <div class="w-2.5rem h-2.5rem border-circle bg-yellow-100 flex align-items-center justify-content-center text-yellow-500">
                <i class="pi pi-spin pi-spinner text-xl"></i>
              </div>
            </div>
            <div class="text-4xl font-black text-color">{{stats.inProgress}}</div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="premium-card p-4 flex flex-column justify-content-between h-full bg-surface-section border-top-3 border-green-500">
             <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-color-secondary font-medium">Completed</span>
              <div class="w-2.5rem h-2.5rem border-circle bg-green-100 flex align-items-center justify-content-center text-green-500">
                <i class="pi pi-check text-xl"></i>
              </div>
            </div>
            <div class="text-4xl font-black text-color">{{stats.completed}}</div>
          </div>
        </div>
      </div>

      <!-- Kanban Board -->
      <app-kanban-board 
        [tasks]="tasks" 
        (taskMoved)="onTaskMoved($event)">
      </app-kanban-board>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Dashboard implements OnInit, OnDestroy {
  tasks: Task[] = [];
  stats: TaskStats = { total: 0, todo: 0, inProgress: 0, completed: 0, highPriority: 0 };
  loading = false;
  
  private tasksSub!: Subscription;
  private loadSub!: Subscription;

  constructor(private taskService: TaskService, private messageService: MessageService) {}

  ngOnInit() {
    this.tasksSub = this.taskService.tasks$.subscribe(data => {
        this.tasks = data;
        this.calculateStats();
    });

    this.loadSub = this.taskService.loading$.subscribe(isLoading => {
        this.loading = isLoading;
    });

    // Fetch from API
    this.taskService.fetchTasks().subscribe();
  }

  ngOnDestroy() {
      if(this.tasksSub) this.tasksSub.unsubscribe();
      if(this.loadSub) this.loadSub.unsubscribe();
  }

  createNewTask() {
      // Mocked create for now, usually triggers a dialog 
      const newTask = {
          title: 'New API Task ' + Math.floor(Math.random() * 100),
          description: 'A task created via API to test the persistence flow and state refresh capabilities.',
          status: 'Todo',
          priority: 'High'
      };
      
      this.taskService.createTask(newTask as Task).subscribe({
          next: () => this.messageService.add({severity:'success', summary:'Created', detail:'Task added successfully.'}),
          error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Failed to create task.'})
      });
  }

  onTaskMoved(event: {task: Task, newStatus: string}) {
      if (!event.task._id) return;
      
      this.taskService.updateTaskStatus(event.task._id, event.newStatus).subscribe({
         next: () => {
             // Optimistic update handles UI, but we can still toast for clarity in demo
             this.messageService.add({severity:'info', summary:'Updated', detail:`Task moved to ${event.newStatus}.`});
         },
         error: () => {
             this.messageService.add({severity:'error', summary:'Error', detail:'Failed to update task status.'});
         }
      });
  }

  calculateStats() {
    this.stats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'Todo').length,
      inProgress: this.tasks.filter(t => t.status === 'In Progress').length,
      completed: this.tasks.filter(t => t.status === 'Completed').length,
      highPriority: this.tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length
    };
  }
}
