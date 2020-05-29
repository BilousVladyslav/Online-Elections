import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from 'src/app/core/services/authorization.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  querryFormControl: FormControl;

  isLogged: boolean = false;
  is_organizer: boolean = false;

  constructor(
    private router: Router,
    private autorizationService: AuthorizationService
  ) {
    autorizationService.isLoggedIn.subscribe(x => this.isLogged = x);
    this.isOrganizer();
    console.log(this.is_organizer);
  }

  ngOnInit() {
    this.querryFormControl = new FormControl('');
    this.isOrganizer();
    console.log(this.is_organizer);
  }

  logOut() {
    this.autorizationService.logout();
    this.is_organizer = false;
    console.log(this.is_organizer);
    this.router.navigate(['/']);
  }

  isOrganizer(): boolean {
    this.subscription = this.autorizationService
      .IsOrganizer.subscribe(data => this.is_organizer = data);
    return this.is_organizer;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
