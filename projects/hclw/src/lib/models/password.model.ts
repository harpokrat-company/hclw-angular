import {HclwService} from '../hclw.service';
import {ASecret} from './asecret.model';

export class Password extends ASecret {
  constructor(hclwService: HclwService, secret?: number) {
    if (secret === undefined) {
      secret = hclwService.api.createPassword();
    }
    super(hclwService, secret);
  }

  public get name() {
    return this.hclw.api.getNameFromPassword(this.secret);
  }

  public set name(name) {
    this.hclw.api.updatePasswordName(this.secret, name);
  }

  public get password() {
    return this.hclw.api.getPasswordFromPassword(this.secret);
  }

  public set password(password) {
    this.hclw.api.updatePasswordPassword(this.secret, password);
  }

  public get login() {
    return this.hclw.api.getLoginFromPassword(this.secret);
  }

  public set login(login) {
    this.hclw.api.updatePasswordLogin(this.secret, login);
  }

  public get domain() {
    return this.hclw.api.getDomainFromPassword(this.secret);
  }

  public set domain(domain) {
    this.hclw.api.updatePasswordDomain(this.secret, domain);
  }
}
