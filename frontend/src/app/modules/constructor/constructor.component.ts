import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";
import { ConstructorService } from "src/app/core/services/constructor.service";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { OtherVotingModel } from "../../shared/models/voting/voting-other.model";

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.css']
})
export class ConstructorComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  editable_votings: OtherVotingModel[];

  constructor(private authorizationService: AuthorizationService,
    private constructorService: ConstructorService,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if (this.authorizationService.isLoggedIn && this.authorizationService.IsOrganizer) {
      this.constructorService.GetVotings()
        .subscribe(data => {
          this.editable_votings = data;
          console.log(this.editable_votings)
        });
    }
    else {
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
