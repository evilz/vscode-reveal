import * as path from 'path'
import * as vscode from 'vscode'
import { EventEmitter } from 'vscode'
import { GO_TO_SLIDE } from './commands/goToSlide'
import { Disposable } from './dispose'
import { ISlide } from './ISlide'

export class SlideTreeProvider extends Disposable
  implements vscode.TreeDataProvider<SlideNode>
{
  private readonly _onDidChangeTreeData: vscode.EventEmitter<SlideNode | null> = new vscode.EventEmitter<SlideNode | null>()

  public readonly onDidChangeTreeData: vscode.Event<SlideNode | null> = this._onDidChangeTreeData.event

  constructor(private readonly getSlide: () => ISlide[]) {
   super()
  }

  readonly #onDidError = this._register(new EventEmitter<Error>());
	/**
	 * Fired when the Slide Tree Provider got an error.
	 */
	public readonly onDidError = this.#onDidError.event;

  readonly #onDidUpdate = this._register(new EventEmitter<void>());
	/**
	 * Fired when the Slide Tree Provider did update.
	 */
	public readonly onDidUpdate = this.#onDidUpdate.event;

  public update() {
    this._onDidChangeTreeData.fire(null)
    this.#onDidUpdate.fire()
  }

  public register() {
    return this._register(
      vscode.window.registerTreeDataProvider('slidesExplorer', this)
    )
  }

  public getTreeItem(element: SlideNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  public getChildren(element?: SlideNode): vscode.ProviderResult<SlideNode[]> {
    const slides = this.getSlide()
    return new Promise(resolve => {
      if (element && element.slide.verticalChildren) {
        resolve(this.mapSlides(element.slide.verticalChildren, element.slide.index))
      } else {
        resolve(this.mapSlides(slides))
      }
    })
  }

  private mapSlides(slides: ISlide[], parentIndex?: number) {
    return slides.map(
      (s) =>
        new SlideNode(
          s,
          parentIndex !== undefined,
          `${s.index} : ${s.title}`,
          s.verticalChildren.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
          {
            arguments: [parentIndex === undefined ? { horizontal: s.index, vertical: 0 } : { horizontal: parentIndex, vertical: s.index }],
            command: GO_TO_SLIDE,
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
    dark: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', this.iconName)),
    light: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', this.iconName))
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
