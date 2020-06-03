import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { VotingService } from "src/app/core/services/voting.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { OtherVotingModel } from "src/app/shared/models/voting/voting-other.model";
import { L10N_LOCALE, L10nLocale } from "angular-l10n";
import { VotingResultModel } from 'src/app/shared/models/voting/voting-results.model';

@Component({
  selector: 'app-votings-results',
  templateUrl: './votings-results.component.html',
  styleUrls: ['./votings-results.component.css']
})
export class VotingsResultsComponent implements OnInit {
  subscription: Subscription;
  votingId: number;
  errorMessage: string;
  voting: OtherVotingModel;
  postfix: string;
  results: VotingResultModel[];
  isFinished: boolean = false;

  constructor(private votingService: VotingService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    let currVotingId = this.route.snapshot.params['votingId'];
    let is_logged: boolean;
    authorizationService.isLoggedIn.subscribe(x => is_logged = x);
    if (currVotingId && is_logged) {
      this.votingId = currVotingId;
      this.postfix = this.route.snapshot.routeConfig.path.split('/')[1]
      this.GetVotingInfo();
    }
    else {
      this.router.navigate(['/']);
    }
  }

  GetVotingInfo(): void {
    if (this.postfix == 'finished') {
      this.subscription = this.votingService
        .GetConcreteFinishedVoting(this.votingId)
        .subscribe(
          res => this.initVotingModel(res),
          errors => console.log(errors.message));
    }
    else {
      this.subscription = this.votingService
        .GetConcreteComingVoting(this.votingId)
        .subscribe(
          res => this.initVotingModel(res),
          errors => console.log(errors.message));
    }
  }

  GetVotingResults(): void {
    this.subscription = this.votingService
      .GetVotingResults(this.votingId)
      .subscribe(
        res => this.results = res,
        errors => console.log(errors.message));
  }

  initVotingModel(res) {
    this.voting = res
    this.voting.date_started = new Date(this.voting.date_started)
    this.voting.date_finished = new Date(this.voting.date_finished)
    this.isFinished = this.voting.date_finished.getTime() < Date.now()
    if (this.isFinished) {
      this.GetVotingResults()
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
