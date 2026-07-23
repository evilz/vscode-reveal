import {DecorationOptions, MarkdownString, Range, TextEditor, TextEditorDecorationType, ThemeColor, window} from 'vscode';
import { ConfigurationDescription } from './Configuration';
import { Disposable } from './dispose';


// styles for known options in the frontmatter
export default class TextDecorator extends Disposable {

    #propertiesRegex: RegExp
    readonly #decorationType: TextEditorDecorationType
   
    constructor(private configDesc:ConfigurationDescription[] ) {
        super()
        this.#decorationType = this._register(window.createTextEditorDecorationType({
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: new ThemeColor('revealjs.configKeyForeground'),
        }))
        const allProps = configDesc.map(x => x.label).join('|')
        this.#propertiesRegex = new RegExp(`^(${allProps}):.*$`, 'gm');
    }

    update(editor: TextEditor) {

        const decorations: DecorationOptions[] = [];
        let match;
		while ((match = this.#propertiesRegex.exec(editor.document.getText())) !== null) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[1].length);

            const item = this.configDesc.find(x => x.label === match[1]);
            let hoverMessage: MarkdownString = new MarkdownString();
            if (item) {
                hoverMessage =  new MarkdownString('$(symbol-enum) ' +item.detail + '\n\n' + item.documentation)
                hoverMessage.isTrusted = true
                hoverMessage.supportThemeIcons =true
            }
			const decoration = { range: new Range(startPos, endPos), hoverMessage: hoverMessage };
			decorations.push(decoration);
		}

        editor.setDecorations(this.#decorationType, decorations);
    }

}
