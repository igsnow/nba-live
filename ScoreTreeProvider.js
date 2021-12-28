const vscode = require('vscode');
const getMatches = require('./src/getNBAInfo').getMatches

exports.myTreeProvider = class MyTreeProvider {
    constructor() {

    }

    static initMyTreeList() {
        let myTreeProvider = new MyTreeProvider()
        vscode.window.registerTreeDataProvider('nba_id', myTreeProvider)

        // 创建treeItem点击事件, showCollapseAll是否显示右上角的折叠小图标
        const tree = vscode.window.createTreeView('nba_id', { treeDataProvider: myTreeProvider, showCollapseAll: false })

        tree.onDidChangeSelection(e => console.log(e))
    }

    getTreeItem(el) {
        console.log('get tree item', el);
        return el
    }

    getChildren() {
        console.log('get children ');
        let trees = []

        // let matchesList = getMatches().filter(match => match.matchStatus !== 'PENDING')

        // console.log('list ', matchesList.length);

        // for (let i = 0; i < matchesList.length; i++) {
        //     const el = matchesList[i];
        //     let temp = new vscode.TreeItem(el)
        //     trees.push(temp)
        // }

        trees.push(new vscode.TreeItem('baidu'))
        trees.push(new vscode.TreeItem('taobao'))
        trees.push(new vscode.TreeItem('qq.com'))


        vscode.commands.executeCommand('extension.NBALiveScore.openWebview')

        return new Promise(resolve => {
            return resolve(trees)
        })
    }
}