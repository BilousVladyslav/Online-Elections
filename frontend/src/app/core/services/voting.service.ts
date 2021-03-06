import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { VotingListModel } from "../../shared/models/voting/voting-list.model";
import { ActiveVotingInfoModel } from "../../shared/models/voting/voting-active.model";
import { OtherVotingModel } from "../../shared/models/voting/voting-other.model";
import { VotingResultModel } from "../../shared/models/voting/voting-results.model";
import { VotingSubmitModel, QuestionSubmitModel } from "src/app/shared/models/voting/question-submit.model";

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  controllerUrl: string = environment.apiUrl + '/votings/';

  constructor(private http: HttpClient) {
  }

  GetActiveVotings(): Observable<VotingListModel[]> {
    return this.http
      .get<VotingListModel[]>(this.controllerUrl + 'active/');
  }

  GetConcreteActiveVotings(voting_id: number): Observable<VotingListModel> {
    return this.http
      .get<VotingListModel>(this.controllerUrl + 'active/' + voting_id.toString() + '/');
  }

  GetComingVotings(): Observable<OtherVotingModel[]> {
    return this.http
      .get<OtherVotingModel[]>(this.controllerUrl + 'coming/');
  }

  GetConcreteComingVoting(voting_id: number): Observable<OtherVotingModel> {
    return this.http
      .get<OtherVotingModel>(this.controllerUrl + 'coming/' + voting_id.toString() + '/');
  }

  GetFinishedVotings(): Observable<OtherVotingModel[]> {
    return this.http
      .get<OtherVotingModel[]>(this.controllerUrl + 'finished/');
  }

  GetConcreteFinishedVoting(voting_id: number): Observable<OtherVotingModel> {
    return this.http
      .get<OtherVotingModel>(this.controllerUrl + 'finished/' + voting_id.toString() + '/');
  }

  GetVotingSubmiting(voting_id: number): Observable<ActiveVotingInfoModel> {
    return this.http
      .get<ActiveVotingInfoModel>(this.controllerUrl + 'active/' + voting_id.toString() + '/vote/');
  }

  SubmitVoting(voting_result: VotingSubmitModel, voting_id: number): Observable<ActiveVotingInfoModel> {
    return this.http
      .post<ActiveVotingInfoModel>(this.controllerUrl + 'active/' + voting_id.toString() + '/vote/', voting_result);
  }

  GetVotingResults(voting_id: number): Observable<VotingResultModel[]> {
    return this.http
      .get<VotingResultModel[]>(this.controllerUrl + 'active/' + voting_id.toString() + '/results/');
  }
}
