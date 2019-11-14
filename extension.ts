import * as vscode from 'vscode';
import * as childProcess from 'child_process';

async function SpawnTargetProcess(argsConfig:string, target:string, rootPath:string, channel:vscode.OutputChannel, collection:vscode.DiagnosticCollection) {
    let config = vscode.workspace.getConfiguration('cerberus');
    const currentDocument = vscode.window.activeTextEditor.document.uri.fsPath;
    
    let cl:string = config.get('transccDirPath');
    let cf:string = config.get(argsConfig);
    let args:string[] = cf.split(' ')
    if (target !== '') {
        args = args.concat(["-target=\""+target+"\"","\""+currentDocument+"\""]);
    } else {
        args = args.concat(["\""+currentDocument+"\""])
    }
    displayOutput(cl+" "+args.join(" ")+"\n", channel);

    try {
        let sp = spawn(cl, args, { cwd: rootPath }, channel, collection);
    }
    catch(err)
    {
        displayOutput("Spawn error.", channel);
        if (err.stderr && err.stderr.length > 0) {
            displayOutput(err.stderr, channel);
        }
        displayOutput(err.stdout, channel);
    }
}

async function commandTarget(type:string, rootPath, channel:vscode.OutputChannel, collection:vscode.DiagnosticCollection) {
    collection.clear();

    if (type === 'html5') SpawnTargetProcess('args.html5','Html5_Game',rootPath, channel, collection);
    if (type === 'glfw') SpawnTargetProcess('args.glfw','Desktop_Game_(Glfw3)',rootPath, channel, collection);
    if (type === 'android') SpawnTargetProcess('args.android','Android_Game',rootPath, channel, collection);
    if (type === 'ios') SpawnTargetProcess('args.ios','iOS_Game',rootPath, channel, collection);
    if (type === 'cpp') SpawnTargetProcess('args.cpp','C++_Tool',rootPath, channel, collection);
    if (type === 'custom') SpawnTargetProcess('args.custom','',rootPath, channel, collection);

    displayOutput('Done.\n', channel);
}

function activate(context: vscode.ExtensionContext) {

    let channel = vscode.window.createOutputChannel('Cerberus Output');
    let rootPath = vscode.workspace.rootPath;
    const collection = vscode.languages.createDiagnosticCollection('test');

    let cerberusCommands = [
        vscode.commands.registerCommand('extension.buildHtml5', async () => {
            commandTarget('html5', rootPath, channel, collection);
        }),
        vscode.commands.registerCommand('extension.buildGlfw', async () => {
            commandTarget('glfw', rootPath, channel, collection);
        }),
        vscode.commands.registerCommand('extension.buildAndroid', async () => {
            commandTarget('android', rootPath, channel, collection);
        }),
        vscode.commands.registerCommand('extension.buildIos', async () => {
            commandTarget('ios', rootPath, channel, collection);
        }),
        vscode.commands.registerCommand('extension.buildCpp', async () => {
            commandTarget('cpp', rootPath, channel, collection);
        }),
        vscode.commands.registerCommand('extension.buildCustom', async () => {
            commandTarget('custom', rootPath, channel, collection);
        })
    ]

    context.subscriptions.push(...cerberusCommands);
}

function deactivate() {

}

function displayOutput(s:string, channel:vscode.OutputChannel):void
{
    channel.append(s);
    channel.show(true);
}

function exec(command: string, options: childProcess.ExecOptions): Promise<{ stdout: string; stderr: string }> {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		childProcess.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stdout, stderr });
			}
			resolve({ stdout, stderr });
		});
	});
}

function spawn(command: string, args:string[], options: childProcess.SpawnOptions, channel:vscode.OutputChannel, collection:vscode.DiagnosticCollection): any {
    let sp = childProcess.spawn(command, args, options);
    sp.stdout.on('data', function (data) {
        let ds = data.toString(),
            dsh;
        if (ds.indexOf('Error') > -1) {
            let lineNum = parseInt(ds.substring(ds.indexOf('<')+1, ds.indexOf('>')))-1,
                docUri = vscode.Uri.file(ds.substring(0, ds.indexOf('<'))),
                docRange = new vscode.Range(new vscode.Position(lineNum, 0), new vscode.Position(lineNum, 99));
            collection.set(
                docUri,
                [
                    {
                        code: '',
                        message: ds,
                        range: docRange,
                        severity: vscode.DiagnosticSeverity.Error,
                        source: 'cerberus'
                    }
                ]
            )
        }
        displayOutput(ds, channel);
    });
    
    sp.stderr.on('data', function (data) {
        displayOutput(data.toString(), channel);
    });
    
    sp.on('exit', function (code) {
    });

    return sp;
}

export {
    activate,
    deactivate
}