import * as vscode from 'vscode';

export function disposeAll(disposables: vscode.Disposable[]): void {
	while (disposables.length) {
		const item = disposables.pop();
		if (item) {
			item.dispose();
		}
	}
}

export abstract class Disposable {
	#isDisposed = false;

	protected _disposables: vscode.Disposable[] = [];

	public dispose() {
		if (this.#isDisposed) { return; }
		this.#isDisposed = true;
		disposeAll(this._disposables);
	}

	protected _register<T extends vscode.Disposable>(value: T): T {
		if (this.#isDisposed) {
			value.dispose();
		} else {
			this._disposables.push(value);
		}
		return value;
	}

	protected get isDisposed(): boolean {
		return this.#isDisposed;
	}
}