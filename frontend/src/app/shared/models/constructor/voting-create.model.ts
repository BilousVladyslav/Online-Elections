export class VotingCreateModel {
  voting_title: string
  voting_description: string
  date_started: any
  date_finished: any
}

export class ChoiceCreateModel {
  choice_text: string
}

export class QuestionCreateModel {
  question_title: string
  max_answers: number
  choices: ChoiceCreateModel[]
}

export class VoterReceive {
  id: number
  user: string
  voting: number
}
