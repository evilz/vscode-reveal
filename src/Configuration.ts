/**
 * @file Manages the configuration settings for the extension.
 * @author Vincent Bourdon @Evilznet
 */

'use strict'
import * as vscode from 'vscode'
import { ExtensionOptions, IRevealJsOptions, ISlidifyOptions, IExtensionOptions } from './Models'

export const getRevealJsOptions = () => {
  return loadExtensionOptions() as IRevealJsOptions
}

export const getSlidifyOptions = () => {
  return loadExtensionOptions() as ISlidifyOptions
}

export const getExtensionOptions = () => {
  return loadExtensionOptions() as IExtensionOptions
}

export const loadExtensionOptions = () => {
  return (vscode.workspace.getConfiguration('revealjs') as any) as ExtensionOptions
}
