import {HclwService} from '../hclw.service';

export class Secret {
  hclSecret: number;

  constructor(private hclwService: HclwService, key?: string, content?: string) {
    if (key === undefined || content === undefined) {
      this.hclSecret = hclwService.api.createSecret();
    } else {
      this.hclSecret = hclwService.api.getSecretFromContent(key, content);
    }
  }

  public get name() {
    return this.hclwService.api.getNameFromSecret(this.hclSecret);
  }

  public set name(name) {
    this.hclwService.api.updateSecretName(this.hclSecret, name);
  }

  public get password() {
    return this.hclwService.api.getPasswordFromSecret(this.hclSecret);
  }

  public set password(password) {
    this.hclwService.api.updateSecretPassword(this.hclSecret, password);
  }

  public get login() {
    return this.hclwService.api.getLoginFromSecret(this.hclSecret);
  }

  public set login(login) {
    this.hclwService.api.updateSecretLogin(this.hclSecret, login);
  }

  public get domain() {
    return this.hclwService.api.getDomainFromSecret(this.hclSecret);
  }

  public set domain(domain) {
    this.hclwService.api.updateSecretDomain(this.hclSecret, domain);
  }

  public get content() {
    return this.hclwService.api.getCharArrayFromString(this.hclwService.api.getContentStringFromSecret(this.hclSecret));
  }

  public get correct_decryption() {
    return this.hclwService.api.correctSecretDecryption(this.hclSecret);
  }
}
