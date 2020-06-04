export class ChoiceResponseModel {
  id: number
  choice_text: string
  question: number
}


export class QuestionResponseModel {
  id: number
  question_text: string
  max_answers: number
  vote: number
  choices: ChoiceResponseModel[]
}
