import {HclwService} from '../hclw.service';

export class User {
  hclUser: number;

  constructor(private hclwService: HclwService, email: string, password: string, firstName: string, lastName: string) {
    this.hclUser = hclwService.api.createUser(email, password, firstName, lastName);
  }

  public get email() {
    return this.hclwService.api.getEmailFromUser(this.hclUser);
  }

  public set email(email) {
    this.hclwService.api.updateUserEmail(this.hclUser, email);
  }

  public get password() {
    return this.hclwService.api.getPasswordFromUser(this.hclUser);
  }

  public set password(password) {
    this.hclwService.api.updateUserPassword(this.hclUser, password);
  }

  public get firstName() {
    return this.hclwService.api.getFirstNameFromUser(this.hclUser);
  }

  public set firstName(firstName) {
    this.hclwService.api.updateUserFirstName(this.hclUser, firstName);
  }

  public get lastName() {
    return this.hclwService.api.getLastNameFromUser(this.hclUser);
  }

  public set lastName(lastName) {
    this.hclwService.api.updateUserLastName(this.hclUser, lastName);
  }
}
