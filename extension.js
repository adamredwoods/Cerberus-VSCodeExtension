"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var vscode = require("vscode");
var childProcess = require("child_process");
function SpawnTargetProcess(argsConfig, target, rootPath, channel, collection) {
    return __awaiter(this, void 0, void 0, function () {
        var config, currentDocument, cl, cf, args, sp;
        return __generator(this, function (_a) {
            config = vscode.workspace.getConfiguration('cerberus');
            currentDocument = vscode.window.activeTextEditor.document.uri.fsPath;
            cl = config.get('transccDirPath');
            cf = config.get(argsConfig);
            args = cf.split(' ');
            if (target !== '') {
                args = args.concat(["-target=\"" + target + "\"", "\"" + currentDocument + "\""]);
            }
            else {
                args = args.concat(["\"" + currentDocument + "\""]);
            }
            displayOutput(cl + " " + args.join(" ") + "\n", channel);
            try {
                sp = spawn(cl, args, { cwd: rootPath }, channel, collection);
            }
            catch (err) {
                displayOutput("Spawn error.", channel);
                if (err.stderr && err.stderr.length > 0) {
                    displayOutput(err.stderr, channel);
                }
                displayOutput(err.stdout, channel);
            }
            return [2 /*return*/];
        });
    });
}
function commandTarget(type, rootPath, channel, collection) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            collection.clear();
            if (type === 'html5')
                SpawnTargetProcess('args.html5', 'Html5_Game', rootPath, channel, collection);
            if (type === 'glfw')
                SpawnTargetProcess('args.glfw', 'Desktop_Game_(Glfw3)', rootPath, channel, collection);
            if (type === 'android')
                SpawnTargetProcess('args.android', 'Android_Game', rootPath, channel, collection);
            if (type === 'ios')
                SpawnTargetProcess('args.ios', 'iOS_Game', rootPath, channel, collection);
            if (type === 'cpp')
                SpawnTargetProcess('args.cpp', 'C++_Tool', rootPath, channel, collection);
            if (type === 'custom')
                SpawnTargetProcess('args.custom', '', rootPath, channel, collection);
            displayOutput('Done.\n', channel);
            return [2 /*return*/];
        });
    });
}
function activate(context) {
    var _this = this;
    var _a;
    var channel = vscode.window.createOutputChannel('Cerberus Output');
    var rootPath = vscode.workspace.rootPath;
    var collection = vscode.languages.createDiagnosticCollection('test');
    var cerberusCommands = [
        vscode.commands.registerCommand('extension.buildHtml5', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('html5', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); }),
        vscode.commands.registerCommand('extension.buildGlfw', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('glfw', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); }),
        vscode.commands.registerCommand('extension.buildAndroid', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('android', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); }),
        vscode.commands.registerCommand('extension.buildIos', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('ios', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); }),
        vscode.commands.registerCommand('extension.buildCpp', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('cpp', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); }),
        vscode.commands.registerCommand('extension.buildCustom', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                commandTarget('custom', rootPath, channel, collection);
                return [2 /*return*/];
            });
        }); })
    ];
    (_a = context.subscriptions).push.apply(_a, cerberusCommands);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function displayOutput(s, channel) {
    channel.append(s);
    channel.show(true);
}
function exec(command, options) {
    return new Promise(function (resolve, reject) {
        childProcess.exec(command, options, function (error, stdout, stderr) {
            if (error) {
                reject({ error: error, stdout: stdout, stderr: stderr });
            }
            resolve({ stdout: stdout, stderr: stderr });
        });
    });
}
function spawn(command, args, options, channel, collection) {
    var sp = childProcess.spawn(command, args, options);
    sp.stdout.on('data', function (data) {
        var ds = data.toString(), dsh;
        if (ds.indexOf('Error') > -1) {
            var lineNum = parseInt(ds.substring(ds.indexOf('<') + 1, ds.indexOf('>'))) - 1, docUri = vscode.Uri.file(ds.substring(0, ds.indexOf('<'))), docRange = new vscode.Range(new vscode.Position(lineNum, 0), new vscode.Position(lineNum, 99));
            collection.set(docUri, [
                {
                    code: '',
                    message: ds,
                    range: docRange,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: 'cerebus'
                }
            ]);
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
