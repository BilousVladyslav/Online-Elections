import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { VotingService } from "src/app/core/services/voting.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { VotingListModel } from "src/app/shared/models/voting/voting-list.model";
import { OtherVotingModel } from "src/app/shared/models/voting/voting-other.model";
import { SubmitVotingModel } from "src/app/shared/models/voting/voting-active.model";
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-votings-page',
  templateUrl: './votings-page.component.html',
  styleUrls: ['./votings-page.component.css']
})
export class ActiveVotingPageComponent implements OnInit {
  subscription: Subscription;
  votingId: number;
  errorMessage: string;
  voting: VotingListModel;
  voting_info: SubmitVotingModel;

  constructor(private votingService: VotingService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ){
    let currVotingId = this.route.snapshot.params['votingId'];
    let is_logged: boolean;
    authorizationService.isLoggedIn.subscribe(x => is_logged = x);
    if (currVotingId && is_logged) {
      this.votingId = currVotingId;
      this.GetVotingPage();
      this.GetVotingInfo();
    }
    else {
      this.router.navigate(['/']);
    }
  }

  GetVotingInfo(): void {
    this.subscription = this.votingService
      .GetVotingSubmiting(this.votingId)
      .subscribe(
        res => this.voting_info = res,
        errors => console.log(errors.message));
  }

  GetVotingPage(): void {
    this.subscription = this.votingService
      .GetConcreteActiveVotings(this.votingId)
      .subscribe(
        res => this.voting = res,
        errors => console.log(errors.message));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
