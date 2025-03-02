import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private contacts = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contacts.asObservable();

  private activeContact = new BehaviorSubject<Contact | null>(null);
  activeContact$ = this.activeContact.asObservable();

  private messages = new BehaviorSubject<Message[]>([]);
  messages$ = this.messages.asObservable();

  constructor() {
    this.loadMockData();
  }

  // Método para carregar dados de demonstração
  private loadMockData() {
    // Contatos de demonstração
    const mockContacts: Contact[] = Array(10)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        name: `Contato ${i + 1}`,
        lastMessage: 'Última mensagem enviada...',
        time: '10:30',
        unread: i % 3 === 0 ? i : 0,
        isOnline: i % 4 === 0,
        status: i % 2 === 0 ? 'Ocupado' : 'Disponível',
        lastSeen: '10:30',
      }));

    // Mensagens de demonstração
    const mockMessages: Message[] = Array(15)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        text:
          i % 5 === 0
            ? 'Esta é uma mensagem mais longa para demonstrar como ficaria uma mensagem com mais conteúdo no layout.'
            : 'Esta é uma mensagem de exemplo.',
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, '0')}`,
        isOutgoing: i % 2 === 0,
        isRead: i % 3 === 0,
      }));

    this.contacts.next(mockContacts);
    // Definindo um contato ativo no início para evitar problemas com ngIf
    this.activeContact.next(mockContacts[0]);
    this.messages.next(mockMessages);
  }

  // Método para selecionar um contato
  setActiveContact(contact: Contact) {
    this.activeContact.next(contact);
    // Em um cenário real, aqui carregaríamos as mensagens do contato selecionado
  }

  // Método para enviar mensagem
  sendMessage(text: string) {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: this.messages.value.length + 1,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOutgoing: true,
      isRead: false,
    };

    this.messages.next([...this.messages.value, newMessage]);
  }
}
