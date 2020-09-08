import {HclwService} from '../hclw.service';
import {ASecret} from './asecret.model';

export class RSAPrivateKey extends ASecret {
  constructor(hclwService: HclwService, secret: number) {
    super(hclwService, secret);
  }

  public get owner() {
    return this.hclw.api.getOwnerFromRSAPrivateKey(this.secret);
  }

  public set owner(owner) {
    this.hclw.api.setRSAPrivateKeyOwner(this.secret, owner);
  }

  public decryptMessage(message) {
    return this.hclw.api.getCharArrayFromString(
      this.hclw.api.decryptMessageWithRSAPrivateKey(this.secret, message)
    );
  }
}
