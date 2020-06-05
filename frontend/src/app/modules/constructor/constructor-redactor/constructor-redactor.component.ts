import { Component, OnInit, Output, OnDestroy, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConstructorService } from 'src/app/core/services/constructor.service';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { VotingCreateModel } from 'src/app/shared/models/constructor/voting-create.model';
import { QuestionCreate, ChoiceCreate } from 'src/app/shared/models/constructor/question-create.model';
import { QuestionResponseModel } from 'src/app/shared/models/constructor/question-response.model';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { MatDialog } from '@angular/material/dialog';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";
import { VoterCreate, VoterReceive } from '../../../shared/models/constructor/voter.model';

@Component({
  selector: 'app-constructor-redactor',
  templateUrl: './constructor-redactor.component.html',
  styleUrls: ['./constructor-redactor.component.css']
})
export class ConstructorRedactorComponent implements OnInit {

  minDate: Date = new Date();
  votingForm: FormGroup;
  private subscription: Subscription;
  errorMessage: string = null;
  isOrganizer: boolean = false;

  questionFormArray: FormArray;
  questionsFormGroup: FormGroup;
  questionsArray: QuestionResponseModel[];

  votersFormGroup: FormGroup;
  votersArray: VoterReceive[];

  constructor(
    private fb: FormBuilder,
    private authorizationService: AuthorizationService,
    private constructorService: ConstructorService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(L10N_LOCALE) public locale: L10nLocale

  ) {
    authorizationService.IsOrganizer.subscribe(x => this.isOrganizer = x);
    if (!this.isOrganizer) {
      this.router.navigate(["/"])
    }
  }

  ngOnInit(): void {
    this.createVotingForm();

    this.subscription = this.constructorService
      .GetQuestions(this.route.snapshot.params['votingId'])
      .subscribe(
        res => this.createQuestionForms(res),
        errors => this.errorMessage = errors.message);

    this.subscription = this.constructorService
      .GetVoters(this.route.snapshot.params['votingId'])
      .subscribe(
        res => this.createVotersForm(res),
        errors => this.errorMessage = errors.message);
  }

  createVotersForm(model: VoterReceive[]) {
    this.votersArray = model;
    this.votersFormGroup = this.fb.group({
      emails: this.fb.array([])
    })
    for (let i = 0; i < model.length; i++) {
      (<FormArray>this.votersFormGroup.get('emails')).push(new FormControl(model[i].user, [Validators.required, Validators.pattern(EmailRegex.Regex)]))
    }
  }

  createVotingForm(): void {
    this.subscription = this.constructorService
      .RetrieveVoting(this.route.snapshot.params['votingId'])
      .subscribe(
        res => this.votingForm = this.fb.group({
          voting_title: new FormControl(
            res.voting_title, [Validators.required]),
          voting_description: new FormControl(
            res.voting_description, [Validators.required]),
          date_started: new FormControl(
            res.date_started, [Validators.required]),
          date_finished: new FormControl(
            res.date_finished, [Validators.required])
        }),
        errors => this.router.navigate(["/constructor"]));
  }

