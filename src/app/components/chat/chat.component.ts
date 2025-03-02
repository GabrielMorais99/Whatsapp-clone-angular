import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Contact } from '../../models/contact.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="h-full flex flex-col"
      *ngIf="activeContact !== null; else noChat"
    >
      <!-- Cabeçalho do chat -->
      <div
        class="bg-whatsapp-panel-bg h-16 px-4 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 relative"
          >
            <div
              *ngIf="activeContact && activeContact.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            ></div>
          </div>
          <div class="ml-3">
            <h2 class="text-base font-medium">{{ activeContact?.name }}</h2>
            <p class="text-xs text-gray-500">
              {{
                activeContact?.isOnline
                  ? 'online'
                  : 'visto por último hoje às ' +
                    (activeContact?.lastSeen || '10:30')
              }}
            </p>
          </div>
        </div>
        <div class="flex gap-5 text-gray-600">
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
          >
            <span>🔍</span>
          </button>
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
          >
            <span>⋮</span>
          </button>
        </div>
      </div>

      <!-- Área de mensagens -->
      <div
        #messageContainer
        class="flex-grow bg-whatsapp-chat-bg p-4 overflow-y-auto"
      >
        <div *ngFor="let message of messages" class="mb-4">
          <div [ngClass]="{ 'flex justify-end': message.isOutgoing }">
            <div
              [ngClass]="{
                'bg-whatsapp-message-out': message.isOutgoing,
                'bg-whatsapp-message-in': !message.isOutgoing
              }"
              class="max-w-[65%] p-2 rounded-lg shadow-sm relative"
            >
              <p class="text-sm">{{ message.text }}</p>
              <div class="flex justify-end items-center mt-1">
                <span class="text-xs text-gray-500">{{ message.time }}</span>
                <span
                  *ngIf="message.isOutgoing"
                  class="text-xs text-blue-500 ml-1"
                >
                  {{ message.isRead ? '✓✓' : '✓' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Área de entrada de mensagem -->
      <div class="bg-whatsapp-panel-bg px-4 py-3 flex items-center">
        <button
          class="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center"
        >
          <span>😊</span>
        </button>
        <button
          class="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center"
        >
          <span>📎</span>
        </button>
        <div class="flex-grow mx-2">
          <input
            type="text"
            [(ngModel)]="newMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Digite uma mensagem"
            class="w-full p-2 rounded-lg outline-none"
          />
        </div>
        <button
          class="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center"
          (click)="sendMessage()"
        >
          <span>{{ newMessage ? '➤' : '🎤' }}</span>
        </button>
      </div>
    </div>

    <!-- Template para quando nenhum chat está selecionado -->
    <ng-template #noChat>
      <div
        class="h-full flex flex-col items-center justify-center bg-whatsapp-panel-bg"
      >
        <div class="w-16 h-16 rounded-full bg-gray-300 mb-4"></div>
        <h2 class="text-xl font-medium text-gray-700 mb-2">WhatsApp Clone</h2>
        <p class="text-gray-500 text-center max-w-md mb-4">
          Selecione um contato para iniciar uma conversa ou clique no ícone de
          nova conversa.
        </p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  activeContact: Contact | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Inscrever-se para receber atualizações do contato ativo
    this.chatService.activeContact$.subscribe((contact) => {
      this.activeContact = contact;
    });

    // Inscrever-se para receber atualizações das mensagens
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Método para rolar para o final da conversa
  scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  // Método para enviar mensagem
  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
