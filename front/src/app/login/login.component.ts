import { Component, OnInit } from '@angular/core';
import {User} from "../class/user";
import {MessageService} from "primeng/api";
import {UserService} from "../services/user.service";
import {WebsocketService} from "../services/websocket.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  id: string;
  user: User;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private webSocket: WebsocketService
  ) { }

  async ngOnInit() {
    // load the current user is defined
    const user = this.userService.getCurrentUser();
    if (user) {
      this.user = user;
      await this.loadWebSocket();
    }
  }

  async loadWebSocket() {
    await this.webSocket.connect();
    // update user on state change
    this.webSocket.subscribe('/workflow/states', (user) => {
      if (user.id == this.user.id) {
        this.user = user;
      }
    })
  }

  async login(f: { id: string }) {
    try {
      !this.user && f?.id ? this.user = await this.userService.login(f?.id): this.user;
      this.messageService.add({severity: 'success', summary: 'Login', detail: 'You have been logged'});
      await this.loadWebSocket();
    } catch (e) {
      this.messageService.add({severity: 'error', summary: 'Login', detail: 'Unable to login you'});
    }
  }
}
