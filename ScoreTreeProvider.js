const vscode = require('vscode');
const getMatches = require('./src/getNBAInfo').getMatches

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

        let matchesList = getMatches().filter(match => match.matchStatus !== 'PENDING')

        console.log('list ', matchesList.length);

        let trees = []

        for (let i = 0; i < matchesList.length; i++) {
            const el = matchesList[i];
            let temp = new vscode.TreeItem(el)
            trees.push(temp)
        }

        vscode.commands.executeCommand('extension.NBALiveScore.openWebview')

        return new Promise(resolve => {
            return resolve(trees)
        })
    }
}