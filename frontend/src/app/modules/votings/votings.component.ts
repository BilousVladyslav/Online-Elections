import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { VotingService } from "../../core/services/voting.service";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { VotingListModel } from "../../shared/models/voting/voting-list.model";
import { OtherVotingModel } from "../../shared/models/voting/voting-other.model";
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-votings',
  templateUrl: './votings.component.html',
  styleUrls: ['./votings.component.css']
})
export class VotingsComponent implements OnInit {
  subscription: Subscription;
  active_votings: VotingListModel[];
  coming_votings: OtherVotingModel[];
  finished_votings: OtherVotingModel[];

  constructor(private votingService: VotingService,
    private authorizationService: AuthorizationService,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale) {
  }

  ngOnInit() {
    this.votingService.GetActiveVotings()
      .subscribe(data => {
        this.active_votings = data;
        console.log(this.active_votings)
      });
    this.votingService.GetComingVotings()
      .subscribe(data => {
        this.coming_votings = data;
        console.log(this.coming_votings)
      });
    this.votingService.GetFinishedVotings()
      .subscribe(data => {
        this.finished_votings = data;
        console.log(this.finished_votings)
      });

  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
