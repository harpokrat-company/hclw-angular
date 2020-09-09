import {HclwService} from '../hclw.service';
import {ASecret} from './asecret.model';

export class SymmetricKey extends ASecret {
  constructor(hclwService: HclwService, secret?: number) {
    if (secret === undefined) {
      secret = hclwService.api.createSymmetricKey();
    }
    super(hclwService, secret);
  }

  public get owner() {
    return this.hclw.api.getOwnerFromSymmetricKey(this.secret);
  }

  public set owner(owner) {
    this.hclw.api.setSymmetricKeyOwner(this.secret, owner);
  }

  public get key() {
    return this.hclw.api.getKeyFromSymmetricKey(this.secret);
  }

  public set key(key) {
    this.hclw.api.setSymmetricKeyKey(this.secret, key);
  }

  public get encryptionKeyType() {
    return this.hclw.api.getSymmetricKeyEncryptionKeyType(this.secret);
  }
}
