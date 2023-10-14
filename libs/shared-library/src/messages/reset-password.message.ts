class ResetPasswordMessage {
  constructor(
    public readonly email: string,
    public readonly code: number,
    public readonly newPassword: string,
  ) {}

  toString() {
    return JSON.stringify({
      email: this.email,
      code: this.code,
      newPassword: this.newPassword,
    });
  }
}

export default ResetPasswordMessage;
