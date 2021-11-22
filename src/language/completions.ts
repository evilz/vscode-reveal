import {  ExtensionContext, languages ,TextDocument, Position, CancellationToken , CompletionContext, CompletionItem,CompletionItemKind, SnippetString, MarkdownString} from 'vscode'

const configDefinition = [
    {
        name:  'highlightTheme',
        detail: 'The theme to use for syntax highlighting',
        documentation: 'Monokai is used by default.\nA full list of available themes can be found at https://highlightjs.org/static/demo/.',
        values: ["a11y-dark","a11y-light","agate","an-old-hope","androidstudio","arduino-light","arta","ascetic","atom-one-dark-reasonable","atom-one-dark","atom-one-light","brown-paper","brown-papersq.png","codepen-embed","color-brewer","dark","devibeans","docco","far","foundation","github-dark-dimmed","github-dark","github","gml","googlecode","gradient-dark","gradient-light","grayscale","hybrid","idea","ir-black","isbl-editor-dark","isbl-editor-light","kimbie-dark","kimbie-light","lightfair","lioshi","magula","mono-blue","monokai-sublime","monokai","night-owl","nnfx-dark","nnfx-light","nord","obsidian","paraiso-dark","paraiso-light","pojoaque.jpg","pojoaque","purebasic","qtcreator-dark","qtcreator-light","rainbow","routeros","school-book","shades-of-purple","srcery","stackoverflow-dark","stackoverflow-light","sunburst","tomorrow-night-blue","tomorrow-night-bright","vs","vs2015","xcode","xt256"]
    },
    
]

//provideCompletionItems
const enumValueProvider = (prefix:string, values: string[]) => { 
    return {
        provideCompletionItems (document: TextDocument, position: Position) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.startsWith(`${prefix}: `)) {
            return undefined;
        }
        return values.map(theme =>  new CompletionItem(theme,  CompletionItemKind.EnumMember));
        }
    }
}


export const registerCompletionProvider = (context:ExtensionContext) => {

    const props = context.extension.packageJSON.contributes.configuration.properties

    const completionItems: CompletionItem[] = []
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const prop = props[key];
            const label = key.substr(9);
            const completionItem = new CompletionItem(label); // remove "revealjs."
            completionItem.kind = CompletionItemKind.Enum;
            completionItem.detail = prop.description;
            completionItem.filterText = label;
            if(prop.default) { completionItem.documentation = new MarkdownString(`Default value:  ${prop.default}`);}

            switch (prop.type) {
                case 'string': 
                    if(prop.enum && prop.enum.length > 0) {
                        context.subscriptions.push(languages.registerCompletionItemProvider('markdown',enumValueProvider(label, prop.enum)));
                    }
                    break;
                case 'boolean':
                    context.subscriptions.push(languages.registerCompletionItemProvider('markdown',enumValueProvider(label, [ 'true', 'false' ])));
                    break;
                }

            completionItem.commitCharacters = [' '];
            completionItem.insertText = completionItem.label + ': ';


            completionItems.push(completionItem);
        }
    }
    // const completionItems =props.map(prop => {
    //     const completionItem = new CompletionItem(prop.name);
    //     completionItem.kind = CompletionItemKind.Enum;
    //     completionItem.detail = item.detail;
    //     completionItem.insertText = item.name + ': ';
    //     completionItem.documentation = new MarkdownString(item.documentation);
    //     completionItem.commitCharacters = [' '];

    //     if(item.values && item.values.length > 0) {
    //         context.subscriptions.push(languages.registerCompletionItemProvider('markdown',enumValueProvider(item.name, item.values)))};
    //     return completionItem;
    // });


    const provider1 =  languages.registerCompletionItemProvider('markdown', {

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        return completionItems.filter(item => item.label.toString().startsWith(linePrefix));
    }})

    context.subscriptions.push(provider1)


};
