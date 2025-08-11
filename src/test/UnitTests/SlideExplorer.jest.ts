import { SlideTreeProvider } from "../../SlideExplorer";
import * as vscode from "vscode";

test('dispose cleans up registered provider', () => {
  const dispose = jest.fn();
  const registration = { dispose } as vscode.Disposable;
  const spy = jest.spyOn(vscode.window, 'registerTreeDataProvider').mockReturnValue(registration);

  const provider = new SlideTreeProvider(() => []);
  provider.register();
  provider.dispose();

  expect(spy).toHaveBeenCalledTimes(1);
  expect(dispose).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});
