import {DecorationOptions, MarkdownString, Range, TextEditor, ThemeColor, window} from 'vscode';
import { ConfigurationDescription } from './Configuration';


// styles for known options in the frontmatter
const revealjsConfigKeyForeground = window.createTextEditorDecorationType({
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: new ThemeColor('revealjs.configKeyForeground'),
  })
  
export default class TextDecorator {

    #propertiesRegex: RegExp
   
    constructor(private configDesc:ConfigurationDescription[] ) {
        
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

        editor.setDecorations(revealjsConfigKeyForeground, decorations);
    }

}
