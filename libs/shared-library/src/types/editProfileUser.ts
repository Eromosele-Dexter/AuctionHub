export class EditProfileUser {
  first_name: string;

  last_name: string;

  username: string;

  email: string;

  street_name: string;

  street_number: string;

  postal_code: string;

  city: string;

  country: string;

  updated_at: number;

  constructor(
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    street_name: string,
    street_number: string,
    postal_code: string,
    city: string,
    country: string,
    updated_at: number,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.email = email;
    this.street_name = street_name;
    this.street_number = street_number;
    this.postal_code = postal_code;
    this.city = city;
    this.country = country;
    this.updated_at = updated_at;
  }
}
