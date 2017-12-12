'use strict'
import * as vscode from 'vscode'
import { ExtensionOptions, RevealJsOptions, SlidifyOptions } from './Models'

export class Configuration implements ExtensionOptions {

     public get revealJsOptions() {
         return vscode.workspace.getConfiguration('revealjs') as any as RevealJsOptions
     }

    public get slidifyOptions() {
         return vscode.workspace.getConfiguration('revealjs') as any as SlidifyOptions
     }
}
