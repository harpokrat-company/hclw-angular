import HCLModule from './hcl.js';
import {Password} from './models/password.model';
import {User} from './models/user.model';
import {RSAKeyPair} from './models/rsakeypair.model';
import {SymmetricKey} from './models/symmetrickey.model';
import {ASecret} from './models/asecret.model';
import {RSAPrivateKey} from './models/rsaprivatekey.model';
import {RSAPublicKey} from './models/rsapublickey.model';

export class HclwService {
  module: any;

  private apiFunctions: any;

  private wasmReady: boolean;
  private onWasmReady: (() => any)[];

  constructor() {
    this.instantiateWasm('https://static.harpokrat.com/hcl/hcl.wasm');
    this.onWasmReady = [];
  }

  private async instantiateWasm(url: string) {
    const wasmFile = await fetch(url);
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    const moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: () => {
        // TODO Refactorize using emscripten bind
        // TODO Check bind call destructors
        this.apiFunctions = {
          // String handling
          getCharArrayFromString: this.module.cwrap('GetCharArrayFromString', 'string', ['number']),
          deleteString: this.module.cwrap('DeleteString', null, ['number']),
          // Random
          getBasicAuthString: this.module.cwrap('GetBasicAuthString', 'number', ['string', 'string']),
          getDerivedKey: this.module.cwrap('GetDerivedKey', 'number', ['string']),
          // User
          createUser: this.module.cwrap('CreateUser', 'number', ['string', 'string', 'string', 'string']),
          getEmailFromUser: this.module.cwrap('GetEmailFromUser', 'string', ['number']),
          getPasswordFromUser: this.module.cwrap('GetPasswordFromUser', 'string', ['number']),
          getFirstNameFromUser: this.module.cwrap('GetFirstNameFromUser', 'string', ['number']),
          getLastNameFromUser: this.module.cwrap('GetLastNameFromUser', 'string', ['number']),
          updateUserEmail: this.module.cwrap('UpdateUserEmail', null, ['number', 'string']),
          updateUserPassword: this.module.cwrap('UpdateUserPassword', null, ['number', 'string']),
          updateUserFirstName: this.module.cwrap('UpdateUserFirstName', null, ['number', 'string']),
          updateUserLastName: this.module.cwrap('UpdateUserLastName', null, ['number', 'string']),
          deleteUser: this.module.cwrap('DeleteUser', null, ['number']),
          // RSAKeyPair
          generateRSAKeyPair: this.module.cwrap('GenerateRSAKeyPair', 'number', ['number']),
          getPublicKeyFromRSAKeyPair: this.module.cwrap('GetPublicKeyFromRSAKeyPair', 'number', ['number']),
          getPrivateKeyFromRSAKeyPair: this.module.cwrap('GetPrivateKeyFromRSAKeyPair', 'number', ['number']),
          deleteRSAKeyPair: this.module.cwrap('DeleteRSAKeyPair', null, ['number']),
          // ASecret
          deserializeSecret: this.module.cwrap('DeserializeSecret', 'number', ['number', 'string']),
          serializeSecret: this.module.cwrap('SerializeSecret', 'number', ['number', 'number']),
          getSecretCorrectDecryption: this.module.cwrap('GetSecretCorrectDecryption', 'number', ['number']),
          secretInitializeAsymmetricCipher: this.module.cwrap('SecretInitializeAsymmetricCipher', null, ['number']),
          secretInitializeSymmetricCipher: this.module.cwrap('SecretInitializeSymmetricCipher', null, ['number']),
          getSecretTypeName: this.module.cwrap('GetSecretTypeName', 'number', ['number']),
          deleteSecret: this.module.cwrap('DeleteSecret', null, ['number']),
          // Password
          createPassword: this.module.cwrap('CreatePassword', 'number', []),
          getNameFromPassword: this.module.cwrap('GetNameFromPassword', 'string', ['number']),
          getLoginFromPassword: this.module.cwrap('GetLoginFromPassword', 'string', ['number']),
          getPasswordFromPassword: this.module.cwrap('GetPasswordFromPassword', 'string', ['number']),
          getDomainFromPassword: this.module.cwrap('GetDomainFromPassword', 'string', ['number']),
          updatePasswordName: this.module.cwrap('UpdatePasswordName', null, ['number', 'string']),
          updatePasswordLogin: this.module.cwrap('UpdatePasswordLogin', null, ['number', 'string']),
          updatePasswordPassword: this.module.cwrap('UpdatePasswordPassword', null, ['number', 'string']),
          updatePasswordDomain: this.module.cwrap('UpdatePasswordDomain', null, ['number', 'string']),
          // RSAPrivateKey
          getOwnerFromRSAPrivateKey: this.module.cwrap('GetOwnerFromRSAPrivateKey', 'string', ['number']),
          setRSAPrivateKeyOwner: this.module.cwrap('SetRSAPrivateKeyOwner', null, ['number', 'string']),
          decryptMessageWithRSAPrivateKey: this.module.cwrap('DecryptMessageWithRSAPrivateKey', 'number', ['number', 'string']),
          // RSAPublicKey
          getOwnerFromRSAPublicKey: this.module.cwrap('GetOwnerFromRSAPublicKey', 'string', ['number']),
          setRSAPublicKeyOwner: this.module.cwrap('SetRSAPublicKeyOwner', null, ['number', 'string']),
          encryptMessageWithRSAPublicKey: this.module.cwrap('EncryptMessageWithRSAPublicKey', 'number', ['number', 'string']),
          // SymmetricKey
          createSymmetricKey: this.module.cwrap('CreateSymmetricKey', 'number', []),
          getOwnerFromSymmetricKey: this.module.cwrap('GetOwnerFromSymmetricKey', 'string', ['number']),
          setSymmetricKeyOwner: this.module.cwrap('SetSymmetricKeyOwner', null, ['number', 'string']),
          getKeyFromSymmetricKey: this.module.cwrap('GetKeyFromSymmetricKey', 'string', ['number']),
          setSymmetricKeyKey: this.module.cwrap('SetSymmetricKeyKey', null, ['number', 'string']),
        };
        for (const cb of this.onWasmReady) {
          cb();
        }
        this.wasmReady = true;
      },
    };
    this.module = HCLModule(moduleArgs);
  }

  private async whenWasmReady<T>(callback: () => T): Promise<T> {
    if (this.wasmReady) {
      return callback();
    } else {
      return new Promise<T>(resolve => {
        this.onWasmReady.push(() => {
          resolve(callback());
        });
      });
    }
  }

  public getBasicAuth(email: string, password: string): Promise<string> {
    return this.whenWasmReady<string>(() => {
      const hclString = this.api.getBasicAuthString(email, password);
      const basicAuth = this.api.getCharArrayFromString(hclString);
      this.api.deleteString(hclString);
      return basicAuth;
    });
  }

  public getDerivedKey(password: string): Promise<string> {
    return this.whenWasmReady<string>(() => {
      const hclString = this.api.getDerivedKey(password);
      const derivedKey = this.api.getCharArrayFromString(hclString);
      this.api.deleteString(hclString);
      return derivedKey;
    });
  }

  public createSymmetricKey(): Promise<SymmetricKey> {
    return this.whenWasmReady<SymmetricKey>(() => {
      return new SymmetricKey(this);
    });
  }

  public generateRSAKeyPair(bits: number): Promise<RSAKeyPair> {
    return this.whenWasmReady<RSAKeyPair>(() => {
      return new RSAKeyPair(this, bits);
    });
  }

  public deserializeSecret(key: number, content: string): Promise<ASecret> {
    return this.whenWasmReady<ASecret>(() => {
      const secret = this.api.deserializeSecret(key, content);
      switch (this.api.getSecretTypeName(secret)) {
        case 'password':
          return new Password(this, secret);
        case 'private-key':
          return new RSAPrivateKey(this, secret);
        case 'public-key':
          return new RSAPublicKey(this, secret);
        case 'symmetric-key':
        default:
          return new SymmetricKey(this, secret);
      }
    });
  }

  public createPassword(): Promise<Password> {
    return this.whenWasmReady<Password>(() => {
      return new Password(this);
    });
  }

  public createUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    return this.whenWasmReady<User>(() => {
      return new User(this, email, password, firstName, lastName);
    });
  }

  public get api() {
    return this.apiFunctions;
  }
}
