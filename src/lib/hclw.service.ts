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
    this.onWasmReady = [];
  }

  public async instantiateWasm(url: string) {
    const wasmFile = await fetch(url);
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    const moduleArgs = {
      wasmBinary: binary,
      // TODO Refactorize using emscripten bind
      // TODO Check bind call destructors
      onRuntimeInitialized: () => {
        this.apiFunctions = {
        // String handling
        getCharArrayFromString: this.module['__zone_symbol__value'].cwrap('GetCharArrayFromString', 'string', ['number']),
        deleteString: this.module['__zone_symbol__value'].cwrap('DeleteString', null, ['number']),
        // Random
        getBasicAuthString: this.module['__zone_symbol__value'].cwrap('GetBasicAuthString', 'number', ['string', 'string']),
        getDerivedKey: this.module['__zone_symbol__value'].cwrap('GetDerivedKey', 'number', ['string']),
        // User
        createUser: this.module['__zone_symbol__value'].cwrap('CreateUser', 'number', ['string', 'string', 'string', 'string']),
        getEmailFromUser: this.module['__zone_symbol__value'].cwrap('GetEmailFromUser', 'string', ['number']),
        getPasswordFromUser: this.module['__zone_symbol__value'].cwrap('GetPasswordFromUser', 'string', ['number']),
        getFirstNameFromUser: this.module['__zone_symbol__value'].cwrap('GetFirstNameFromUser', 'string', ['number']),
        getLastNameFromUser: this.module['__zone_symbol__value'].cwrap('GetLastNameFromUser', 'string', ['number']),
        updateUserEmail: this.module['__zone_symbol__value'].cwrap('UpdateUserEmail', null, ['number', 'string']),
        updateUserPassword: this.module['__zone_symbol__value'].cwrap('UpdateUserPassword', null, ['number', 'string']),
        updateUserFirstName: this.module['__zone_symbol__value'].cwrap('UpdateUserFirstName', null, ['number', 'string']),
        updateUserLastName: this.module['__zone_symbol__value'].cwrap('UpdateUserLastName', null, ['number', 'string']),
        deleteUser: this.module['__zone_symbol__value'].cwrap('DeleteUser', null, ['number']),
        // RSAKeyPair
        generateRSAKeyPair: this.module['__zone_symbol__value'].cwrap('GenerateRSAKeyPair', 'number', ['number']),
        getPublicKeyFromRSAKeyPair: this.module['__zone_symbol__value'].cwrap('GetPublicKeyFromRSAKeyPair', 'number', ['number']),
        getPrivateKeyFromRSAKeyPair: this.module['__zone_symbol__value'].cwrap('GetPrivateKeyFromRSAKeyPair', 'number', ['number']),
        deleteRSAKeyPair: this.module['__zone_symbol__value'].cwrap('DeleteRSAKeyPair', null, ['number']),
        // ASecret
        deserializeSecret: this.module['__zone_symbol__value'].cwrap('DeserializeSecret', 'number', ['number', 'string']),
        serializeSecret: this.module['__zone_symbol__value'].cwrap('SerializeSecret', 'number', ['number', 'number']),
        getSecretCorrectDecryption: this.module['__zone_symbol__value'].cwrap('GetSecretCorrectDecryption', 'number', ['number']),
        secretInitializeAsymmetricCipher: this.module['__zone_symbol__value'].cwrap('SecretInitializeAsymmetricCipher', null, ['number']),
        secretInitializeSymmetricCipher: this.module['__zone_symbol__value'].cwrap('SecretInitializeSymmetricCipher', null, ['number']),
        getSecretTypeName: this.module['__zone_symbol__value'].cwrap('GetSecretTypeName', 'number', ['number']),
        deleteSecret: this.module['__zone_symbol__value'].cwrap('DeleteSecret', null, ['number']),
        // Password
        createPassword: this.module['__zone_symbol__value'].cwrap('CreatePassword', 'number', []),
        getNameFromPassword: this.module['__zone_symbol__value'].cwrap('GetNameFromPassword', 'string', ['number']),
        getLoginFromPassword: this.module['__zone_symbol__value'].cwrap('GetLoginFromPassword', 'string', ['number']),
        getPasswordFromPassword: this.module['__zone_symbol__value'].cwrap('GetPasswordFromPassword', 'string', ['number']),
        getDomainFromPassword: this.module['__zone_symbol__value'].cwrap('GetDomainFromPassword', 'string', ['number']),
        updatePasswordName: this.module['__zone_symbol__value'].cwrap('UpdatePasswordName', null, ['number', 'string']),
        updatePasswordLogin: this.module['__zone_symbol__value'].cwrap('UpdatePasswordLogin', null, ['number', 'string']),
        updatePasswordPassword: this.module['__zone_symbol__value'].cwrap('UpdatePasswordPassword', null, ['number', 'string']),
        updatePasswordDomain: this.module['__zone_symbol__value'].cwrap('UpdatePasswordDomain', null, ['number', 'string']),
        // RSAPrivateKey
        getOwnerFromRSAPrivateKey: this.module['__zone_symbol__value'].cwrap('GetOwnerFromRSAPrivateKey', 'string', ['number']),
        setRSAPrivateKeyOwner: this.module['__zone_symbol__value'].cwrap('SetRSAPrivateKeyOwner', null, ['number', 'string']),
        decryptMessageWithRSAPrivateKey: this.module['__zone_symbol__value'].cwrap('DecryptMessageWithRSAPrivateKey', 'number', ['number', 'string']),
        // RSAPublicKey
        getOwnerFromRSAPublicKey: this.module['__zone_symbol__value'].cwrap('GetOwnerFromRSAPublicKey', 'string', ['number']),
        setRSAPublicKeyOwner: this.module['__zone_symbol__value'].cwrap('SetRSAPublicKeyOwner', null, ['number', 'string']),
        encryptMessageWithRSAPublicKey: this.module['__zone_symbol__value'].cwrap('EncryptMessageWithRSAPublicKey', 'number', ['number', 'string']),
        // SymmetricKey
        createSymmetricKey: this.module['__zone_symbol__value'].cwrap('CreateSymmetricKey', 'number', []),
        getOwnerFromSymmetricKey: this.module['__zone_symbol__value'].cwrap('GetOwnerFromSymmetricKey', 'string', ['number']),
        setSymmetricKeyOwner: this.module['__zone_symbol__value'].cwrap('SetSymmetricKeyOwner', null, ['number', 'string']),
        getKeyFromSymmetricKey: this.module['__zone_symbol__value'].cwrap('GetKeyFromSymmetricKey', 'string', ['number']),
        setSymmetricKeyKey: this.module['__zone_symbol__value'].cwrap('SetSymmetricKeyKey', null, ['number', 'string']),
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
