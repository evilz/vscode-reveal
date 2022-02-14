// AVANT
jest.mock("fs-jetpack");


import { RevealServer } from '../../RevealServer'
import Logger , {LogLevel} from '../../Logger';
import {defaultConfiguration} from "../../Configuration"
import request from "supertest"


//jest.mock('./Logger');

let inExport = false
const getRootDir = () => "getRoot"
const getSlides = () => []
const getConfiguration= () => defaultConfiguration
const extensionPath = "";
const isInExport= () => inExport
const getExportPath=jest.fn();

const logger =  new Logger(s => s,LogLevel.Error )



const server = new RevealServer(logger,getRootDir, getSlides,getConfiguration, extensionPath, isInExport,getExportPath  )


afterEach(() => {
  server.dispose()
});

test('Default state', () => {
  expect(server.isListening).toBeFalsy()
  expect(server.uri).toBe("")
})

test('Start should return uri and trigger onDidStart', () => {

  let receivedUri = ""
  server.onDidStart(uri => receivedUri = uri)
  const uri = server.start()
  expect(receivedUri).toEqual(uri)
})

test('Stop should trigger onDidStop only when server is listening', () => {

  const onDidStopLock = jest.fn()
  server.onDidStop( onDidStopLock )
  server.stop()

  expect(onDidStopLock).toHaveBeenCalledTimes(0)
})

test('Stop should trigger onDidStop', () => {

  const onDidStopLock = jest.fn()
  server.onDidStop( onDidStopLock )
  server.start()
  server.stop()

  expect(onDidStopLock).toHaveBeenCalledTimes(1)
})


test('Dispose should trigger onDidDispose and Stop', () => {

  const onDidStopMock = jest.fn()
  const onDidDisposeMock = jest.fn()
  server.onDidStop( onDidStopMock )
  server.onDidDispose( onDidDisposeMock)
  server.start()
  server.dispose()

  expect(onDidStopMock).toHaveBeenCalledTimes(1)
  expect(onDidDisposeMock).toHaveBeenCalledTimes(1)
})

test('Request root', async () => {


  const response = await request(server.app.callback()).get('/')
  expect(response.status).toEqual(200);
  expect(response.type).toEqual('text/html');
  expect(response.text).toMatchSnapshot()
})


test('Request with export', async () => {
 
  inExport = true
  const response = await request(server.app.callback()).get('/')
  expect(response.status).toEqual(200);
  expect(response.type).toEqual('text/html');
  //expect(response.text).toMatchSnapshot()
})
