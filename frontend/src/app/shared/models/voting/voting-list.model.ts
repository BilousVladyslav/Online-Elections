export class VotingListModel {
  id: number
  voting_title: string
  voting_description: string
  date_started: Date
  date_finished: Date
  organizer: string
  questions: number[]
}
