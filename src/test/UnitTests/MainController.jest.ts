import { ExtensionContext } from 'vscode';
import { Configuration } from '../../Configuration';
import Logger, { LogLevel } from '../../Logger';
import MainController from '../../MainController'



const logger = new Logger(jest.fn(), LogLevel.Debug)

test('Logger should Not log when level is debug', () => {
    // let output = ''
    const main = new MainController(logger, {} as ExtensionContext, [], {} as Configuration, undefined)

    expect(main.currentContext).toBeUndefined()
});
