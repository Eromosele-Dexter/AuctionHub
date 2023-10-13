class SendValidationCodeEvent {
  constructor(public readonly email: string) {}

  toString() {
    return JSON.stringify({
      email: this.email,
    });
  }
}

export default SendValidationCodeEvent;
