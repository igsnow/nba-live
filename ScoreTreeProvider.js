const vscode = require('vscode');

exports.myTreeProvider = class MyTreeProvider {
    constructor() {

    }

    static initMyTreeList() {
        let myTreeProvider = new MyTreeProvider()
        vscode.window.registerTreeDataProvider('nba_id', myTreeProvider)
    }

    getTreeItem(el) {
        console.log('get tree item', el);
        return el
    }

    getChildren() {
        console.log('get children ');
        let trees = []
        let temp1 = new vscode.TreeItem('james')
        let temp2 = new vscode.TreeItem('kobe')
        let temp3 = new vscode.TreeItem('jordan')

        trees.push(temp1)
        trees.push(temp2)
        trees.push(temp3)

        vscode.commands.executeCommand('extension.NBALiveScore.openWebview')

        return new Promise(resolve => {
            return resolve(trees)
        })
    }
}