import { Component, OnInit, Output, OnDestroy, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { } from "@angular/material";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConstructorService } from 'src/app/core/services/constructor.service';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { VotingCreateModel } from 'src/app/shared/models/constructor/voting-create.model';
import { QuestionCreate, ChoiceCreate } from 'src/app/shared/models/constructor/question-create.model';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";
import { VoterCreate } from '../../../shared/models/constructor/voter.model';

@Component({
  selector: 'app-constructor-editor',
  templateUrl: './constructor-editor.component.html',
  styleUrls: ['./constructor-editor.component.css']
})
export class ConstructorEditorComponent implements OnInit {

  minDate: Date = new Date();
  votingForm: FormGroup;
  private subscription: Subscription;
  errorMessage: string = null;
  isOrganizer: boolean = false;
  questionFormArray: FormArray;
  questionsFormGroup: FormGroup;
  votersFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authorizationService: AuthorizationService,
    private constructorService: ConstructorService,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale

  ) {
    authorizationService.IsOrganizer.subscribe(x => this.isOrganizer = x);
    if (!this.isOrganizer) {
      this.router.navigate(["/"])
    }
  }

  ngOnInit(): void {
    this.createVotingForm();
    this.createQuestionForms();
    this.createVotersForm();
  }

  createVotersForm() {
    this.votersFormGroup = this.fb.group({
      emails: this.fb.array([])
    })
  }

  createVotingForm(): void {
    this.votingForm = this.fb.group({
      voting_title: new FormControl(
        '', [Validators.required]),
      voting_description: new FormControl(
        '', [Validators.required]),
      date_started: new FormControl(
        '', [Validators.required]),
      date_finished: new FormControl(
        '', [Validators.required])
    })
  }

  createQuestionForms(): void {
    this.questionsFormGroup = this.fb.group({
      questions: this.fb.array([ this.createQuestionForm() ])
    });
    this.questionFormArray = this.questionsFormGroup.get('questions') as FormArray;
  }

  createQuestionForm() {
    return this.fb.group({
      question_text: new FormControl(
        '', [Validators.required]),
      max_answers: new FormControl(
        '', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
      choices: new FormArray([ this.createChoiceForm() ])
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
    (<FormArray>this.votersFormGroup.get('emails')).removeAt(index)
  }

  addQuestion() {
    this.questionFormArray.push( this.createQuestionForm() );
  }

  deleteQuestion(index) {
    this.questionFormArray.removeAt(index);
  }

  addChoice(index) {
    let question = this.questionFormArray.at(index) as FormGroup;
    (<FormArray>question.get('choices')).push(this.createChoiceForm());
  }

  deleteChoice(index_x, index_y) {
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
      this.subscription = this.constructorService
        .CreateQuestion(questionViewModel, id)
        .subscribe(
          res => this.choicesSend(id, res.id, questionsArray.controls[i]),
          errors => this.errorMessage = errors.message);
    }

    let votersArray = this.votersFormGroup.get('emails') as FormArray
    for (let i = 0; i < votersArray.length; i++) {
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
      this.subscription = this.constructorService
        .CreateChoice(choiceViewModel, voting_id, question_id)
        .subscribe(
          res => res,
          errors => this.errorMessage = errors.message);
    }
  }

  onSubmit(): void {
    if (this.formsIsValid()) {
      var votingViewModel = <VotingCreateModel>this.votingForm.value;
      votingViewModel.date_started = votingViewModel.date_started.toISOString()
      votingViewModel.date_finished = votingViewModel.date_finished.toISOString()
      this.subscription = this.constructorService
        .CreateVoting(votingViewModel)
        .subscribe(
          res => this.questionSend(res.id),
          errors => this.errorMessage = errors.message);
      setTimeout(() => {
        this.router.navigate(['constructor'])
      }, 1500);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }


}
