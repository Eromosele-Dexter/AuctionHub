export class RegisterUserResponse {
  constructor(public readonly token: string) {}

  toString() {
    return JSON.stringify({
      token: this.token,
    });
  }
}
