export class CustomResponse {
  constructor(
    public readonly data: any,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {}
  toString() {
    return JSON.stringify(
      { data: this.data, message: this.message, status: this.status, error: this.error || null },
      null,
      2,
    );
  }
}
