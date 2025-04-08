const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const { I18n } = require('i18n')

const i18n = new I18n()

i18n.configure({
    locales: ['kz', 'ru', 'en'],
    defaultLocale: 'ru',
    directory: path.join(__dirname, '/locales'),
    objectNotation: true
})

console.log('[Preload] Loaded preload.js');
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    t: (key) => i18n.__(key),
    setLocale: (locale) => i18n.setLocale(locale)
});
