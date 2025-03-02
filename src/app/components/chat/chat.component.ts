import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Contact } from '../../models/contact.model';
import { Message } from '../../models/message.model';
import { Subscription } from 'rxjs';

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
        class="h-16 px-4 flex items-center justify-between"
        style="background-color: #EDEDED;"
      >
        <div class="flex items-center">
          <div
            class="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 relative"
          >
            <div
              *ngIf="activeContact && activeContact.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
              style="background-color: #25D366;"
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
        class="flex-grow p-4 overflow-y-auto"
        style="background-color: #E5DDD5;"
      >
        <div *ngFor="let message of messages" class="mb-4">
          <div [ngClass]="{ 'flex justify-end': message.isOutgoing }">
            <div
              class="max-w-[65%] p-2 rounded-lg shadow-sm relative"
              [style.background-color]="
                message.isOutgoing ? '#DCF8C6' : '#FFFFFF'
              "
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
      <div
        class="px-4 py-3 flex items-center"
        style="background-color: #EDEDED;"
      >
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
        class="h-full flex flex-col items-center justify-center"
        style="background-color: #F6F6F6;"
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
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  activeContact: Contact | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  private subscriptions: Subscription[] = [];

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Inscrever-se para receber atualizações do contato ativo
    const contactSub = this.chatService.activeContact$.subscribe((contact) => {
      this.activeContact = contact;
    });
    this.subscriptions.push(contactSub);

    // Inscrever-se para receber atualizações das mensagens
    const msgSub = this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 0);
    });
    this.subscriptions.push(msgSub);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    // Cancelar todas as inscrições para evitar memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Método para rolar para o final da conversa
  scrollToBottom(): void {
    try {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erro ao rolar para o final:', err);
    }
  }

  // Método para enviar mensagem
  sendMessage(): void {
    if (!this.newMessage || !this.newMessage.trim()) return;

    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
}
