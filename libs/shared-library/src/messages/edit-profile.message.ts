class EditProfileMessage {
  constructor(
    public readonly userId: number,

    public readonly firstName: string,

    public readonly lastName: string,

    public readonly username: string,

    public readonly email: string,

    public readonly streetName: string,

    public readonly streetNumber: string,

    public readonly postalCode: string,

    public readonly city: string,

    public readonly country: string,

    public readonly updatedAt: Date,
  ) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      streetName: this.streetName,
      streetNumber: this.streetNumber,
      postalCode: this.postalCode,
      city: this.city,
      country: this.country,
      updatedAt: this.updatedAt,
    });
  }
}

export default EditProfileMessage;
