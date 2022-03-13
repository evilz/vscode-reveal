import Logger, { LogLevel } from '../../Logger'

const logMock = jest.fn();
test('Logger should Not log when level is debug', () => {
 // let output = ''
  const logger = new Logger(logMock, LogLevel.Debug)

  logger.debug('text1')

  expect(logMock.mock.calls[0][0]).toContain(`[DEBUG]`);
  expect(logMock.mock.calls[0][0]).toContain(`text1`);
  //expect(output).not.toEqual('')
});


test('Logger should log error when level is error', () => {
  let output = ''
  const logger = new Logger((s) => {
    output = s
  })

  logger.error('text1')

  expect(output).not.toEqual('')
});

test('Logger should NOT log when level is none', () => {
  let output = ''
  const logger = new Logger((s) => {
    output = s
  }, LogLevel.None)

  logger.error('text1')

  expect(output).toEqual('')
});

test('Logger should log error when level is warning', () => {
  let output = ''
  const logger = new Logger((s) => {
    output = s
  }, LogLevel.Warning)

  logger.warning('text1')

  expect(output).not.toEqual('')
});

test('Logger should log when level is info', () => {
  let output = ''
  const logger = new Logger( (s) => {
    output = s
  }, LogLevel.Info)

  logger.info('text1')

  expect(output).not.toEqual('')
});

// test('Logger should Not log when level is debug', () => {
//   let output = ''
//   const logger = new Logger((s) => {
//     output = s
//   }, LogLevel.Debug)

//   logger.debug('text1')

//   expect(output).not.toEqual('')
// });