  createQuestionForms(model: QuestionResponseModel[]): void {
    this.questionsFormGroup = this.fb.group({
      questions: this.fb.array([])
    });
    this.questionFormArray = this.questionsFormGroup.get('questions') as FormArray;
    this.questionsArray = model;
    for (let i = 0; i < model.length; i++) {
      let choicesFGs = [];
      for (let y = 0; y < model[i].choices.length; y++) {
        choicesFGs.push(this.fb.group({
          choice_text: new FormControl(
            model[i].choices[y].choice_text, [Validators.required])
        }))
      }
      let questionFG = this.fb.group({
        question_text: new FormControl(
          model[i].question_text, [Validators.required]),
        max_answers: new FormControl(
          model[i].max_answers, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
        choices: new FormArray(choicesFGs)
      })
      this.questionFormArray.push(questionFG);
    }
    
  }

  createQuestionForm() {
    return this.fb.group({
      question_text: new FormControl(
        '', [Validators.required]),
      max_answers: new FormControl(
        '', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
      choices: new FormArray([this.createChoiceForm()])
    })
  }

  createChoiceForm() {
    return this.fb.group({
      choice_text: new FormControl(
        '', [Validators.required])
    })
  }

  addVoter() {
    (<FormArray>this.votersFormGroup.get('emails')).push(new FormControl('', [Validators.required, Validators.pattern(EmailRegex.Regex)]))
  }

  deleteVoter(index) {
    if (index < this.votersArray.length) {
      this.subscription = this.constructorService
        .DeleteVoter(this.route.snapshot.params['votingId'], this.votersArray[index].id)
        .subscribe(
          res => this.votersArray.splice(index, 1),
          errors => this.errorMessage = errors.message);
    }
    (<FormArray>this.votersFormGroup.get('emails')).removeAt(index)
  }

  addQuestion() {
    this.questionFormArray.push(this.createQuestionForm());
  }

  deleteQuestion(index) {
    if (index < this.questionsArray.length) {
      this.subscription = this.constructorService
        .DeleteQuestion(this.route.snapshot.params['votingId'], this.questionsArray[index].id)
        .subscribe(
          res => this.questionsArray.splice(index, 1),
          errors => this.errorMessage = errors.message);
    }
    this.questionFormArray.removeAt(index);
  }

  addChoice(index) {
    let question = this.questionFormArray.at(index) as FormGroup;
    (<FormArray>question.get('choices')).push(this.createChoiceForm());
  }

  deleteChoice(index_x, index_y) {
    if (index_x < this.questionsArray.length && index_y < this.questionsArray[index_x].choices.length) {
      this.subscription = this.constructorService
        .DeleteChoice(this.route.snapshot.params['votingId'], this.questionsArray[index_x].id, this.questionsArray[index_x].choices[index_y].id)
        .subscribe(
          res => this.questionsArray[index_x].choices.splice(index_y, 1),
          errors => this.errorMessage = errors.message);
    }
    let question = this.questionFormArray.at(index_x) as FormGroup;
    (<FormArray>question.get('choices')).removeAt(index_y);
  }

  formsIsValid() {
    return this.votingForm.status === "VALID" && this.questionsFormGroup.status === "VALID" && this.votersFormGroup.status === "VALID"
  }

  questionSend(id) {
    let questionsArray = this.questionsFormGroup.get('questions') as FormArray
    for (let i = 0; i < questionsArray.length; i++) {
      var questionViewModel = <QuestionCreate>(questionsArray.controls[i].value);
      if (i < this.questionsArray.length) {
        this.subscription = this.constructorService
          .UpdateQuestion(questionViewModel, id, this.questionsArray[i].id)
          .subscribe(
            res => this.choicesSend(id, res.id, questionsArray.controls[i]),
            errors => this.errorMessage = errors.message);
      }
      else {
        this.subscription = this.constructorService
          .CreateQuestion(questionViewModel, id)
          .subscribe(
            res => this.choicesSend(id, res.id, questionsArray.controls[i]),
            errors => this.errorMessage = errors.message);
      }
    }

    let votersArray = this.votersFormGroup.get('emails') as FormArray
    for (let i = this.votersArray.length; i < votersArray.length; i++) {
      var voterViewModel = new VoterCreate(votersArray.controls[i].value);
      this.subscription = this.constructorService
        .CreateVoter(voterViewModel, id)
        .subscribe(
          res => res,
          errors => this.errorMessage = errors.message);
    }
  }

  choicesSend(voting_id, question_id, model) {
    let choicesArray = model.get('choices') as FormArray;
    for (let i = 0; i < choicesArray.length; i++) {
      var choiceViewModel = <ChoiceCreate>(choicesArray.controls[i].value);
      let concrete_question = this.questionsArray.find(x => x.id == question_id);
      if (concrete_question && i < concrete_question.choices.length) {
        this.subscription = this.constructorService
          .UpdateChoice(choiceViewModel, voting_id, question_id, concrete_question.choices[i].id)
          .subscribe(
            res => res,
            errors => this.errorMessage = errors.message);
      }
      else {
        this.subscription = this.constructorService
          .CreateChoice(choiceViewModel, voting_id, question_id)
          .subscribe(
            res => res,
            errors => this.errorMessage = errors.message);
      }
    }

  }

  onSubmit(): void {
    if (this.formsIsValid()) {
      var votingViewModel = <VotingCreateModel>this.votingForm.value;
      votingViewModel.date_started = new Date(votingViewModel.date_started).toISOString()
      votingViewModel.date_finished = new Date(votingViewModel.date_finished).toISOString()
      this.subscription = this.constructorService
        .UpdateVoting(votingViewModel, this.route.snapshot.params['votingId'])
        .subscribe(
          res => this.questionSend(res.id),
          errors => this.errorMessage = errors.message);
      setTimeout(() => {
        this.router.navigate(['constructor'])
      }, 1000);
    }
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(RedactSubmitDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.subscription = this.constructorService
          .DeleteVoting(this.route.snapshot.params['votingId'])
          .subscribe(
            res => this.router.navigate(['/constructor']),
            errors => console.log(errors.message));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}

@Component({
  selector: 'redact-submit-dialog',
  templateUrl: 'submit-dialog.html',
})
export class RedactSubmitDialog {
  constructor(@Inject(L10N_LOCALE) public locale: L10nLocale) { }
}
