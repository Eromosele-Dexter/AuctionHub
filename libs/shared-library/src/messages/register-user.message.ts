class RegisterUserMessage {
  constructor(
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
    public readonly street_name: string,
    public readonly street_number: string,
    public readonly country: string,
    public readonly city: string,
    public readonly postal_code: string,
    public readonly isSeller: boolean,
    public readonly dateRegistered: number,
  ) {}

  toString() {
    return JSON.stringify({
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      password: this.password,
      email: this.email,
      street_name: this.street_name,
      street_number: this.street_number,
      country: this.country,
      city: this.city,
      postal_code: this.postal_code,
      isSeller: this.isSeller,
      dateRegistered: this.dateRegistered,
    });
  }
}

export default RegisterUserMessage;
