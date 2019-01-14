/**
 * @file Manages the configuration settings for the extension.
 * @author Vincent Bourdon @Evilznet
 */

'use strict'
import { workspace } from 'vscode'
import { extensionId } from './constants';

export type Configuration = IDocumentOptions & IExtensionOptions

export interface IDocumentOptions {
  separator: string
  verticalSeparator: string
  notesSeparator: string

  theme?: string
  highlightTheme?: string

  customTheme?: string
  customHighlightTheme?: string

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
  transition: string // 'default', // none/fade/slide/convex/concave/zoom
  transitionSpeed: string // 'default', // default/fast/slow
  backgroundTransition: string // 'default', // none/fade/slide/convex/concave/zoom
  viewDistance: number
  parallaxBackgroundImage: string // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: string // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal: number | null
  parallaxBackgroundVertical: number | null

  title: string // TODO : should take first big title or can be set
  layout: string
}

export interface IExtensionOptions {
  slideExplorerEnabled: boolean
  browserPath: string | null
  exportHTMLPath: string | null
  openFilemanagerAfterHTMLExport: boolean
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
  notesSeparator: 'note:',
  separator: '^[\r\n?|\n]---[\r\n?|\n]$',
  verticalSeparator: '^[\r\n?|\n]--[\r\n?|\n]$',
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
  parallaxBackgroundHorizontal: null,
  parallaxBackgroundVertical: null,
  slideExplorerEnabled: true,
  browserPath: null,
  exportHTMLPath: null,
  openFilemanagerAfterHTMLExport: true
}

export const loadConfiguration = () => {
  const loaded = workspace.getConfiguration(extensionId)
  return ({ ...defaultConfiguration, ...loaded } as any) as Configuration
}
