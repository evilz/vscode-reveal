// tslint:disable-next-line:no-implicit-dependencies
import { should } from 'chai'
// tslint:disable-next-line:no-implicit-dependencies
import * as vscode from 'vscode'
import { VSCodeRevealContext } from '../src/VSCodeRevealContext'

should()
suite('VSCodeReveqlContext Tests', () => {
  test('Shoud count simple slides', () => {
    const context = new VSCodeRevealContext(({
      document: { fileName: 'c\\test.md' }
    } as any) as vscode.TextEditor)
    context.title.should.be.contain('test.md')
    //         let configuration = new Configuration();
    //         let helpers = new Helpers(configuration);

    //         let count = helpers.getSlideCount(content);
    //         count.should.be.equal(2);
  })
})
