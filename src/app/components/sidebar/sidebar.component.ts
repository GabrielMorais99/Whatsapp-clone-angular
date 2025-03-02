import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Contact } from '../../models/contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full h-full flex flex-col">
      <!-- Cabeçalho -->
      <div
        class="h-16 px-4 flex items-center justify-between"
        style="background-color: #EDEDED;"
      >
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
        </div>
        <div class="flex gap-5 text-gray-600">
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
          >
            <span>○</span>
          </button>
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
          >
            <span>+</span>
          </button>
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
          >
            <span>⋮</span>
          </button>
        </div>
      </div>

      <!-- Barra de pesquisa -->
      <div class="px-4 py-2" style="background-color: #EDEDED;">
        <div class="flex items-center bg-white rounded-lg px-2">
          <span class="text-gray-500">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterContacts()"
            placeholder="Pesquisar ou começar uma nova conversa"
            class="px-2 py-1 w-full outline-none"
          />
        </div>
      </div>

      <!-- Lista de conversas -->
      <div class="flex-grow overflow-y-auto bg-white">
        <div
          *ngFor="let contact of filteredContacts"
          class="hover:bg-gray-100 cursor-pointer"
          [class.bg-gray-200]="activeContact?.id === contact.id"
          (click)="selectContact(contact)"
        >
          <div class="flex items-center px-4 py-3 border-b border-gray-200">
            <div
              class="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 relative"
            >
              <div
                *ngIf="contact.isOnline"
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style="background-color: #25D366;"
              ></div>
            </div>
            <div class="ml-3 flex-grow">
              <div class="flex justify-between">
                <h3 class="text-sm font-semibold">{{ contact.name }}</h3>
                <span class="text-xs text-gray-500">{{ contact.time }}</span>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-500 truncate">
                  {{ contact.lastMessage }}
                </p>
                <div
                  *ngIf="contact.unread > 0"
                  class="ml-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style="background-color: #25D366;"
                >
                  <span class="text-xs text-white">{{ contact.unread }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
export class SidebarComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  activeContact: Contact | null = null;
  searchQuery: string = '';
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Inscrever-se para receber atualizações dos contatos
    const contactsSub = this.chatService.contacts$.subscribe((contacts) => {
      this.contacts = contacts;
      this.filterContacts();
    });
    this.subscriptions.push(contactsSub);

    // Inscrever-se para receber atualizações do contato ativo
    const activeSub = this.chatService.activeContact$.subscribe((contact) => {
      this.activeContact = contact;
    });
    this.subscriptions.push(activeSub);
  }

  ngOnDestroy(): void {
    // Cancelar todas as inscrições para evitar memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Filtrar contatos com base na consulta de pesquisa
  filterContacts(): void {
    if (!this.searchQuery) {
      this.filteredContacts = this.contacts;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query)
    );
  }

  // Selecionar um contato
  selectContact(contact: Contact): void {
    this.chatService.setActiveContact(contact);
  }
}
