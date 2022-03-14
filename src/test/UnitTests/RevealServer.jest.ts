jest.mock("fs-jetpack");

import { RevealServer } from '../../RevealServer'
import Logger , {LogLevel} from '../../Logger';
import {defaultConfiguration} from "../../Configuration"
import request from "supertest"
import { RevealContext } from '../../RevealContext';
import { TextEditor } from 'vscode';


let inExport = false
//--- const getRootDir = () => "getRoot"
//--- const getSlides = () => []
const getConfiguration= () => defaultConfiguration
const extensionPath = "";
const isInExport= () => inExport
//  ---const getExportPath=jest.fn();

const logger =  new Logger(s => s,LogLevel.Error )


const context = new RevealContext( {document:{fileName: ""}} as TextEditor,logger, getConfiguration , extensionPath, isInExport )
const server = new RevealServer(context  )


afterEach(() => {
  server.dispose()
});

test('Default state', () => {
  expect(server.isListening).toBeFalsy()
  expect(server.uri).toBe("")
})

test('Start should return uri and trigger onDidStart', () => {

  const uri = server.start()
  
  expect(server.isListening).toBeTruthy()
  expect(uri).not.toBeUndefined()
  expect(uri).toEqual(server.uri)
})

test('Stop should trigger onDidStop only when server is listening', () => {

  server.stop()

  expect(server.isListening).toBeFalsy()
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
