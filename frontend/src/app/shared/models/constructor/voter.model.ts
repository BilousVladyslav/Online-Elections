export class VoterCreate {
  user_email: string

  constructor(email: string) {
    this.user_email = email
  }
}

export class VoterReceive {
  id: number
  user: string
  voting: number
}
