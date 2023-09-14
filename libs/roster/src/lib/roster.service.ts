import { ApiService } from '@realworld/core/http-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  constructor(private apiService: ApiService) { }

  getUsers(): Observable<{ users: any }> {
    return this.apiService.get('/users');
  }

  getArticles(): Observable<any> {
    return this.apiService.get('/articles');
  }
}
