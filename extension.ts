import * as vscode from 'vscode';
import * as childProcess from 'child_process';

async function SpawnTargetProcess(argsConfig:string, target:string, rootPath:string, channel:vscode.OutputChannel) {
    let config = vscode.workspace.getConfiguration('cerberus');
    const currentDocument = vscode.window.activeTextEditor.document.uri.fsPath;
    
    let cl:string = config.get('transccDirPath');
    let cf:string = config.get(argsConfig);
    let args:string[] = cf.split(' ').concat(["-target=\""+target+"\"","\""+currentDocument+"\""]);
    displayOutput(cl+" "+args.join(" ")+"\n", channel);

    try {
        let sp = spawn(cl, args, { cwd: rootPath }, channel);
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

async function commandHtml5Target(rootPath, channel:vscode.OutputChannel) {
    SpawnTargetProcess('args.html5','Html5_Game',rootPath, channel);
    displayOutput('Done.\n', channel);
}

async function commandGlfwTarget(rootPath, channel:vscode.OutputChannel) {
    SpawnTargetProcess('args.glfw','Desktop_Game_(Glfw3)',rootPath, channel);
    displayOutput('Done.\n', channel);
}

async function commandAndroidTarget(rootPath, channel:vscode.OutputChannel) {
    SpawnTargetProcess('args.android','Android_Game',rootPath, channel);
    displayOutput('Done.\n', channel);
}

async function commandIosTarget(rootPath, channel:vscode.OutputChannel) {
    SpawnTargetProcess('args.ios','iOS_Game',rootPath, channel);
    displayOutput('Done.\n', channel);
}

async function commandCppTarget(rootPath, channel:vscode.OutputChannel) {
    SpawnTargetProcess('args.cpp','C++_Tool',rootPath, channel);
    displayOutput('Done.\n', channel);
}

function activate(context: vscode.ExtensionContext) {

    let channel = vscode.window.createOutputChannel('Cerberus Output');
    let rootPath = vscode.workspace.rootPath;

    let cerberusCommands = [
        vscode.commands.registerCommand('extension.buildHtml5', async () => {
            commandHtml5Target(rootPath, channel);
        }),
        vscode.commands.registerCommand('extension.buildGlfw', async () => {
            commandGlfwTarget(rootPath, channel);
        }),
        vscode.commands.registerCommand('extension.buildAndroid', async () => {
            commandAndroidTarget(rootPath, channel);
        }),
        vscode.commands.registerCommand('extension.buildIos', async () => {
            commandIosTarget(rootPath, channel);
        }),
        vscode.commands.registerCommand('extension.buildCpp', async () => {
            commandCppTarget(rootPath, channel);
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

function spawn(command: string, args:string[], options: childProcess.SpawnOptions, channel:vscode.OutputChannel): any {
    let sp = childProcess.spawn(command, args, options);
    sp.stdout.on('data', function (data) {
        displayOutput(data.toString(), channel);
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