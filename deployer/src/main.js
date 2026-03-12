const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let projectPath;

function getProjectPath() {
  return path.join(app.getPath('userData'), 'openclaw-zero-token');
}

async function copyProject() {
  const resourcePath = process.resourcesPath
    ? path.join(process.resourcesPath, 'openclaw-project')
    : path.resolve(__dirname, '../..');

  projectPath = getProjectPath();

  if (fs.existsSync(projectPath)) {
    return;
  }

  mainWindow.webContents.send('init-status', '正在初始化项目...');

  await fs.promises.cp(resourcePath, projectPath, { recursive: true });

  mainWindow.webContents.send('init-status', '项目初始化完成');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-finish-load', async () => {
    await copyProject();
    mainWindow.webContents.send('project-ready', projectPath);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function execCommand(command, silent = false) {
  return new Promise((resolve) => {
    let modifiedCommand = command;

    if (app.isPackaged) {
      modifiedCommand = modifiedCommand.replace(/^node\s+/, `"${process.execPath}" `);
      const npmPath = path.join(path.dirname(process.execPath), '../Resources/app.asar.unpacked/node_modules/npm/bin/npm-cli.js');
      modifiedCommand = modifiedCommand.replace(/\bnpm\b/g, `"${process.execPath}" "${npmPath}"`);
    }

    const proc = spawn(modifiedCommand, {
      shell: true,
      cwd: projectPath || getProjectPath(),
      env: {
        ...process.env,
        NPM_CONFIG_LOGLEVEL: 'info',
        NPM_CONFIG_PROGRESS: 'false',
        CI: 'true'
      }
    });

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
      if (!silent && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('command-output', data.toString());
      }
    });

    proc.stderr.on('data', (data) => {
      output += data.toString();
      if (!silent && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('command-output', data.toString());
      }
    });

    proc.on('close', (code) => {
      resolve({ code, output });
    });
  });
}

ipcMain.handle('exec-command', async (event, command) => {
  return execCommand(command, false);
});

ipcMain.handle('exec-command-silent', async (event, command) => {
  return execCommand(command, true);
});

ipcMain.handle('exec-command-background', async (event, command) => {
  execCommand(command, false);
  return { success: true };
});

ipcMain.handle('get-project-path', () => {
  return projectPath || getProjectPath();
});

ipcMain.handle('open-platform', async (event, platform) => {
  return new Promise((resolve) => {
    const loginWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        partition: `persist:${platform.id}`
      }
    });

    let capturedBearer = '';
    const filter = {
      urls: ['https://chat.deepseek.com/api/v0/*', 'https://www.doubao.com/api/*', 'https://kimi.moonshot.cn/api/*']
    };

    loginWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      const auth = details.requestHeaders['Authorization'] || details.requestHeaders['authorization'];
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.substring(7);
        if (token && token.length > 20) {
          capturedBearer = token;
        }
      }
      callback({ requestHeaders: details.requestHeaders });
    });

    loginWindow.loadURL(platform.url);

    loginWindow.webContents.on('did-finish-load', () => {
      event.sender.send('command-output', `\n✓ 已打开 ${platform.name} 登录页面\n请在浏览器中完成登录，登录后关闭窗口继续...\n`);
    });

    loginWindow.on('close', async () => {
      try {
        // Fallback for getting token if header interception missed it
        if (!capturedBearer) {
          try {
            if (platform.id === 'deepseek') {
              const token = await loginWindow.webContents.executeJavaScript(`
                (function() {
                  const items = {...localStorage};
                  return items['userToken'] || '';
                })()
              `);
              if (token && token.length > 30) {
                capturedBearer = token;
                console.log('Captured DeepSeek token via localStorage fallback');
              }
            } else if (platform.id === 'kimi') {
              const token = await loginWindow.webContents.executeJavaScript('localStorage.getItem("refresh_token")');
              if (token && token.length > 20) capturedBearer = token;
            }
          } catch (e) {
            console.error('JS injection failed:', e);
          }
        }

        const cookies = await loginWindow.webContents.session.cookies.get({});
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        if (!event.sender.isDestroyed()) {
          event.sender.send('command-output', `\n✓ 已获取 ${cookies.length} 个 cookie\n`);
          if (capturedBearer) {
            event.sender.send('command-output', `✓ 已捕获认证令牌 (Bearer Token)\n`);
          }
        }
        resolve({ success: true, cookies: cookieString, bearer: capturedBearer });
      } catch (err) {
        if (!event.sender.isDestroyed()) {
          event.sender.send('command-output', `\n错误: ${err.message}\n`);
        }
        resolve({ success: false });
      }
    });
  });
});

ipcMain.handle('load-in-app', async (event, url) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(url);
  }
  return { success: true };
});

ipcMain.handle('clear-config', async () => {
  try {
    const os = require('os');
    const homedir = os.homedir();
    const stateDir = path.join(homedir, '.openclaw-zero');

    // 删除认证文件
    const authFiles = [
      path.join(stateDir, 'agents/main/agent/auth-profiles.json'),
      path.join(stateDir, 'agents/main/agent/auth.json'),
      path.join(stateDir, 'identity/device-auth.json')
    ];

    for (const file of authFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
