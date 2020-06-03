export class QuestionSubmitModel {
  id: number
  choices: number[]

  constructor(question_id: number) {
    this.id = question_id;
    this.choices = [];
  }
}

export class VotingSubmitModel {
  questions: QuestionSubmitModel[]

  constructor() {
    this.questions = []
  }
}
