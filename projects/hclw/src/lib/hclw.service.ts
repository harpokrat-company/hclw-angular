import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as Module from '../assets/hcl.js';
import '!!file-loader?name=hcl.wasm!../assets/hcl.wasm';

@Injectable({
  providedIn: 'root'
})
export class HclwService {
  module: any;

  api = {
    getCharArrayFromString: this.module.cwrap('GetCharArrayFromString', 'string', ['number']),
    deleteString: this.module.cwrap('DeleteString', null, ['number']),
    getBasicAuthString: this.module.cwrap('GetBasicAuthString', 'number', ['string', 'string']),
  };

  wasmReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.instantiateWasm('hcl.wasm');
  }

  private async instantiateWasm(url: string) {
    const wasmFile = await fetch(url);
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    const moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: () => {
        this.wasmReady.next(true);
      },
    };

    this.module = Module(moduleArgs);
  }

  private whenWasmReady<T>(callback: () => T): Observable<T> {
    return this.wasmReady.pipe(filter(value => value === true)).pipe(
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
}
