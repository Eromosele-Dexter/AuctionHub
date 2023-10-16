export class EditProfileUser {
  firstName: string;

  lastName: string;

  username: string;

  email: string;

  streetName: string;

  streetNumber: string;

  postalCode: string;

  city: string;

  country: string;

  updatedAt: Date;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    streetName: string,
    streetNumber: string,
    postalCode: string,
    city: string,
    country: string,
    updatedAt: Date,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.streetName = streetName;
    this.streetNumber = streetNumber;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.updatedAt = updatedAt;
  }
}
