const vscode = require('vscode');
const fs = require('fs')
const path = require('path')

exports.myTreeProvider = class MyTreeProvider {
    constructor() {
        this.currentPanel = null
    }

    static initMyTreeList() {
        let myTreeProvider = new MyTreeProvider()
        vscode.window.registerTreeDataProvider('nba_id', myTreeProvider)

        // 创建treeItem点击事件, showCollapseAll是否显示右上角的折叠小图标
        const tree = vscode.window.createTreeView('nba_id', { treeDataProvider: myTreeProvider, showCollapseAll: false })

        tree.onDidChangeSelection(e => {
            console.log('click treeItem ', e);

            // 如何保证点击同一个按钮创建唯一的tab?

            const selection = e && e.selection && e.selection[0];

            const columnToShowIn = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.viewColumn
                : undefined;

            this.currentPanel = vscode.window.createWebviewPanel(
                selection.label[0],
                selection.label,
                columnToShowIn,
                {
                    // Enable javascript in the webview
                    enableScripts: true,

                    // Only allow the webview to access resources in our extension's media directory
                    // localResourceRoots: [this._extensionUri]
                    // And restrict the webview to only loading content from our extension's `media` directory.

                    // localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'src'))]
                }
            );
            this.currentPanel.webview.html = myTreeProvider.generateHtml()

            this.currentPanel.onDidDispose(() => {
                console.log('onDidDispose')
            })

            this.currentPanel.onDidChangeViewState(
                e => {

                    const panel = e.webviewPanel;

                    // panel.title = '我是标题'

                    myTreeProvider.sendMsgToHtml({
                        site: selection.label
                    }, this.currentPanel)
                }
            );

            myTreeProvider.sendMsgToHtml({
                site: selection.label
            }, this.currentPanel)


        })
    }

    generateHtml() {
        //ANCHOR  js文件在root目录的话，fs得访问绝对路径，否则找不到模板文件
        const templateHtml = fs.readFileSync(path.join(__dirname, '/src/test-webview.html'))
        let resHtml = templateHtml.toString()
        // console.log('generate html ', resHtml);
        return resHtml
    }

    sendMsgToHtml(msg, currentPanel) {
        console.log('send msg ', msg);
        currentPanel.webview.postMessage({
            command: 'updateMsg',
            msg
        });
    }

    getTreeItem(el) {
        console.log('get tree item', el);
        return el
    }

    getChildren() {
        console.log('get children ');
        let trees = []

        trees.push(new vscode.TreeItem('baidu'))
        trees.push(new vscode.TreeItem('alibaba'))
        trees.push(new vscode.TreeItem('tencent'))
        trees.push(new vscode.TreeItem('bytedance'))
        trees.push(new vscode.TreeItem('JD'))


        vscode.commands.executeCommand('extension.NBALiveScore.openWebview')

        return new Promise(resolve => {
            return resolve(trees)
        })
    }
}