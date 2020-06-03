export class ChoiceResultModel {
  id: number
  choice_text: string
  votes: number
}

export class VotingResultModel {
  id: number
  question_text: string
  max_answers: number
  choices: ChoiceResultModel[]
  vote: number
}

