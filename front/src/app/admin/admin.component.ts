import { Component, OnInit } from '@angular/core';
import {User} from "../class/user";
import {MessageService} from "primeng/api";
import {UserService} from "../services/user.service";
import {WebsocketService} from "../services/websocket.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[];
  
  dateOfBirthday = (user) => {
    return new Date(user.birthday)
  }
  setJob: boolean = true;
  setCountry: boolean = true;
  rowGroupMetaJob: {};
  rowGroupMetaCountry: {};

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private webSocket: WebsocketService
  ) { }

  async ngOnInit() {
    await this.loadUsers();
    await this.loadWebSocket();
  }

  async loadUsers() {
    this.users = await this.userService.findAll();
    this.updateRowGroupMetaJob();
    this.updateRowGroupMetaCountry();
  }

  async loadUsersFilter() {
    this.users = await this.userService.findByJobThenCountry(this.setJob, this.setCountry);
    this.updateRowGroupMetaJob();
    this.updateRowGroupMetaCountry();
  }

  /**
   * Auto reload the list when a new user is registered
   * FIXME : Not working
   */
  async loadWebSocket() {
    const r = this.webSocket.connect();
    // update user on state change
    this.webSocket.subscribe('/workflow/states', (user) => {
      this.loadUsers();
    })
  }

  onJob() {
    this.setJob=!this.setJob;
    this.loadUsersFilter();
    this.updateRowGroupMetaJob();
    this.updateRowGroupMetaCountry();
  }

  onCountry() {
    this.setCountry=!this.setCountry;
    this.loadUsersFilter();
    this.updateRowGroupMetaJob();
    this.updateRowGroupMetaCountry();
  }

  async onApprouved(id: any) {
    try {
      await this.userService.workflow(id);
      this.messageService.add({severity: 'success', summary: 'Workflow', detail: 'User has been updated'});
      await this.loadUsers();
    } catch (e) {
      this.messageService.add({severity: 'error', summary: 'Workflow', detail: 'Unable to update user'});
    }
  }

  updateRowGroupMetaJob() {
    this.rowGroupMetaJob = {};
    this.users && this.users.forEach((item: User, index: number) => {
      let rowData = this.users[index];
          let representativeName = rowData.earthJob;
          if (index == 0) {
              this.rowGroupMetaJob[representativeName] = { index: 0, size: 1 };
          }
          else {
              let previousRowData = this.users[index - 1];
              let previousRowGroup = previousRowData.earthJob;
              if (representativeName === previousRowGroup)
                  this.rowGroupMetaJob[representativeName].size++;
              else
                  this.rowGroupMetaJob[representativeName] = { index: index, size: 1 };
          }
    })
  }

  updateRowGroupMetaCountry() {
    this.rowGroupMetaCountry = {};
    this.users && this.users.forEach((item: User, index: number) => {
      let rowData = this.users[index];
          let representativeName = rowData.earthCountry;
          if (index == 0) {
              this.rowGroupMetaCountry[representativeName] = { index: 0, size: 1 };
          }
          else {
              let previousRowData = this.users[index - 1];
              let previousRowGroup = previousRowData.earthCountry;
              if (representativeName === previousRowGroup)
                  this.rowGroupMetaCountry[representativeName].size++;
              else
                  this.rowGroupMetaCountry[representativeName] = { index: index, size: 1 };
          }
    })
  }
}
