class RegisterUserMessage {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
    public readonly streetName: string,
    public readonly streetNumber: string,
    public readonly country: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly isSeller: boolean,
    public readonly dateRegistered: Date,
  ) {}

  toString() {
    return JSON.stringify({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
      streetName: this.streetName,
      streetNumber: this.streetNumber,
      country: this.country,
      city: this.city,
      postalCode: this.postalCode,
      isSeller: this.isSeller,
      dateRegistered: this.dateRegistered,
    });
  }
}

export default RegisterUserMessage;
