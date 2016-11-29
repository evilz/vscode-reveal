import { TextEditor } from 'vscode';
import { Configuration } from './Configuration';
import * as vscode from 'vscode';

export class Helpers {

    private config: Configuration;
    constructor(config: Configuration) {
        this.config = config;
    }

    public getSlideCount(text: string): number {
        return this.getCount(text, this.config.slidifyOptions.separator) + 1   
    }

    public getInnerSlideCount(text: string): number {
        return this.getCount(text, this.config.slidifyOptions.verticalSeparator)      
    }

    private getCount(text: string, separator:string): number {
        let count = 0;
        let regex = new RegExp(separator, "gm");

        let matches = text.match(regex);
        if (matches) {
            count = matches.length;
        }
        return count;
    }

    public getSlidePosition(editor:TextEditor){
            
            let start = new vscode.Position(0, 0);
            let end = editor.selection.active;
            let range = new vscode.Range(start, end);
            let text = editor.document.getText(range);
            let position = this.getSlideCount(text) - 1;

            let regex = new RegExp(this.config.slidifyOptions.separator, "gm");
            let slides = text.split(regex);
            let currentSlide = slides[slides.length-1];
            let innerSlide = this.getInnerSlideCount(currentSlide);
                
            return `#/${position}/${innerSlide}`;
    }

}