import { LogLevel } from './Logger'
import { workspace } from 'vscode'
import { extensionId } from './utils'
import { isDeepStrictEqual } from 'util'

import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'

/**
 * @file Manages the configuration settings for the extension.
 * @author Vincent Bourdon @Evilznet
 */

export type Configuration = IDocumentOptions & IExtensionOptions

type themes = 'black' | 'white' | 'league' | 'beige' | 'sky' | 'night' | 'serif' | 'simple' | 'solarized'
type transitions = 'default' | 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom'

export interface IDocumentOptions {
  controlsTutorial: boolean
  controlsLayout: 'edges' | 'bottom-right'
  controlsBackArrows: 'faded' | 'hidden' | 'visible'
  fragmentInURL: boolean
  autoPlayMedia: boolean
  defaultTiming: number
  display: 'block'

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
}
export interface IExtensionOptions {
  slideExplorerEnabled: boolean
  browserPath: string | null
  exportHTMLPath: string
  openFilemanagerAfterHTMLExport: boolean
  logLevel: LogLevel
}

export const getDocumentOptions = (configuration: Configuration) => {
  return configuration as IDocumentOptions
}

export const getExtensionOptions = (configuration: Configuration) => {
  return configuration as IExtensionOptions
}

export const defaultConfiguration: Configuration = {
  title: 'Reveal JS presentation',
  // tslint:disable-next-line:object-literal-sort-keys
  logoImg: null,
  description: '',
  author: '',

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
  parallaxBackgroundImage: '',
  parallaxBackgroundSize: '',
  parallaxBackgroundHorizontal: 0,
  parallaxBackgroundVertical: 0,

  slideExplorerEnabled: true,
  browserPath: null,
  exportHTMLPath: `./export`,
  openFilemanagerAfterHTMLExport: true,
  logLevel: LogLevel.Verbose,

  enableMenu: true,
  enableChalkboard: true,
  enableTitleFooter: true,
  enableZoom: true,
  enableSearch: true,
}

export interface ConfigurationDescription {
  label:string,
  detail: string,
  documentation: string,
  type: string,
  values?: string[]
}
export const getConfigurationDescription = (properties:object) => {

  const allProps:ConfigurationDescription[] =
    Object.keys(properties)
    .map(key => ({ label: key.substr(9),
                  detail: properties[key].description,
                  documentation: `Default value:  ${properties[key].default}`,
                  type: properties[key].type,
                  values: properties[key].enum}))

  return allProps
}



interface ConfigurationProviderEvents {
  updated: (Configuration) => void
  error: (error: Error) => void
}



export default class ConfigurationProvider extends (EventEmitter as new () => TypedEmitter<ConfigurationProviderEvents>) {
  #workspaceConfig: Configuration
  #documentConfig: Configuration
  #configuration: Configuration

  constructor() {
    super()
    this.#workspaceConfig = workspace.getConfiguration(extensionId) as unknown as Configuration
    this.#documentConfig = {} as Configuration
    this.#configuration = defaultConfiguration
  }

  public get configuration() { return this.#configuration }
  set configuration(v : Configuration) { this.#configuration = v; this.emit('updated', this.configuration) }
  

  public get documentConfig() { return this.#documentConfig }
  public set documentConfig(v: Configuration) {
    if (!isDeepStrictEqual(this.#documentConfig, v)) {
      this.#documentConfig = v
      this.#refresh()
    }
  }

  public get workspaceConfig() {
    return this.#workspaceConfig
  }

  public reloadWorkspaceConfig() {
    const loaded = workspace.getConfiguration(extensionId) as unknown as Configuration
    if (!isDeepStrictEqual(this.#workspaceConfig, loaded)) {
      this.#workspaceConfig = loaded
      this.#refresh()
    }
  }

  #refresh = () => {
    this.configuration = { ...defaultConfiguration, ...this.#workspaceConfig, ...this.#documentConfig }
  }
}
