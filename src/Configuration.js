"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfiguration = exports.defaultConfiguration = exports.getExtensionOptions = exports.getDocumentOptions = void 0;
const Logger_1 = require("./Logger");
exports.getDocumentOptions = (configuration) => {
    return configuration;
};
exports.getExtensionOptions = (configuration) => {
    return configuration;
};
exports.defaultConfiguration = {
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
    logLevel: Logger_1.LogLevel.Verbose,
    enableMenu: true,
    enableChalkboard: true,
    enableTitleFooter: true,
    enableZoom: true,
    enableSearch: true
};
exports.loadConfiguration = (getExtensionConf) => {
    const loaded = getExtensionConf();
    // tslint:disable-next-line:no-object-literal-type-assertion
    return { ...exports.defaultConfiguration, ...loaded };
};
//# sourceMappingURL=Configuration.js.map