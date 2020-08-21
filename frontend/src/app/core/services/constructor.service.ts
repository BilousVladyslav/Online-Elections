import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { VotingCreateModel } from "../../shared/models/constructor/voting-create.model";
import { CreatedVotingModel } from "../../shared/models/constructor/voting-response.model";
import { QuestionResponseModel, ChoiceResponseModel } from "../../shared/models/constructor/question-response.model";
import { QuestionCreate, ChoiceCreate } from "../../shared/models/constructor/question-create.model";
import { VoterReceive, VoterCreate } from "../../shared/models/constructor/voter.model";
import { OtherVotingModel } from "../../shared/models/voting/voting-other.model";

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {

  controllerUrl: string = environment.apiUrl + '/constructor/';

  constructor(private http: HttpClient) {
  }

  GetVotings(): Observable<OtherVotingModel[]> {
    return this.http
      .get<OtherVotingModel[]>(this.controllerUrl);
  }

  CreateVoting(votingModel: VotingCreateModel): Observable<CreatedVotingModel> {
    return this.http
      .post<CreatedVotingModel>(this.controllerUrl, votingModel);
  }

  UpdateVoting(votingModel: VotingCreateModel, voting_id: number): Observable<CreatedVotingModel> {
    return this.http
      .put<CreatedVotingModel>(this.controllerUrl + voting_id.toString() + '/', votingModel);
  }

  DeleteVoting(voting_id: number): Observable<CreatedVotingModel> {
    return this.http
      .delete<CreatedVotingModel>(this.controllerUrl + voting_id.toString() + '/');
  }

  RetrieveVoting(voting_id: number): Observable<CreatedVotingModel> {
    return this.http
      .get<CreatedVotingModel>(this.controllerUrl + voting_id.toString() + '/');
  }

  GetVoters(voting_id: number): Observable<VoterReceive[]> {
    return this.http
      .get<VoterReceive[]>(this.controllerUrl + voting_id.toString() + '/voters/');
  }

  CreateVoter(voterModel: VoterCreate, voting_id: number): Observable<VoterReceive> {
    return this.http
      .post<VoterReceive>(this.controllerUrl + voting_id.toString() + '/voters/', voterModel);
  }

  DeleteVoter(voting_id: number, voter_id: number): Observable<QuestionResponseModel> {
    return this.http
      .delete<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/voters/' + voter_id.toString() + '/');
  }

  GetQuestions(voting_id: number): Observable<QuestionResponseModel[]> {
    return this.http
      .get<QuestionResponseModel[]>(this.controllerUrl + voting_id.toString() + '/questions/');
  }

  CreateQuestion(questionModel: QuestionCreate, voting_id: number): Observable<QuestionResponseModel> {
    return this.http
      .post<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/', questionModel);
  }

  RetrieveQuestion(voting_id: number, question_id: number): Observable<QuestionResponseModel> {
    return this.http
      .get<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/');
  }

  UpdateQuestion(questionModel: QuestionCreate, voting_id: number, question_id: number): Observable<QuestionResponseModel> {
    return this.http
      .put<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/', questionModel);
  }

  DeleteQuestion(voting_id: number, question_id: number): Observable<QuestionResponseModel> {
    return this.http
      .delete<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/');
  }

  GetChoices(voting_id: number, question_id: number): Observable<ChoiceResponseModel[]> {
    return this.http
      .get<ChoiceResponseModel[]>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/choices/');
  }

  CreateChoice(choiceModel: ChoiceCreate, voting_id: number, question_id: number): Observable<ChoiceResponseModel[]> {
    return this.http
      .post<ChoiceResponseModel[]>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/choices/', choiceModel);
  }

  RetrieveChoices(voting_id: number, question_id: number, choice_id: number): Observable<ChoiceResponseModel> {
    return this.http
      .get<ChoiceResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/choices/' + choice_id.toString() + '/');
  }

  UpdateChoice(choiceModel: ChoiceCreate, voting_id: number, question_id: number, choice_id: number): Observable<ChoiceResponseModel> {
    return this.http
      .put<ChoiceResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/choices/' + choice_id.toString() + '/', choiceModel);
  }

  DeleteChoice(voting_id: number, question_id: number, choice_id: number): Observable<QuestionResponseModel> {
    return this.http
      .delete<QuestionResponseModel>(this.controllerUrl + voting_id.toString() + '/questions/' + question_id.toString() + '/choices/' + choice_id.toString() + '/');
  }
}
