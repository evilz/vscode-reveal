import { LogLevel } from './Logger'

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
  parallaxBackgroundImage: string // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: string // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal: number | null
  parallaxBackgroundVertical: number | null

  title: string // TODO : should take first big title or can be set
  layout: string
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
  layout: '',
  title: 'title',
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
  highlightTheme: 'Zenburn',
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
  enableSearch: true
}

export const loadConfiguration = (getExtensionConf: () => any) => {
  const loaded = getExtensionConf()
  // tslint:disable-next-line:no-object-literal-type-assertion
  return { ...defaultConfiguration, ...loaded } as Configuration
}
