import {HclwService} from '../hclw.service';
import {ASecret} from './asecret.model';

export class RSAPublicKey extends ASecret {
  constructor(hclwService: HclwService, secret: number) {
    super(hclwService, secret);
  }

  public get owner() {
    return this.hclw.api.getOwnerFromRSAPublicKey(this.secret);
  }

  public set owner(owner) {
    this.hclw.api.setRSAPublicKeyOwner(this.secret, owner);
  }

  public encryptMessage(message) {
    return this.hclw.api.getCharArrayFromString(
      this.hclw.api.encryptMessageWithRSAPublicKey(this.secret, message)
    );
  }
}
