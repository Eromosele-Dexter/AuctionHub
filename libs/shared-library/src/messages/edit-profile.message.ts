class EditProfileMessage {
  constructor(
    public readonly userId: number,

    public readonly first_name: string,

    public readonly last_name: string,

    public readonly username: string,

    public readonly email: string,

    public readonly street_name: string,

    public readonly street_number: string,

    public readonly postal_code: string,

    public readonly city: string,

    public readonly country: string,

    public readonly updated_at: number,
  ) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
      street_name: this.street_name,
      street_number: this.street_number,
      postal_code: this.postal_code,
      city: this.city,
      country: this.country,
      updated_at: this.updated_at,
    });
  }
}

export default EditProfileMessage;
