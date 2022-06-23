/*
 * File: \src\Configuration.ts
 * Project: vscode-reveal
 * Created Date: Sunday March 13th 2022
 * Author: evilz
 * -----
 * Last Modified: Wednesday, 16th March 2022 2:57:57 pm
 * Modified By: evilz
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

import { LogLevel } from './Logger'
import { workspace } from 'vscode'

export type Configuration = IRevealOptions & IExtensionOptions

type themes = 'black' | 'white' | 'league' | 'beige' | 'sky' | 'night' | 'serif' | 'simple' | 'solarized'
type transitions = 'default' | 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom'


export interface IRevealOptions {
  controlsTutorial: boolean
  controlsLayout: 'edges' | 'bottom-right'
  controlsBackArrows: 'faded' | 'hidden' | 'visible'
  fragmentInURL: boolean
  autoPlayMedia: boolean
  defaultTiming: number
  display: 'block'
  separator: string
  verticalSeparator: string
  notesSeparator: string
  theme: themes
  highlightTheme: string | null
  customTheme: string | null
  customHighlightTheme: string | null
  controls: boolean
  progress: boolean
  slideNumber: boolean
  history: boolean
  keyboard: boolean
  overview: boolean
  center: boolean
  touch: boolean
  loop: boolean
  rtl: boolean
  shuffle: boolean
  fragments: boolean
  embedded: boolean
  help: boolean
  showNotes: boolean
  autoSlide: number
  autoSlideStoppable: boolean
  autoSlideMethod: string // 'Reveal.navigateNext',
  mouseWheel: boolean
  hideAddressBar: boolean
  previewLinks: boolean
  transition: transitions
  transitionSpeed: 'default' | 'fast' | 'slow'
  backgroundTransition: transitions
  viewDistance: number

  width: number,
  height: number,
  margin: number,
  minScale: number,
  maxScale: number,
  disableLayout: boolean,

  parallaxBackgroundImage: string // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: string // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal: number | null
  parallaxBackgroundVertical: number | null

  title: string
  logoImg: string | null
  description: string
  author: string

  enableMenu: boolean
  enableChalkboard: boolean
  enableTitleFooter: boolean
  enableZoom: boolean
  enableSearch: boolean

  css: string[]
}
export interface IExtensionOptions {
  slideExplorerEnabled: boolean
  browserPath: string | null
  exportHTMLPath: string
  openFilemanagerAfterHTMLExport: boolean
  logLevel: LogLevel
}


/** The default configuration for the Reveal.js presentation. */
export const defaultConfiguration: Configuration = {
  title: 'Reveal JS presentation',
  // tslint:disable-next-line:object-literal-sort-keys
  logoImg: null,
  description: '',
  author: '',
  notesSeparator: 'note:',
  separator: '^\\r?\\n---\\r?\\n$',
  verticalSeparator: '^\\r?\\n--\\r?\\n$',

  customHighlightTheme: null,
  customTheme: null,

  controlsTutorial: true,
  controlsLayout: 'bottom-right',
  controlsBackArrows: 'faded',
  fragmentInURL: false,
  autoPlayMedia: false,
  defaultTiming: 120,
  display: 'block',
  theme: 'black',
  highlightTheme: 'monokai',
  controls: true,
  progress: true,
  slideNumber: false,
  history: true,
  keyboard: true,
  overview: true,
  center: true,
  touch: true,
  loop: false,
  rtl: false,
  shuffle: false,
  fragments: true,
  embedded: false,
  help: true,
  showNotes: false,
  autoSlide: 0,
  autoSlideMethod: 'Reveal.navigateNext',
  autoSlideStoppable: true,
  mouseWheel: false,
  hideAddressBar: true,
  previewLinks: false,
  transition: 'default',
  transitionSpeed: 'default',
  backgroundTransition: 'default',
  viewDistance: 3,

  width: 960,
  height: 700,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,
  disableLayout: false,

  parallaxBackgroundImage: '',
  parallaxBackgroundSize: '',
  parallaxBackgroundHorizontal: 0,
  parallaxBackgroundVertical: 0,

  slideExplorerEnabled: true,
  browserPath: null,
  exportHTMLPath: `./export`,
  openFilemanagerAfterHTMLExport: true,
  logLevel: LogLevel.Error,

  enableMenu: true,
  enableChalkboard: true,
  enableTitleFooter: true,
  enableZoom: true,
  enableSearch: true,

  css: []
}


type ConfigurationDescriptionTypes = "string" | "boolean"
export interface ConfigurationDescription {
  label: string,
  detail: string,
  documentation: string,
  type: ConfigurationDescriptionTypes,
  values?: string[]
}
export const getConfigurationDescription = (properties: object) => {

  const allProps: ConfigurationDescription[] =
    Object.keys(properties)
      .map(key => ({
        label: key.substring(9), // remove "revealjs."
        detail: properties[key].description,
        documentation: `Default value:  ${properties[key].default}`,
        type: properties[key].type,
        values: properties[key].enum
      }))

  return allProps
}

export const configPefix = "revealjs"

export const getConfig = () => {
  const workspaceConfig = workspace.getConfiguration(configPefix) as unknown as Configuration
  return { ...defaultConfiguration, ...workspaceConfig } as Configuration
}

export const mergeConfig = (workspaceConfig, documentConfig) => ({ ...defaultConfiguration, ...workspaceConfig, ...documentConfig } as Configuration)
