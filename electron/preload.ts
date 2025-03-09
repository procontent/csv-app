// electron/preload.ts
const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;
import * as path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

contextBridge.exposeInMainWorld('api', {
  // File system utilities
  resolvePath: (relativePath: string) => {
    try {
      const basePath = fileURLToPath(import.meta.url);
      return path.resolve(path.dirname(basePath), relativePath);
    } catch (error) {
      console.error('Error resolving path:', error);
      throw error;
    }
  },

  // Directory operations
  getDirectoryContents: async (directoryPath: string) => {
    try {
      const fullPath = await ipcRenderer.invoke('get-directory-contents', directoryPath);
      return fullPath;
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  },

  // File operations
  readFile: async (filePath: string) => {
    try {
      const content = await ipcRenderer.invoke('read-file', filePath);
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  },

  // CSV parsing functionality
  parseCSV: (filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      return parse(content, {
        columns: true,
        skip_empty_lines: true
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw error;
    }
  }
});

export {};