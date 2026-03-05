import { app, shell, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import log from 'electron-log/main.js'

// Initialize logging
log.initialize()
log.transports.file.level = 'info'
log.transports.console.level = 'debug'

// Log app start
log.info('Application starting...')
log.info(`Electron version: ${process.versions.electron}`)
log.info(`Chrome version: ${process.versions.chrome}`)
log.info(`Node version: ${process.versions.node}`)

function createWindow(): void {
  log.info('Creating main window...')

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    log.info('Window ready to show')
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the app
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    log.info(`Loading dev URL: ${process.env['ELECTRON_RENDERER_URL']}`)
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    log.info('Loading production build')
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Listen for system theme changes
nativeTheme.on('updated', () => {
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  log.info(`System theme changed to: ${theme}`)
  // Broadcast to all windows
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('theme-changed', theme)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error)
  app.quit()
})

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason)
})

// App lifecycle
app.whenReady().then(() => {
  log.info('App ready')

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.nesalia.electron-vite-react-template')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app
    // when the dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  log.info('All windows closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for theme
ipcMain.handle('get-system-theme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
})
