class LoginUserMessage {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  toString() {
    return JSON.stringify({
      username: this.username,
      password: this.password,
    });
  }
}

export default LoginUserMessage;
