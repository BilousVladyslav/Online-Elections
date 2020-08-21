import { RegisterUserModel } from "../../shared/models/register-user.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(registerViewModel: RegisterUserModel): Observable<any> {
    return this.http.post(environment.apiUrl + `/profile/register/`, registerViewModel);
  }
}
