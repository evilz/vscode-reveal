import { Logger, LogLevel } from '../src/Logger'


test('Logger should log error when level is error', () => {

    let output = ""
    const logger = new Logger(LogLevel.Error, (s) => {output = s}  )

    logger.error("text1");

    expect(output).not.toEqual("")
})


test('Logger should NOT log when level is error', () => {

    let output = ""
    const logger = new Logger(LogLevel.Error, (s) => {output = s}  )

    logger.log("text1");

    expect(output).toEqual("")
})


test('Logger should log error when level is verbose', () => {

    let output = ""
    const logger = new Logger(LogLevel.Verbose, (s) => {output = s}  )

    logger.error("text1");

    expect(output).not.toEqual("")
})


test('Logger should log when level is verbose', () => {

    let output = ""
    const logger = new Logger(LogLevel.Verbose, (s) => {output = s}  )

    logger.log("text1");

    expect(output).not.toEqual("")
})


test('Logger should Not log when level is verbose', () => {

    let output = ""
    const logger = new Logger(LogLevel.Verbose, (s) => {output = s}  )

    logger.log("text1");

    expect(output).not.toEqual("")
})