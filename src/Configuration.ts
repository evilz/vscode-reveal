'use strict';
import * as vscode from 'vscode';
import { ExtensionOptions, RevealServerState, SlidifyOptions, RevealJsOptions } from './models'

export class Configuration implements ExtensionOptions {

     public get revealJsOptions(){
         return <any>vscode.workspace.getConfiguration('revealjs') as RevealJsOptions;
     }

    public get slidifyOptions(){
         return <any>vscode.workspace.getConfiguration('revealjs') as SlidifyOptions;
     }
}