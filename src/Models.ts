export enum RevealServerState {
  Stopped,
  Started
}

export type ExtensionOptions = ISlidifyOptions & IRevealJsOptions & IExtensionOptions

export interface ISlidifyOptions {
  separator: string
  verticalSeparator: string
  notesSeparator: string
}

export interface IRevealJsOptions {
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
  // autoSlideMethod: Reveal.navigateNext,
  mouseWheel: boolean
  hideAddressBar: boolean
  previewLinks: boolean
  transition: string // 'default', // none/fade/slide/convex/concave/zoom
  transitionSpeed: string // 'default', // default/fast/slow
  backgroundTransition: string // 'default', // none/fade/slide/convex/concave/zoom
  viewDistance: number
  parallaxBackgroundImage: string // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
  parallaxBackgroundSize: string // CSS syntax, e.g. "2100px 900px"
  parallaxBackgroundHorizontal?: number
  parallaxBackgroundVertical?: number
}

export interface IExtensionOptions {
  slideExplorerEnabled: boolean
  browserPath: string
  exportHTMLPath: string
  openFilemanagerAfterHMLTExport: boolean
}

export interface ISlide {
  title: string
  index: number
  text: string
  verticalChildren?: ISlide[] // Rem : child can't have child
}
