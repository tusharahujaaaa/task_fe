import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  template: `
    <div class="landing-hero relative overflow-hidden flex align-items-center justify-content-center min-h-screen">
      <!-- Background Decorations -->
      <div class="absolute w-30rem h-30rem bg-primary border-circle blur-bg opacity-20" style="top: -10%; left: -10%;"></div>
      <div class="absolute w-30rem h-30rem bg-purple-500 border-circle blur-bg opacity-20" style="bottom: -10%; right: -10%;"></div>
      
      <div class="relative z-1 max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-6xl md:text-8xl font-black mb-4 text-color">
          Master Your <span class="text-primary">Workflow</span>
        </h1>
        <p class="text-xl md:text-2xl text-color-secondary mb-8 max-w-4xl mx-auto line-height-3">
          The ultimate premium task management dashboard designed for modern teams.
          Organize, track, and conquer your projects with stunning visual clarity.
        </p>
        
        <div class="flex flex-column sm:flex-row justify-content-center gap-4 mb-8">
          <button pButton label="Start for Free" icon="pi pi-bolt" class="p-button-lg p-button-primary shadow-3 w-full sm:w-auto" routerLink="/dashboard"></button>
          <button pButton label="View Demo" icon="pi pi-play" class="p-button-lg p-button-outlined w-full sm:w-auto"></button>
        </div>

        <!-- Glassmorphism Preview Card -->
        <div class="glass-effect p-4 border-round-2xl mx-auto shadow-6 max-w-5xl overflow-hidden mt-6">
          <div class="flex gap-2 mb-4 px-2">
            <div class="w-1rem h-1rem border-circle bg-red-400"></div>
            <div class="w-1rem h-1rem border-circle bg-yellow-400"></div>
            <div class="w-1rem h-1rem border-circle bg-green-400"></div>
          </div>
          <div class="grid">
            <div class="col-4 hidden md:block">
              <div class="h-8rem border-round bg-surface-ground opacity-70 mb-3"></div>
              <div class="h-4rem border-round bg-surface-ground opacity-70 mb-3"></div>
              <div class="h-4rem border-round bg-surface-ground opacity-70"></div>
            </div>
            <div class="col-12 md:col-8">
               <div class="flex gap-3 h-20rem">
                  <div class="flex-1 border-round bg-surface-ground opacity-70 flex flex-column p-3 gap-3">
                     <div class="h-2rem bg-primary opacity-50 border-round w-full"></div>
                     <div class="h-4rem bg-surface-section border-round w-full"></div>
                     <div class="h-4rem bg-surface-section border-round w-full"></div>
                  </div>
                  <div class="flex-1 border-round bg-surface-ground opacity-70 flex flex-column p-3 gap-3">
                     <div class="h-2rem bg-yellow-500 opacity-50 border-round w-full"></div>
                     <div class="h-4rem bg-surface-section border-round w-full"></div>
                  </div>
                  <div class="flex-1 border-round bg-surface-ground opacity-70 hidden sm:flex flex-column p-3 gap-3">
                     <div class="h-2rem bg-green-500 opacity-50 border-round w-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blur-bg { filter: blur(100px); }
    .landing-hero { margin-top: -80px; padding-top: 80px; } /* Offset navbar */
  `]
})
export class Landing {}
