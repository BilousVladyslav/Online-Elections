export class QuestionCreate {
  question_text: string
  max_answers: number

  constructor(text: string, count: number) {
    this.question_text = text;
    this.max_answers = count;
  }
}

export class ChoiceCreate {
  choice_text: string

  constructor(text: string) {
    this.choice_text = text;
  }
}
