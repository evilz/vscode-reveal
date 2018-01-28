/**
 * @file Manages the configuration settings for the extension.
 * @author Vincent Bourdon @Evilznet
 */

'use strict'
import * as vscode from 'vscode'
import { ExtensionOptions, IRevealJsOptions, ISlidifyOptions } from './Models'

export const getRevealJsOptions = () => {
  return getExtensionOptions() as IRevealJsOptions
}

export const getSlidifyOptions = () => {
  return getExtensionOptions() as ISlidifyOptions
}

export const getExtensionOptions = () => {
  return (vscode.workspace.getConfiguration('revealjs') as any) as ExtensionOptions
}
