import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TagModule } from 'primeng/tag';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TagModule],
  template: `
    <div class="flex gap-4 overflow-x-auto pb-4" cdkDropListGroup>
      
      <!-- Todo Column -->
      <div class="kanban-column flex-1 min-w-20rem bg-surface-ground border-round-xl p-3 border-1 border-gray-200 dark:border-gray-800">
        <div class="flex justify-content-between align-items-center mb-3 px-2">
            <h3 class="m-0 text-color">Todo <span class="text-color-secondary ml-2 text-sm">{{todoData.length}}</span></h3>
        </div>
        <div
          cdkDropList
          [cdkDropListData]="todoData"
          (cdkDropListDropped)="drop($event, 'Todo')"
          class="min-h-10rem flex flex-column gap-3">
          
          <div *ngFor="let task of todoData; trackBy: trackById" cdkDrag class="kanban-card premium-card bg-surface-section p-3 cursor-move">
            <div class="flex justify-content-between align-items-center mb-2">
               <p-tag [value]="task.priority" [severity]="getPrioritySeverity(task.priority)"></p-tag>
            </div>
            <h4 class="m-0 mb-2 text-color">{{task.title}}</h4>
            <p class="text-sm text-color-secondary m-0 line-height-3">{{task.description}}</p>
          </div>

        </div>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column flex-1 min-w-20rem bg-surface-ground border-round-xl p-3 border-1 border-gray-200 dark:border-gray-800">
        <div class="flex justify-content-between align-items-center mb-3 px-2">
            <h3 class="m-0 text-color">In Progress <span class="text-color-secondary ml-2 text-sm">{{inProgressData.length}}</span></h3>
        </div>
        <div
          cdkDropList
          [cdkDropListData]="inProgressData"
          (cdkDropListDropped)="drop($event, 'In Progress')"
          class="min-h-10rem flex flex-column gap-3">
          
          <div *ngFor="let task of inProgressData; trackBy: trackById" cdkDrag class="kanban-card premium-card bg-surface-section p-3 cursor-move">
             <div class="flex justify-content-between align-items-center mb-2">
               <p-tag [value]="task.priority" [severity]="getPrioritySeverity(task.priority)"></p-tag>
            </div>
            <h4 class="m-0 mb-2 text-color">{{task.title}}</h4>
            <p class="text-sm text-color-secondary m-0 line-height-3">{{task.description}}</p>
          </div>

        </div>
      </div>

      <!-- Completed Column -->
      <div class="kanban-column flex-1 min-w-20rem bg-surface-ground border-round-xl p-3 border-1 border-gray-200 dark:border-gray-800">
        <div class="flex justify-content-between align-items-center mb-3 px-2">
            <h3 class="m-0 text-color">Completed <span class="text-color-secondary ml-2 text-sm">{{completedData.length}}</span></h3>
        </div>
        <div
          cdkDropList
          [cdkDropListData]="completedData"
          (cdkDropListDropped)="drop($event, 'Completed')"
          class="min-h-10rem flex flex-column gap-3">
          
          <div *ngFor="let task of completedData; trackBy: trackById" cdkDrag class="kanban-card premium-card bg-surface-section p-3 cursor-move">
            <div class="flex justify-content-between align-items-center mb-2">
               <p-tag [value]="task.priority" [severity]="getPrioritySeverity(task.priority)"></p-tag>
            </div>
            <h4 class="m-0 mb-2 text-color line-through opacity-70">{{task.title}}</h4>
            <p class="text-sm text-color-secondary m-0 line-height-3">{{task.description}}</p>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .kanban-column.cdk-drop-list-dragging .kanban-card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class KanbanBoard implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() taskMoved = new EventEmitter<{task: Task, newStatus: string}>();

  todoData: Task[] = [];
  inProgressData: Task[] = [];
  completedData: Task[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks'] && this.tasks) {
        this.todoData = this.tasks.filter(t => t.status === 'Todo');
        this.inProgressData = this.tasks.filter(t => t.status === 'In Progress');
        this.completedData = this.tasks.filter(t => t.status === 'Completed');
    }
  }

  trackById(index: number, item: Task) {
    return item._id || index;
  }

  drop(event: CdkDragDrop<Task[]>, targetStatus: 'Todo' | 'In Progress' | 'Completed') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedTask = event.container.data[event.currentIndex];
      // Update object status directly, emit API call
      movedTask.status = targetStatus;
      this.taskMoved.emit({ task: movedTask, newStatus: targetStatus });
    }
  }

  getPrioritySeverity(priority: string) {
    switch(priority) {
      case 'Low': return 'info';
      case 'Medium': return 'success';
      case 'High': return 'warn';
      case 'Urgent': return 'danger';
      default: return 'info';
    }
  }
}
