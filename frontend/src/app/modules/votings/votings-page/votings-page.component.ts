import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { VotingService } from "src/app/core/services/voting.service";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { VotingListModel } from "src/app/shared/models/voting/voting-list.model";
import { ActiveVotingInfoModel } from "src/app/shared/models/voting/voting-active.model";
import { VotingSubmitModel, QuestionSubmitModel } from "src/app/shared/models/voting/question-submit.model";
import { MatDialog } from '@angular/material/dialog';
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
  voting_info: ActiveVotingInfoModel;

  result: VotingSubmitModel = new VotingSubmitModel();


  constructor(private votingService: VotingService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
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
        res => this.initResultModel(res),
        errors => console.log(errors.message));
  }

  GetVotingPage(): void {
    this.subscription = this.votingService
      .GetConcreteActiveVotings(this.votingId)
      .subscribe(
        res => this.initVotingModel(res),
        errors => console.log(errors.message));
  }

  getQuestion(key) {
    let idx = this.result.questions.findIndex(x => x.id == key)    
    return this.result.questions[idx]
  }

  updateSubmitModelByCheckbox(value, isChecked, question_key) {
    const question = this.getQuestion(question_key);
    if (isChecked) {
      question.choices.push(value);
    } else {
      let idx = question.choices.findIndex(x => x == value);
      question.choices.splice(idx, 1);
    }
    console.log(this.result.questions)
  }

  initVotingModel(res) {
    this.voting = res;
    this.voting.date_started = new Date(this.voting.date_started);
    this.voting.date_finished = new Date(this.voting.date_finished);
  }

  initResultModel(res) {
    this.voting_info = res;
    if (!this.voting_info.already_voted) {
      for (var i = 0; i < this.voting_info.questions.length; i++) {
        let question = this.voting_info.questions[i]
        this.result.questions.push(new QuestionSubmitModel(question.question_id))
      }
    }
  }

  isValidQuestionAnswers(id, max_count) {
    return this.getQuestion(id).choices.length <= max_count
  }

  updateSubmitModelByRadioButton(question_key, value) {
    this.getQuestion(question_key).choices = [value];
  }

  isReadyToSubmit() {
    for (var i = 0; i < this.voting_info.questions.length; i++) {
      let answ_count = this.voting_info.questions[i].max_answers
      if (this.result.questions[i].choices.length > answ_count) {
        return false
      }
    }
    return true
  }

  onSubmit() {
    console.log(this.result)
    const dialogRef = this.dialog.open(SubmitDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.subscription = this.votingService
          .SubmitVoting(this.result, this.voting.id)
          .subscribe(
            res => this.router.navigate(['/votings']),
            errors => console.log(errors.message));
      }
    });
    
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}


@Component({
  selector: 'submit-dialog',
  templateUrl: 'submit-dialog.html',
})
export class SubmitDialog {
  constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) {}
}
