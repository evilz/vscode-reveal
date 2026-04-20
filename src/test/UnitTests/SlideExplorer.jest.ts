import { SlideTreeProvider } from "../../SlideExplorer";
import * as vscode from "vscode";
import { GO_TO_SLIDE } from "../../commands/goToSlide";

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

test('getChildren maps top-level and vertical slides with right command payload', async () => {
  const provider = new SlideTreeProvider(() => [
    {
      index: 0,
      title: 'Intro',
      text: '# Intro',
      attributes: '',
      verticalChildren: [],
    },
    {
      index: 1,
      title: 'Section',
      text: '# Section',
      attributes: '',
      verticalChildren: [
        { index: 0, title: 'Detail A', text: 'A', attributes: '', verticalChildren: [] },
        { index: 1, title: 'Detail B', text: 'B', attributes: '', verticalChildren: [] },
      ],
    },
  ]);

  const root = await provider.getChildren();
  expect(root).toHaveLength(2);
  expect(root?.[0].label).toBe('0 : Intro');
  expect(root?.[0].command).toEqual({
    arguments: [{ horizontal: 0, vertical: 0 }],
    command: GO_TO_SLIDE,
    title: 'Go to slide',
  });
  expect(root?.[1].collapsibleState).toBe(vscode.TreeItemCollapsibleState.Collapsed);

  const verticalChildren = await provider.getChildren(root?.[1]);
  expect(verticalChildren).toHaveLength(2);
  expect(verticalChildren?.[0].label).toBe('0 : Detail A');
  expect(verticalChildren?.[0].command).toEqual({
    arguments: [{ horizontal: 1, vertical: 0 }],
    command: GO_TO_SLIDE,
    title: 'Go to slide',
  });
});

test('update fires tree refresh and update event', () => {
  const provider = new SlideTreeProvider(() => []);
  const updateListener = jest.fn();
  provider.onDidUpdate(updateListener);

  provider.update();

  expect(updateListener).toHaveBeenCalledTimes(1);
});
