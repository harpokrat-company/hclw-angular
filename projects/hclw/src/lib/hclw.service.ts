import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import HCLModule from './hcl.js';
import {Secret} from './models/secret.model';
import {User} from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HclwService {
  module: any;

  private apiFunctions: any;

  wasmReady = new ReplaySubject<void>();

  constructor() {
    this.instantiateWasm('http://static.harpokrat.com/hcl/hcl.wasm');
  }

  private async instantiateWasm(url: string) {
    const wasmFile = await fetch(url);
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    const moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: () => {
        this.apiFunctions = {
          getCharArrayFromString: this.module.cwrap('GetCharArrayFromString', 'string', ['number']),
          deleteString: this.module.cwrap('DeleteString', null, ['number']),
          getBasicAuthString: this.module.cwrap('GetBasicAuthString', 'number', ['string', 'string']),
          getDerivedKey: this.module.cwrap('GetDerivedKey', 'number', ['string']),
          getSecretFromContent: this.module.cwrap('GetSecretFromContent', 'number', ['string', 'string']),
          createSecret: this.module.cwrap('CreateSecret', 'number', []),
          correctSecretDecryption: this.module.cwrap('CorrectSecretDecryption', 'number', ['number']),
          getNameFromSecret: this.module.cwrap('GetNameFromSecret', 'string', ['number']),
          getLoginFromSecret: this.module.cwrap('GetLoginFromSecret', 'string', ['number']),
          getPasswordFromSecret: this.module.cwrap('GetPasswordFromSecret', 'string', ['number']),
          getDomainFromSecret: this.module.cwrap('GetDomainFromSecret', 'string', ['number']),
          getContentStringFromSecret: this.module.cwrap('GetContentStringFromSecret', 'number', ['number', 'string']),
          updateSecretName: this.module.cwrap('UpdateSecretName', null, ['number', 'string']),
          updateSecretLogin: this.module.cwrap('UpdateSecretLogin', null, ['number', 'string']),
          updateSecretPassword: this.module.cwrap('UpdateSecretPassword', null, ['number', 'string']),
          updateSecretDomain: this.module.cwrap('UpdateSecretDomain', null, ['number', 'string']),
          deleteSecret: this.module.cwrap('DeleteSecret', null, ['number']),
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
        };
        this.wasmReady.next();
      },
    };

    this.module = HCLModule(moduleArgs);
  }

  private whenWasmReady<T>(callback: () => T): Observable<T> {
    return this.wasmReady.pipe(
      map(callback)
    );
  }

  public getBasicAuth(email: string, password: string): Observable<string> {
    return this.whenWasmReady<string>(() => {
      const hclString = this.api.getBasicAuthString(email, password);
      const basicAuth = this.api.getCharArrayFromString(hclString);
      this.api.deleteString(hclString);
      return basicAuth;
    });
  }

  public getDerivedKey(password: string): Observable<string> {
    return this.whenWasmReady<string>(() => {
      const hclString = this.api.getDerivedKey(password);
      const derivedKey = this.api.getCharArrayFromString(hclString);
      this.api.deleteString(hclString);
      return derivedKey;
    });
  }

  public createSecret(key?: string, content?: string): Observable<Secret> {
    return this.whenWasmReady<Secret>(() => {
      return new Secret(this, key, content);
    });
  }

  public createUser(email: string, password: string, firstName: string, lastName: string): Observable<User> {
    return this.whenWasmReady<User>(() => {
      return new User(this, email, password, firstName, lastName);
    });
  }

  public get api() {
    return this.apiFunctions;
  }
}
