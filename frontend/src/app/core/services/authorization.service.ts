import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenResponse } from 'src/app/shared/models/token-response.model';
import { LoginModel } from 'src/app/shared/models/login.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public currentUser: UserModel;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private is_organizer = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,  private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedIn.next(this.currentUser != null);
    if (this.currentUser)
      this.is_organizer.next(this.currentUser.Is_Organizer);
    else
      this.is_organizer.next(false);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get IsOrganizer(): Observable<boolean> {
    return this.is_organizer.asObservable();
  }

  login(userLoginViewModel: LoginModel): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(environment.apiUrl + `/profile/token-auth/`, userLoginViewModel)
      .pipe(map(tokenResponse => {
        var token = tokenResponse.token;
        this.currentUser = this.setUserInfo(token, userLoginViewModel.username, tokenResponse.is_organizer);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.loggedIn.next(true);
        this.is_organizer.next(this.currentUser.Is_Organizer);
        return tokenResponse;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.loggedIn.next(false);
    this.is_organizer.next(false);
    //this.router.navigate(['']);

  }

  setUserInfo(token: string, username: string, is_organizer: boolean): UserModel {
    var user = <UserModel>{
      Username: username,
      Token: token,
      Is_Organizer: is_organizer
    };
    return user;
  }
}
