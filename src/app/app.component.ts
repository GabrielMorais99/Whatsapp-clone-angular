import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    NgFor,
    NgIf,
    SidebarComponent,
    ChatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'whatsapp-clone';
}
