import * as path from 'path'
import {
  Command,
  Event,
  ProviderResult,
  TextEditor,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState
} from 'vscode'
import { VSodeRevealContext } from './VSodeRevealContext'

export class SlideTreeProvider implements TreeDataProvider<SlideNode> {
  public onDidChangeTreeData?: Event<SlideNode>

  constructor(private context: VSodeRevealContext) {}

  public getTreeItem(element: SlideNode): TreeItem | Thenable<TreeItem> {
    return element
  }

  public getChildren(element?: SlideNode): ProviderResult<SlideNode[]> {
    return new Promise(resolve => {
      if (element) {
        resolve([new SlideNode('Child', TreeItemCollapsibleState.Collapsed)])
      } else {
        resolve([new SlideNode('Root', TreeItemCollapsibleState.Collapsed)])
      }
    })
  }
}

class SlideNode extends TreeItem {
  public contextValue = 'dependency'
  public iconPath = {
    light: path.join(__filename, '..', '..', '..', 'resources', 'slide-blue.png'),
    dark: path.join(__filename, '..', '..', '..', 'resources', 'slide-blue.png')
  }
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
  ) {
    super(label, collapsibleState)
  }
}
