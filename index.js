// Minimal front-end logic for the Encrypt project.
// Provides simple base64-based encrypt/decrypt, clipboard copy, mode switching, and toast.

const $ = (id) => document.getElementById(id);

const inputText = $('input-text');
const outputText = $('output-text');
const actionBtn = $('action-btn');
const copyBtn = $('copy-btn');
const modeEncrypt = $('mode-encrypt');
const modeDecrypt = $('mode-decrypt');
const toast = $('toast');
const toastMessage = $('toast-message');
const appTitle = $('app-title');

let mode = 'encrypt';

function showToast(message, ms = 1800) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), ms);
}

function enableCopy(enabled) {
  if (enabled) {
    copyBtn.disabled = false;
    copyBtn.classList.add('enabled');
    copyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    copyBtn.disabled = true;
    copyBtn.classList.remove('enabled');
    copyBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

function toBase64(str) {
  // Properly handle UTF-8
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

function doAction() {
  const text = inputText.value || '';
  if (!text.trim()) {
    showToast('Please enter some text');
    return;
  }

  try {
    if (mode === 'encrypt') {
      const res = toBase64(text);
      outputText.textContent = res;
      enableCopy(true);
      showToast('Encrypted');
    } else {
      // decrypt
      const res = fromBase64(text.trim());
      outputText.textContent = res;
      enableCopy(true);
      showToast('Decrypted');
    }
  } catch (err) {
    outputText.textContent = '';
    enableCopy(false);
    showToast('Error: invalid input for this operation');
    console.error(err);
  }
}

function copyOutput() {
  const text = outputText.textContent || '';
  if (!text) return showToast('Nothing to copy');
  navigator.clipboard?.writeText(text).then(() => showToast('Copied'))
    .catch(() => showToast('Copy failed'));
}

function setMode(m) {
  mode = m;
  // mark active mode button for persistent styling
  modeEncrypt.classList.toggle('active', mode === 'encrypt');
  modeDecrypt.classList.toggle('active', mode === 'decrypt');
  if (mode === 'encrypt') {
    actionBtn.textContent = 'Encrypt';
    modeEncrypt.classList.add('text-white', 'shadow-lg');
    modeEncrypt.classList.remove('text-gray-400', 'bg-white', 'shadow-sm');
    modeDecrypt.classList.add('text-gray-400', 'bg-white', 'shadow-sm');
    modeDecrypt.classList.remove('text-white', 'shadow-lg');
    inputText.placeholder = 'Type text to encrypt...';
    appTitle.textContent = 'Encryption';
  } else {
    actionBtn.textContent = 'Decrypt';
    modeDecrypt.classList.add('text-white', 'shadow-lg');
    modeDecrypt.classList.remove('text-gray-400', 'bg-white', 'shadow-sm');
    modeEncrypt.classList.add('text-gray-400', 'bg-white', 'shadow-sm');
    modeEncrypt.classList.remove('text-white', 'shadow-lg');
    inputText.placeholder = 'Paste base64 text to decrypt...';
    appTitle.textContent = 'Decryption';
  }
  // Clear output and disable copy when switching
  outputText.textContent = 'Results will appear here...';
  enableCopy(false);
}

// Wire up events
actionBtn.addEventListener('click', doAction);
copyBtn.addEventListener('click', copyOutput);
modeEncrypt.addEventListener('click', () => setMode('encrypt'));
modeDecrypt.addEventListener('click', () => setMode('decrypt'));

// Initial state
enableCopy(false);
setMode('encrypt');
