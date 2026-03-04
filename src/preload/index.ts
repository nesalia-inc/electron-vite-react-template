import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Theme
  getSystemTheme: (): Promise<'dark' | 'light'> => ipcRenderer.invoke('get-system-theme'),
  onThemeChange: (callback: (theme: 'dark' | 'light') => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, theme: 'dark' | 'light'): void => {
      callback(theme)
    }
    ipcRenderer.on('theme-changed', handler)
    return () => {
      ipcRenderer.removeListener('theme-changed', handler)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
