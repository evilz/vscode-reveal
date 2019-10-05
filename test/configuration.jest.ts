
import { defaultConfiguration, loadConfiguration } from '../src/Configuration'
import { LogLevel } from '../src/Logger'


test('Loaded configuration should override default configuration', () => {

    const mockConfig = {
        slideExplorerEnabled: false,
        browserPath: "somewhere",
        exportHTMLPath: "ici",
        openFilemanagerAfterHTMLExport: false,
        logLevel: LogLevel.Verbose
      }
    const mockgetExtensionConf = () => mockConfig

    const defaultConfig = loadConfiguration(()=> ({}))
    expect(defaultConfig).toStrictEqual(defaultConfiguration)

    const config = loadConfiguration(mockgetExtensionConf)

    expect(config).not.toStrictEqual(defaultConfig)
    expect(config.slideExplorerEnabled).toEqual(mockConfig.slideExplorerEnabled)
    expect(config.browserPath).toBe(mockConfig.browserPath)
    expect(config.exportHTMLPath).toBe(mockConfig.exportHTMLPath)
    expect(config.openFilemanagerAfterHTMLExport).toBe(mockConfig.openFilemanagerAfterHTMLExport)
    expect(config.logLevel).toBe(mockConfig.logLevel)
})
