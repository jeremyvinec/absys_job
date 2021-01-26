import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {User} from "../class/user";
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;
  constructor(
    private apiService: ApiService
  ) { }

  public async login(id: string): Promise<User> {
      const user = await this.apiService.post('user/login', id);
      this.currentUser = user;
      return user;
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public async register(user: User): Promise<User> {
    const newUser = await this.apiService.post('user/register', {});
    this.currentUser = newUser;
    return newUser;
  }

  async findAll() {
    return this.apiService.get('user/');
  }

  async findByJobThenCountry(sortedJob: boolean, sortedCountry: boolean) {
    return this.apiService.get(`user/byJobThenCountry?sortedJob=${sortedJob}&sortedCountry=${sortedCountry}`);
  }

  async workflow(id: any) {
    return this.apiService.get('user/workflow/' + id);
  }
}
