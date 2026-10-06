/**
 * notepad.js — Classic Notepad text editor.
 *
 * Supports:
 *   - New, Open, Save, Save As (saved into virtual filesystem)
 *   - Export to actual computer (.txt file download)
 *   - Time/Date stamp (F5), Word wrap
 *   - Dirty state tracking and clean Windows 98/2000 styling
 */

import { Icons } from '../icons.js';
import { FileSystem } from '../filesystem.js';
import { WindowManager } from '../windowManager.js';

export const NotepadApp = {

    /**
     * Open Notepad, optionally loading a file from the virtual filesystem.
     * @param {string} [filePath] e.g. "C:/My Documents/readme.txt"
     */
    async open(filePath = null) {
        const id = `notepad-${Date.now()}`;
        const defaultTitle = filePath ? `${FileSystem.getFileName(filePath)} - Notepad` : 'Untitled - Notepad';

        const win = WindowManager.createWindow({
            id,
            title: defaultTitle,
            icon: Icons.notepad,
            width: 560,
            height: 400,
            content: `
                <div class="notepad-container" id="${id}-container" style="display:flex;flex-direction:column;height:100%;">
                    <div class="app-menubar">
                        <span class="app-menu-item menu-new-btn">New</span>
                        <span class="app-menu-item menu-open-btn">Open...</span>
                        <span class="app-menu-item menu-save-btn">Save</span>
                        <span class="app-menu-item menu-saveas-btn">Save As...</span>
                        <span class="app-menu-item menu-export-btn">Export TXT</span>
                        <span class="app-menu-item menu-timedate-btn">Time/Date (F5)</span>
                    </div>
                    <textarea class="notepad-textarea" spellcheck="false" style="flex:1;resize:none;border:none;outline:none;padding:8px 10px;font-family:'Courier New', Lucida Console, monospace;font-size:14px;line-height:1.45;background:#fff;color:#000;white-space:pre-wrap;overflow:auto;"></textarea>
                </div>
            `
        });

        this.initNotepadLogic(win, id, filePath);
        return win;
    },

    initNotepadLogic(win, id, initialFilePath) {
        const container = win.querySelector(`#${id}-container`);
        if (!container) return;

        const textarea = container.querySelector('.notepad-textarea');
        const titleText = win.querySelector('.window-titlebar-text');
        const statusText = win.querySelector('.window-statusbar-text');

        let currentPath = initialFilePath;
        let isDirty = false;

        const updateTitle = () => {
            const fileName = currentPath ? FileSystem.getFileName(currentPath) : 'Untitled';
            titleText.textContent = `${isDirty ? '*' : ''}${fileName} - Notepad`;
        };

        const updateStatus = () => {
            if (!statusText) return;
            const text = textarea.value;
            const pos = textarea.selectionStart || 0;
            const lines = text.substring(0, pos).split('\n');
            const line = lines.length;
            const col = lines[lines.length - 1].length + 1;
            statusText.textContent = `Ln ${line}, Col ${col}  |  ${currentPath || 'Untitled'}`;
        };

        // Load initial file if provided
        if (initialFilePath) {
            FileSystem.readFile(initialFilePath)
                .then(content => {
                    textarea.value = (typeof content === 'string') ? content : '';
                    isDirty = false;
                    updateTitle();
                    updateStatus();
                })
                .catch(err => {
                    WindowManager.showDialog({
                        title: 'Error',
                        message: `Could not open file: ${err.message}`,
                        icon: '⚠️'
                    });
                });
        } else {
            updateStatus();
        }

        // Tracking text edits
        textarea.addEventListener('input', () => {
            if (!isDirty) {
                isDirty = true;
                updateTitle();
            }
            updateStatus();
        });

        textarea.addEventListener('click', updateStatus);
        textarea.addEventListener('keyup', updateStatus);

        const resetEditor = () => {
            textarea.value = '';
            currentPath = null;
            isDirty = false;
            updateTitle();
            updateStatus();
        };

        const doNew = () => {
            if (isDirty) {
                WindowManager.showDialog({
                    title: 'Notepad',
                    message: 'Save changes to current document?',
                    icon: '❓',
                    buttons: [
                        { label: 'Save', value: 'save' },
                        { label: 'Don\'t Save', value: 'discard' },
                        { label: 'Cancel', value: 'cancel' }
                    ],
                    onButton: async (val) => {
                        if (val === 'save') {
                            const saved = await doSave();
                            if (saved) resetEditor();
                        } else if (val === 'discard') {
                            resetEditor();
                        }
                    }
                });
            } else {
                resetEditor();
            }
        };

        const doSave = async () => {
            if (!currentPath) {
                return doSaveAs();
            }
            try {
                await FileSystem.updateFile(currentPath, textarea.value);
                isDirty = false;
                updateTitle();
                if (statusText) statusText.textContent = `Saved to ${currentPath}`;
                return true;
            } catch (err) {
                WindowManager.showDialog({
                    title: 'Save Error',
                    message: `Could not save file: ${err.message}`,
                    icon: '⚠️'
                });
                return false;
            }
        };

        const doSaveAs = () => {
            const defaultName = currentPath ? FileSystem.getFileName(currentPath) : 'Document.txt';
            WindowManager.showPrompt({
                title: 'Save As',
                message: 'Enter file name for My Documents:',
                defaultValue: defaultName,
                icon: '💾',
                onOk: async (fileName) => {
                    if (!fileName) return;
                    const safeName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
                    const targetPath = `C:/My Documents/${safeName}`;

                    try {
                        if (await FileSystem.exists(targetPath)) {
                            await FileSystem.updateFile(targetPath, textarea.value);
                        } else {
                            await FileSystem.createFile('C:/My Documents', safeName, textarea.value);
                        }
                        currentPath = targetPath;
                        isDirty = false;
                        updateTitle();
                        if (statusText) statusText.textContent = `Saved as ${targetPath}`;
                    } catch (err) {
                        WindowManager.showDialog({
                            title: 'Save As Error',
                            message: `Could not save: ${err.message}`,
                            icon: '⚠️'
                        });
                    }
                }
            });
        };

        const doOpen = async () => {
            try {
                const files = await FileSystem.listDirectory('C:/My Documents');
                const textFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.txt'));

                if (textFiles.length === 0) {
                    WindowManager.showDialog({
                        title: 'Open File',
                        message: 'No text documents found in C:/My Documents.',
                        icon: 'ℹ️'
                    });
                    return;
                }

                const optionsList = textFiles.map((f, i) => `${i + 1}. ${f.name}`).join('\n');
                WindowManager.showPrompt({
                    title: 'Open Document',
                    message: `Select file from C:/My Documents:\n\n${optionsList}\n\nEnter name or number:`,
                    defaultValue: textFiles[0].name,
                    icon: '📂',
                    onOk: async (choice) => {
                        if (!choice) return;
                        let selectedFile = null;
                        const num = parseInt(choice, 10);
                        if (!isNaN(num) && num >= 1 && num <= textFiles.length) {
                            selectedFile = textFiles[num - 1];
                        } else {
                            selectedFile = textFiles.find(f => f.name.toLowerCase() === choice.toLowerCase().trim());
                        }

                        if (!selectedFile) {
                            WindowManager.showDialog({ title: 'Open Error', message: 'File not found in My Documents.', icon: '⚠️' });
                            return;
                        }

                        const content = await FileSystem.readFile(selectedFile.path);
                        textarea.value = (typeof content === 'string') ? content : '';
                        currentPath = selectedFile.path;
                        isDirty = false;
                        updateTitle();
                        updateStatus();
                    }
                });
            } catch (err) {
                WindowManager.showDialog({
                    title: 'Open Error',
                    message: `Could not open file: ${err.message}`,
                    icon: '⚠️'
                });
            }
        };

        const doExport = () => {
            const fileName = currentPath ? FileSystem.getFileName(currentPath) : 'Document.txt';
            const blob = new Blob([textarea.value], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (statusText) statusText.textContent = `Exported ${fileName} to computer`;
        };

        const insertTimeDate = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + timeStr + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + timeStr.length;
            isDirty = true;
            updateTitle();
            updateStatus();
        };

        // Menubar buttons
        container.querySelector('.menu-new-btn').addEventListener('click', doNew);
        container.querySelector('.menu-open-btn').addEventListener('click', doOpen);
        container.querySelector('.menu-save-btn').addEventListener('click', doSave);
        container.querySelector('.menu-saveas-btn').addEventListener('click', doSaveAs);
        container.querySelector('.menu-export-btn').addEventListener('click', doExport);
        container.querySelector('.menu-timedate-btn').addEventListener('click', insertTimeDate);

        // Keyboard Shortcuts inside Notepad
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                insertTimeDate();
            } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                doSave();
            } else if (e.ctrlKey && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                doOpen();
            } else if (e.ctrlKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                doNew();
            }
        });
    }
};

window.NotepadApp = NotepadApp;
