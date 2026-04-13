import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null
let serverProcess: ChildProcess | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload 可选，如果不存在则省略
    },
  })

  let startUrl: string
  
  if (isDev) {
    // 开发环境：从 Vite 开发服务器加载
    startUrl = 'http://localhost:5173'
    console.log('[Electron] 开发环境，加载:', startUrl)
  } else {
    // 生产环境：从应用的 dist 目录加载
    const distPath = path.join(app.getAppPath(), 'dist', 'index.html')
    startUrl = `file://${distPath}`
    console.log('[Electron] 生产环境，加载:', startUrl)
    console.log('[Electron] dist 目录:', path.join(__dirname, '..', 'dist'))
  }

  console.log('[Electron] 加载 URL:', startUrl)
  mainWindow.loadURL(startUrl)

  // if (isDev) {
  //   mainWindow.webContents.openDevTools()
  // }

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 启动后端服务器
const startServer = () => {
  return new Promise<void>((resolve) => {
    try {
      // 两个环境都尝试运行 npm run server
      // 生产环境时，node_modules 已被包含在应用内
      console.log('[Electron] 启动后端服务器...')
      console.log('[Electron] NODE_ENV:', process.env.NODE_ENV || 'undefined')
      console.log('[Electron] __dirname:', __dirname)
      
      // 获取应用根目录（从 app.asar 中）
      const appDir = process.env.NODE_ENV === 'development' 
        ? __dirname.replace(/\/dist_electron$/, '')
        : path.join(__dirname, '..')
      
      console.log('[Electron] 应用目录:', appDir)
      
      // 检查 package.json 和 node_modules 是否存在
      const packageJsonPath = path.join(appDir, 'package.json')
      const nodeModulesPath = path.join(appDir, 'node_modules')
      console.log('[Electron] 检查 package.json:', packageJsonPath)
      console.log('[Electron] 检查 node_modules:', nodeModulesPath)
      
      const serverScript = isDev
        ? path.join(__dirname, '..', 'dist_electron', 'server.js')
        : path.join(__dirname, 'server.js')

      serverProcess = spawn(process.execPath, [serverScript], {
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_ENV: 'production',
        },
      })

      serverProcess.on('error', (err) => {
        console.error('[Electron] 服务器启动失败:', err.message)
      })

      serverProcess.on('exit', (code, signal) => {
        console.log('[Electron] 服务器退出，代码:', code, '信号:', signal)
      })

      // 给服务器足够的时间启动
      setTimeout(() => {
        console.log('[Electron] 开启主窗口...')
        resolve()
      }, 4000)
    } catch (err) {
      console.error('[Electron] 启动过程出错:', err)
      resolve()
    }
  })
}

app.on('ready', async () => {
  await startServer()
  createWindow()
})

app.on('window-all-closed', () => {
  // 关闭服务器进程
  if (serverProcess) {
    serverProcess.kill()
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC 处理器示例（如需要）
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})
