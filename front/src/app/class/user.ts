export class User {
  id?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  earthCountry: string;
  earthJob: string;
  state?: UserState;
  country: string;
  job: string;
}

export enum UserState {
  CREATED="CREATED",
  EARTH_CONTROL="EARTH_CONTROL",
  MARS_CONTROL="MARS_CONTROL",
  DONE="DONE",
  REFUSED="REFUSED"
}
