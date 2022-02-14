//import * as jest from "jest"

const languages = {
  createDiagnosticCollection: jest.fn(),
};

export class Disposable {
  //static from(...disposableLikes: { dispose: () => any }[]): Disposable;
//constructor(callOnDispose: () => any);
dispose() { return {}};
}
export interface Event<T> {

  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}


export class EventEmitter<T> { 

  #listener:(e: T) => any = (x:T) => null

  public get event() {
    return (listener: (ee: T) => any, thisArgs?: any, disposables?: Disposable[]) => { 
      this.#listener = listener
    };
}
 // eslint-disable-next-line @typescript-eslint/no-empty-function
 fire(data: T) {this.#listener(data)};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose(){};
}
  
  const vscode = {
    languages,
    EventEmitter
  };
  
export default vscode;