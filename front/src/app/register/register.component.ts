import { Component, OnInit } from '@angular/core';
import {User} from "../class/user";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = new User();

  constructor(private userService: UserService,
              private messageService: MessageService,
              private routerService: Router
  ) { }

  ngOnInit(): void {}

  async onSubmit(f: NgForm) {
    if (f.form.status === 'VALID') {
      try {
        await this.userService.register(this.user);
        this.messageService.add({
          severity: 'success',
          summary:'Registration',
          detail: 'Your account has been created'
        });
        await this.routerService.navigate(['/login']);
      } catch (e) {
        console.error(e);
        this.messageService.add({
          severity: 'error',
          summary:'Registration',
          detail: 'Unable to create your account, please contact support'
        })
      }
    } else {
      // todo display errors
      console.log(f.form.controls)
    }
  }
}
