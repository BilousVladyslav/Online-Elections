export class SubmitVotingModel {
  already_voted: boolean
  voting_date: Date
  questions: [string, number[]][]
}
