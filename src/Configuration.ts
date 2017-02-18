'use strict';
import * as vscode from 'vscode';
import { ExtensionOptions, SlidifyOptions, RevealJsOptions } from './Models';

export class Configuration implements ExtensionOptions {

     public get revealJsOptions(){
         return <any>vscode.workspace.getConfiguration('revealjs') as RevealJsOptions;
     }

    public get slidifyOptions(){
         return <any>vscode.workspace.getConfiguration('revealjs') as SlidifyOptions;
     }
}