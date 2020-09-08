import {HclwService} from '../hclw.service';

export class ASecret {
  constructor(private hclwService: HclwService, private hclSecret: number) {
  }

  public serialize(encryptionKey) {
    return this.hclwService.api.getCharArrayFromString(
      this.hclwService.api.serializeSecret(this.hclSecret, encryptionKey)
    );
  }

  public get typeName() {
    return this.hclwService.api.getCharArrayFromString(
      this.hclwService.api.getSecretTypeName(this.hclSecret)
    );
  }

  public get correctDecryption() {
    return this.hclwService.api.getSecretCorrectDecryption(this.hclSecret);
  }

  public get secret() {
    return this.hclSecret;
  }

  protected get hclw() {
    return this.hclwService;
  }
}
