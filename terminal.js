/**
 * NIKHIL // DIGITAL LAB v3 — INTERACTIVE TERMINAL OS
 * Full-featured interactive terminal drawer with command history, autocomplete,
 * typewriter output, quick command buttons, and matrix effects.
 */

import { RESUME_DATA } from './data.js';
import { sound } from './audio.js';

export class TerminalOS {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.options = options;
    this.history = [];
    this.historyIndex = -1;
    this.isOpen = false;
    this.isTyping = false;
    this.matrixActive = false;

    this.commands = RESUME_DATA.terminal.commands;
    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="terminal-backdrop" id="termBackdrop"></div>
      <div class="terminal-window" id="termWindow" role="dialog" aria-label="Terminal Shell">
        <div class="terminal-header">
          <div class="terminal-controls">
            <span class="ctrl-dot close-dot" id="termCloseBtn" title="Close Terminal (Esc)"></span>
            <span class="ctrl-dot min-dot"></span>
            <span class="ctrl-dot max-dot"></span>
          </div>
          <div class="terminal-title">NIKHIL_OS // TERMINAL SHELL [v3.4.0-PROD]</div>
          <div class="terminal-badges">
            <span class="badge-status">TTY_01: ONLINE</span>
          </div>
        </div>

        <div class="terminal-quick-bar">
          <span class="quick-label">QUICK EXEC:</span>
          <button class="quick-cmd" data-cmd="whoami">whoami</button>
          <button class="quick-cmd" data-cmd="skills">skills</button>
          <button class="quick-cmd" data-cmd="projects">projects</button>
          <button class="quick-cmd" data-cmd="experience">experience</button>
          <button class="quick-cmd" data-cmd="education">education</button>
          <button class="quick-cmd" data-cmd="certifications">certifications</button>
          <button class="quick-cmd" data-cmd="contact">contact</button>
          <button class="quick-cmd" data-cmd="help">help</button>
        </div>

        <div class="terminal-body" id="termBody">
          <pre class="terminal-welcome">${RESUME_DATA.terminal.systemInfo}</pre>
          <div class="terminal-history" id="termHistory"></div>
          <div class="terminal-input-line">
            <span class="prompt-user">nikhil@digital-lab:~$</span>
            <input type="text" id="termInput" autocomplete="off" spellcheck="false" aria-label="Terminal command prompt" autofocus />
          </div>
        </div>
      </div>
      <canvas id="matrixCanvas" class="matrix-canvas"></canvas>
    `;

    this.input = this.container.querySelector('#termInput');
    this.historyContainer = this.container.querySelector('#termHistory');
    this.body = this.container.querySelector('#termBody');
    this.closeBtn = this.container.querySelector('#termCloseBtn');
    this.backdrop = this.container.querySelector('#termBackdrop');
    this.matrixCanvas = this.container.querySelector('#matrixCanvas');

    this.bindEvents();
  }

  bindEvents() {
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.closeBtn.addEventListener('click', () => this.toggle(false));
    this.backdrop.addEventListener('click', () => this.toggle(false));

    // Quick Command Buttons
    this.container.querySelectorAll('.quick-cmd').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = e.target.dataset.cmd;
        this.executeCommand(cmd);
      });
    });

    // Global Key Toggle (`~` or `Esc`)
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.toggle(false);
      }
    });
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    this.container.classList.toggle('active', this.isOpen);

    if (this.isOpen) {
      sound.playClick();
      setTimeout(() => this.input.focus(), 150);
    }
  }

  handleKeyDown(e) {
    sound.playKey();

    if (e.key === 'Enter') {
      const rawCmd = this.input.value.trim();
      if (rawCmd) {
        this.history.push(rawCmd);
        this.historyIndex = this.history.length;
        this.executeCommand(rawCmd);
      }
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
    }
  }

  autocomplete() {
    const current = this.input.value.toLowerCase().trim();
    if (!current) return;

    const available = Object.keys(this.commands).concat(['clear', 'exit', 'matrix', 'sound', 'reboot', 'shutdown']);
    const match = available.find(c => c.startsWith(current));
    if (match) {
      this.input.value = match;
    }
  }

  executeCommand(cmdStr) {
    const normalized = cmdStr.toLowerCase().trim();
    this.appendPromptEntry(cmdStr);

    if (normalized === 'clear') {
      this.historyContainer.innerHTML = '';
      return;
    }

    if (normalized === 'exit') {
      this.toggle(false);
      return;
    }

    if (normalized === 'matrix') {
      this.toggleMatrix();
      this.typewriteOutput("Matrix visualizer mode toggled.");
      return;
    }

    if (normalized === 'sound') {
      const state = sound.toggleMute();
      this.typewriteOutput(`Synthesized Audio Engine is now ${state ? 'ENABLED (ON)' : 'MUTED (OFF)'}.`);
      return;
    }

    if (normalized === 'reboot') {
      this.typewriteOutput("Initiating full OS reboot sequence...");
      setTimeout(() => {
        if (this.options.onReboot) this.options.onReboot();
        this.toggle(false);
      }, 800);
      return;
    }

    if (normalized === 'shutdown') {
      this.typewriteOutput("Initiating digital core power-down...");
      sound.playShutdown();
      setTimeout(() => {
        if (this.options.onShutdown) this.options.onShutdown();
        this.toggle(false);
      }, 900);
      return;
    }

    if (this.commands[normalized]) {
      this.typewriteOutput(this.commands[normalized]);
    } else {
      this.typewriteOutput(`Command not recognized: "${cmdStr}". Type 'help' for available OS routines.`);
    }
  }

  appendPromptEntry(cmdStr) {
    const entry = document.createElement('div');
    entry.className = 'term-entry';
    entry.innerHTML = `<span class="prompt-user">nikhil@digital-lab:~$</span> <span class="term-typed-cmd">${this.escapeHtml(cmdStr)}</span>`;
    this.historyContainer.appendChild(entry);
    this.scrollToBottom();
  }

  typewriteOutput(text) {
    const outDiv = document.createElement('pre');
    outDiv.className = 'term-output';
    this.historyContainer.appendChild(outDiv);

    let charIdx = 0;
    this.isTyping = true;

    const interval = setInterval(() => {
      if (charIdx < text.length) {
        outDiv.textContent += text[charIdx];
        charIdx++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
        this.isTyping = false;
        this.scrollToBottom();
      }
    }, 12);
  }

  scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  toggleMatrix() {
    this.matrixActive = !this.matrixActive;
    this.matrixCanvas.classList.toggle('active', this.matrixActive);

    if (this.matrixActive) {
      this.startMatrixRain();
    }
  }

  startMatrixRain() {
    const canvas = this.matrixCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '010101NIKHILCYANVIOLETGLSLWEBGLDEVBUILDER2028';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      if (!this.matrixActive) return;
      ctx.fillStyle = 'rgba(5, 6, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22d3ee';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    };

    draw();
  }
}
