import * as path from 'path'
import * as vscode from 'vscode'
import { GO_TO_SLIDE } from './Commands'
import { ISlide } from './Models'
import { VSCodeRevealContext } from './VSCodeRevealContext'
import { VSCodeRevealContexts } from './VSCodeRevealContexts'

export class SlideTreeProvider implements vscode.TreeDataProvider<SlideNode> {
  // tslint:disable-next-line:variable-name
  private _onDidChangeTreeData: vscode.EventEmitter<SlideNode | null> = new vscode.EventEmitter<SlideNode | null>()
  // tslint:disable-next-line:member-ordering
  public readonly onDidChangeTreeData: vscode.Event<SlideNode | null> = this._onDidChangeTreeData.event

  constructor(private getContext: (() => VSCodeRevealContext)) {}

  public update() {
    // Optimize on slide change only !!
    this._onDidChangeTreeData.fire()
  }

  public register() {
    return vscode.window.registerTreeDataProvider('slidesExplorer', this)
  }

  public getTreeItem(element: SlideNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  public getChildren(element?: SlideNode): vscode.ProviderResult<SlideNode[]> {
    const currentContext = this.getContext()
    return new Promise(resolve => {
      if (element) {
        resolve(this.mapSlides(element.slide.verticalChildren, true, element.slide.index))
      } else {
        resolve(this.mapSlides(currentContext.slides))
      }
    })
  }

  private mapSlides(slides: ISlide[], isVertical: boolean = false, parentIndex?: number) {
    return slides.map(
      (s, i) =>
        new SlideNode(
          s,
          isVertical,
          `${s.index} : ${s.title}`,
          s.verticalChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
          {
            command: GO_TO_SLIDE,
            arguments: isVertical ? [parentIndex, s.index] : [s.index, 0],
            title: 'Go to slide'
          }
        )
    )
  }
}

class SlideNode extends vscode.TreeItem {
  get iconName() {
    return this.isVertical ? 'slide-orange.svg' : 'slide-blue.svg'
  }

  public iconPath = {
    light: path.join(__filename, '..', '..', '..', 'resources', this.iconName),
    dark: path.join(__filename, '..', '..', '..', 'resources', this.iconName)
  }
  constructor(
    public readonly slide: ISlide,
    public readonly isVertical: boolean,
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState)
  }
}
