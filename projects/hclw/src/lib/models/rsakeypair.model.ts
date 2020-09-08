import {HclwService} from '../hclw.service';
import {RSAPrivateKey} from './rsaprivatekey.model';
import {RSAPublicKey} from './rsapublickey.model';

export class RSAKeyPair {
  private readonly hclRSAKeyPair: number;

  constructor(private hclwService: HclwService, bits: number) {
    this.hclRSAKeyPair = this.hclwService.api.generateRSAKeyPair(bits);
  }

  public createPrivateKey() {
    return new RSAPrivateKey(
      this.hclwService,
      this.hclwService.api.getPrivateKeyFromRSAKeyPair(this.hclRSAKeyPair)
    );
  }

  public createPublicKey() {
    return new RSAPublicKey(
      this.hclwService,
      this.hclwService.api.getPublicKeyFromRSAKeyPair(this.hclRSAKeyPair)
    );
  }
}
