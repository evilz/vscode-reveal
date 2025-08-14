import { window } from 'vscode';
import { StatusBarController } from '../../StatusBarController';

test('dispose disposes all status bar items', () => {
  jest.clearAllMocks();

  const controller = new StatusBarController();
  controller.dispose();

  const items = (window.createStatusBarItem as jest.Mock).mock.results.map(r => r.value);
  items.forEach(item => {
    expect(item.dispose).toHaveBeenCalledTimes(1);
  });
});

