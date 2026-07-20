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
  slideNumber: boolean | string
  history: boolean
  keyboard: boolean | Record<string, string | null>
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
  pdfMaxPagesPerSlide: number | null
  pdfSeparateFragments: boolean
  viewDistance: number

  width: number | string,
  height: number | string,
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
  cssvariables: object | null

  diagramServerEnabled: boolean
  diagramServerUrl: string
}
export interface IExtensionOptions {
  slideExplorerEnabled: boolean
  browserPath: string | null
  exportHTMLPath: string
  openFilemanagerAfterHTMLExport: boolean
  logLevel: LogLevel
}

export const configPrefix = "revealjs"
// Backward-compatible alias kept for existing imports.
export const configPefix = configPrefix

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
  transition: 'slide',
  transitionSpeed: 'default',
  backgroundTransition: 'fade',
  pdfMaxPagesPerSlide: null,
  pdfSeparateFragments: true,
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

  css: [],
  cssvariables: null,

  diagramServerEnabled: true,
  diagramServerUrl: 'https://kroki.io'
}


type ConfigurationDescriptionTypes = "string" | "boolean" | "number" | "array" | "object" | "null"
export interface ConfigurationDescription {
  label: string,
  detail: string,
  documentation: string,
  type: ConfigurationDescriptionTypes | ConfigurationDescriptionTypes[],
  values?: string[],
  defaultValue?: unknown
}
type RawConfigurationProperty = {
  type: string | string[]
  default?: unknown
  description?: string
  markdownDescription?: string
  enum?: string[]
}

const collectTypes = (type: string | string[]): ConfigurationDescriptionTypes | ConfigurationDescriptionTypes[] => {
  const knownTypes = new Set<string>(['string', 'boolean', 'number', 'array', 'object', 'null'])
  const types = Array.isArray(type) ? type : [type]
  const filtered = types.filter((t): t is ConfigurationDescriptionTypes => knownTypes.has(t))
  if (filtered.length === 0) return 'string'
  if (filtered.length === 1) return filtered[0]
  return filtered
}

export const getConfigurationDescription = (properties: Record<string, RawConfigurationProperty>) => {

  const allProps: ConfigurationDescription[] =
    Object.keys(properties)
      .map(key => ({
        label: key.startsWith(`${configPrefix}.`) ? key.substring(configPrefix.length + 1) : key,
        detail: properties[key].description || properties[key].markdownDescription || '',
        documentation: properties[key].markdownDescription || properties[key].description || '',
        type: collectTypes(properties[key].type),
        values: properties[key].enum,
        defaultValue: properties[key].default
      }))

  return allProps
}

export const getConfig = () => {
  const workspaceConfig = workspace.getConfiguration(configPrefix) as unknown as Configuration
  return { ...defaultConfiguration, ...workspaceConfig } as Configuration
}

export const mergeConfig = (workspaceConfig, documentConfig) => ({ ...defaultConfiguration, ...workspaceConfig, ...documentConfig } as Configuration)
