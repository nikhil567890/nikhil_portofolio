/**
 * NIKHIL // DIGITAL LAB v3 — MASTER OS CONTROLLER
 * Unites WebGL persistent scene, Boot sequence, Scroll camera sync, HUD telemetry,
 * 3D card tilt, magnetic cursor, synthesized sound engine, and interactive modals.
 */

import { RESUME_DATA } from './data.js';
import { sound } from './audio.js';
import { WebGLScene } from './webgl/main-scene.js';
import { TerminalOS } from './terminal.js';

class DigitalLabOS {
  constructor() {
    this.data = RESUME_DATA;
    this.scene = null;
    this.terminal = null;
    this.fps = 60;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsTimer = performance.now();

    this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.init();
  }

  init() {
    this.renderDOMContent();
    this.initCustomCursor();
    this.initAudioHUD();
    this.initTerminal();
    this.initProjectModal();
    this.initScrollEngine();
    this.initCardTilt();
    this.initBootSequence();
    this.initWebGL();
    this.startHUDTelemetryLoop();
  }

  // 1. Render all dynamic content strictly from data.js
  renderDOMContent() {
    // Bio & Profile
    const profile = this.data.profile;
    const heroName = document.getElementById('heroName');
    const heroRole = document.getElementById('heroRole');
    const aboutBio = document.getElementById('aboutBio');
    const footerMantra = document.getElementById('footerMantra');

    if (heroName) heroName.textContent = profile.name;
    if (heroRole) heroRole.textContent = profile.role;
    if (aboutBio) aboutBio.textContent = profile.bioLong;
    if (footerMantra) footerMantra.textContent = profile.mantra;

    // Contact cards
    const emailVal = document.getElementById('contactEmailVal');
    const phoneVal = document.getElementById('contactPhoneVal');
    const resumeVal = document.getElementById('contactResumeVal');

    if (emailVal) emailVal.textContent = profile.email;
    if (phoneVal) phoneVal.textContent = profile.phone;
    if (resumeVal) resumeVal.href = profile.resumeUrl;

    // Languages
    const langContainer = document.getElementById('languagesList');
    if (langContainer) {
      langContainer.innerHTML = this.data.languages.map(l => `
        <div class="lang-badge">
          <strong>${l.name}</strong> • <span>${l.proficiency}</span>
        </div>
      `).join('');
    }

    // Skills Matrix Pills & Inspector
    const skillPillsContainer = document.getElementById('skillPillsRow');
    if (skillPillsContainer) {
      skillPillsContainer.innerHTML = this.data.skills.map((s, idx) => `
        <button class="skill-pill ${idx === 0 ? 'active' : ''}" data-skill-id="${s.id}">
          <span>${s.icon}</span> ${s.name}
        </button>
      `).join('');

      this.updateSkillInspector(this.data.skills[0]);

      skillPillsContainer.querySelectorAll('.skill-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          sound.playClick();
          const sId = btn.dataset.skillId;
          const found = this.data.skills.find(s => s.id === sId);
          if (found) {
            skillPillsContainer.querySelectorAll('.skill-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            this.updateSkillInspector(found);
          }
        });
      });
    }

    // Projects Stack
    const projectsContainer = document.getElementById('projectsStack');
    if (projectsContainer) {
      projectsContainer.innerHTML = this.data.projects.map((proj, idx) => `
        <div class="project-item interactive-panel" data-project-id="${proj.id}">
          <div class="project-card-wrap">
            <div class="glass-panel project-card-inner">
              <div class="project-role-badge">// ${proj.role} • ${proj.type}</div>
              <h3 class="project-title">${proj.title}</h3>
              <div class="project-tagline">${proj.tagline}</div>
              <p class="project-desc">${proj.description}</p>
              <div class="project-tags">
                ${proj.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
              </div>
              <div class="project-actions">
                <button class="btn-primary open-proj-btn" data-project-id="${proj.id}">
                  <span>SYSTEM SPECS</span> ↗
                </button>
              </div>
            </div>
          </div>
          <div class="project-meta-preview">
            <div class="stat-box">
              <div class="stat-value" style="color: ${proj.accent};">0${idx + 1}</div>
              <div class="stat-label">SECTOR WORLD / ${proj.worldType.toUpperCase()}</div>
            </div>
          </div>
        </div>
      `).join('');

      // Open Modal Buttons
      projectsContainer.querySelectorAll('.open-proj-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const pId = btn.dataset.projectId;
          this.openProjectModal(pId);
        });
      });
    }

    // Education Timeline
    const eduContainer = document.getElementById('educationTimelineCards');
    if (eduContainer) {
      eduContainer.innerHTML = this.data.education.map(edu => `
        <div class="timeline-card">
          <div class="timeline-year">${edu.year} • ${edu.status}</div>
          <div class="timeline-degree">${edu.degree}</div>
          <div class="timeline-institution">${edu.institution}</div>
          <div class="timeline-spec" style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 4px;">
            ${edu.specialization}
          </div>
          <div class="timeline-location" style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); margin-bottom: 6px;">
            📍 ${edu.location}
          </div>
          <p class="timeline-desc">${edu.desc}</p>
        </div>
      `).join('');
    }

    // Experience Beacon
    const expContainer = document.getElementById('experienceBeaconCard');
    if (expContainer && this.data.experience[0]) {
      const exp = this.data.experience[0];
      expContainer.innerHTML = `
        <span class="milestone-badge">${exp.badge}</span>
        <h3 class="display-title" style="font-size: 1.8rem; margin-bottom: 0.4rem;">${exp.title}</h3>
        <div class="timeline-institution" style="color: var(--accent-cyan); font-weight: 600;">
          ${exp.organization} • ${exp.period}
        </div>
        <p class="project-desc" style="margin-top: 0.8rem;">${exp.description}</p>
        <ul class="milestone-deliverables">
          ${exp.keyDeliverables.map(d => `<li>${d}</li>`).join('')}
        </ul>

        <div class="micro-tag" style="margin-top: 1.5rem;">VERIFIED CERTIFICATIONS</div>
        <div class="cert-badges-list" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 0.6rem;">
          ${(this.data.certifications || []).map(c => `
            <span class="lang-badge" style="font-size: 0.72rem; color: #a78bfa; border-color: rgba(167, 139, 250, 0.3); background: rgba(167, 139, 250, 0.1);">
              ${c.icon} ${c.title}
            </span>
          `).join('')}
        </div>
      `;
    }

    // Interests Constellation Grid
    const constGrid = document.getElementById('interestsCloudGrid');
    if (constGrid) {
      constGrid.innerHTML = this.data.interests.map(item => `
        <button class="star-card interactive-panel" data-interest-id="${item.id}">
          <span class="star-icon">${item.icon}</span>
          <div>
            <div class="star-name">${item.label}</div>
            <div class="star-cat">${item.category}</div>
          </div>
        </button>
      `).join('');

      constGrid.querySelectorAll('.star-card').forEach(card => {
        card.addEventListener('click', () => {
          sound.playClick();
          const id = card.dataset.interestId;
          const found = this.data.interests.find(i => i.id === id);
          if (found) {
            this.highlightInterestCard(card, found);
          }
        });
      });
    }
  }

  updateSkillInspector(skill) {
    const titleEl = document.getElementById('inspectorSkillTitle');
    const descEl = document.getElementById('inspectorSkillDesc');
    if (titleEl) titleEl.textContent = `// [${skill.category.toUpperCase()}] • ${skill.name} (${skill.level})`;
    
    if (descEl) {
      descEl.textContent = '';
      let i = 0;
      const text = skill.desc;
      const timer = setInterval(() => {
        if (i < text.length) {
          descEl.textContent += text[i];
          i++;
        } else {
          clearInterval(timer);
        }
      }, 10);
    }
  }

  highlightInterestCard(card, item) {
    document.querySelectorAll('.star-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const titleEl = document.getElementById('constellationActiveTitle');
    if (titleEl) {
      titleEl.innerHTML = `<span style="color: var(--accent-cyan);">ACTIVE NODE:</span> ${item.icon} ${item.label} [${item.category}]`;
    }
  }

  // 2. Custom Dual-Ring Magnetic Cursor
  initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorBadge = document.getElementById('cursorBadge');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
      this.cursorTarget.x = e.clientX;
      this.cursorTarget.y = e.clientY;
    }, { passive: true });

    const animateCursor = () => {
      this.cursorPos.x += (this.cursorTarget.x - this.cursorPos.x) * 0.22;
      this.cursorPos.y += (this.cursorTarget.y - this.cursorPos.y) * 0.22;
      cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Contextual Hover States
    document.querySelectorAll('button, a, .skill-pill, .star-card, .glass-panel').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        sound.playHover();
        const customBadge = el.getAttribute('data-cursor-badge') || (el.tagName === 'A' || el.classList.contains('btn-primary') ? 'VIEW ↗' : 'EXPLORE');
        if (cursorBadge) cursorBadge.textContent = customBadge;
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
      });
    });
  }

  // 3. Audio HUD & Visualizer loop
  initAudioHUD() {
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioBars = document.querySelectorAll('.audio-bar');

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const isUnmuted = sound.toggleMute();
        audioToggleBtn.querySelector('.hud-btn-text').textContent = isUnmuted ? 'AUDIO: ON' : 'AUDIO: MUTED';
      });
    }

    const updateVisualizer = () => {
      const data = sound.getVisualizerData();
      audioBars.forEach((bar, i) => {
        const val = data[i % data.length] || 4;
        const height = Math.max(3, Math.min(16, val / 12));
        bar.style.height = `${height}px`;
      });
      requestAnimationFrame(updateVisualizer);
    };
    requestAnimationFrame(updateVisualizer);
  }

  // 4. Interactive Terminal Shell
  initTerminal() {
    const termContainer = document.getElementById('terminalDrawer');
    const termTriggerBtn = document.getElementById('terminalTriggerBtn');

    if (termContainer) {
      this.terminal = new TerminalOS(termContainer, {
        onReboot: () => this.rebootOS(),
        onShutdown: () => this.shutdownOS()
      });

      if (termTriggerBtn) {
        termTriggerBtn.addEventListener('click', () => {
          this.terminal.toggle(true);
        });
      }
    }
  }

  // 5. Project Detail Modal
  initProjectModal() {
    this.modal = document.getElementById('projectModal');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.modalBackdrop = document.getElementById('modalBackdrop');

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeProjectModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', () => this.closeProjectModal());
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeProjectModal();
      }
    });
  }

  openProjectModal(projectId) {
    const project = this.data.projects.find(p => p.id === projectId);
    if (!project || !this.modal) return;

    sound.playClick();
    document.getElementById('modalProjRole').textContent = `// ${project.role} • ${project.type}`;
    document.getElementById('modalProjTitle').textContent = project.title;
    document.getElementById('modalProjTagline').textContent = project.tagline;
    document.getElementById('modalProjDesc').textContent = project.description;

    const highlightsList = document.getElementById('modalProjHighlights');
    if (highlightsList) {
      highlightsList.innerHTML = project.highlights.map(h => `<li>${h}</li>`).join('');
    }

    const techTags = document.getElementById('modalProjTech');
    if (techTags) {
      techTags.innerHTML = project.tech.map(t => `<span class="project-tag">${t}</span>`).join('');
    }

    this.modal.classList.add('active');
  }

  closeProjectModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  // 6. Scroll Engine & Chapter Sync
  initScrollEngine() {
    const progressBar = document.getElementById('scrollProgressBar');
    const chapterBtns = document.querySelectorAll('.chapter-dot-btn');
    const sectorTelemetry = document.getElementById('telemetrySector');
    const depthTelemetry = document.getElementById('telemetryDepth');

    const chapters = [
      { id: 'hero', name: 'IGNITION CORE', start: 0.00, end: 0.18 },
      { id: 'about', name: 'SKILLS GALAXY', start: 0.18, end: 0.38 },
      { id: 'projects', name: 'PROJECT UNIVERSE', start: 0.38, end: 0.68 },
      { id: 'timeline', name: 'SPATIAL TIMELINE', start: 0.68, end: 0.85 },
      { id: 'interests', name: 'CONSTELLATION', start: 0.85, end: 0.94 },
      { id: 'contact', name: 'CONTACT CORE', start: 0.94, end: 1.00 }
    ];

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (this.scene) {
        this.scene.setScrollProgress(progress);
      }

      // Identify active chapter
      let activeChap = chapters[0];
      for (const ch of chapters) {
        if (progress >= ch.start && progress <= ch.end) {
          activeChap = ch;
          break;
        }
      }

      chapterBtns.forEach(btn => {
        const chapId = btn.dataset.chapter;
        btn.classList.toggle('active', chapId === activeChap.id);
      });

      if (sectorTelemetry) sectorTelemetry.textContent = activeChap.name;
      if (depthTelemetry) depthTelemetry.textContent = `Z-${Math.floor(progress * 180)}M`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Chapter button click smooth jump
    chapterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const targetId = btn.dataset.chapter;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // 7. 3D Card Perspective Tilt
  initCardTilt() {
    const cards = document.querySelectorAll('.project-card-inner, .glass-panel');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
      });
    });
  }

  // 8. OS Boot Sequence
  initBootSequence() {
    const bootOverlay = document.getElementById('bootOverlay');
    const bootConsole = document.getElementById('bootConsole');
    const bootProgressFill = document.getElementById('bootProgressFill');
    const enterBtn = document.getElementById('enterLabBtn');

    if (!bootOverlay || !bootConsole) return;

    const steps = [
      { text: "INITIALIZING QUANTUM KERNEL v3.4.0...", pct: 25 },
      { text: "COMPILING GLSL SIMPLEX NOISE SHADERS...", pct: 50 },
      { text: "SAMPLING 5200+ GPU MORPH PARTICLES...", pct: 75 },
      { text: "CONNECTING SPATIAL MESH & TELEMETRY...", pct: 90 },
      { text: "SYSTEM OPERATIONAL // ALL CIRCUITS ALIVE.", pct: 100 }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = `<span class="ok">[OK]</span> <span class="info">${step.text}</span>`;
        bootConsole.appendChild(line);
        if (bootProgressFill) bootProgressFill.style.width = `${step.pct}%`;

        currentStep++;
        setTimeout(processStep, 260);
      } else {
        if (enterBtn) {
          enterBtn.classList.add('ready');
          enterBtn.addEventListener('click', () => {
            sound.playBootChime();
            bootOverlay.classList.add('hidden');
          });
        }
      }
    };

    setTimeout(processStep, 400);

    // Shutdown Button Trigger
    const shutdownBtn = document.getElementById('systemShutdownBtn');
    if (shutdownBtn) {
      shutdownBtn.addEventListener('click', () => this.shutdownOS());
    }
  }

  // 9. WebGL Canvas Scene Initialization
  initWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    this.scene = new WebGLScene(canvas, this.data, {
      onSkillClick: (skill) => {
        sound.playClick();
        const skillPills = document.querySelectorAll('.skill-pill');
        skillPills.forEach(p => {
          if (p.dataset.skillId === skill.id) {
            p.classList.add('active');
            p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            p.classList.remove('active');
          }
        });
        this.updateSkillInspector(skill);
      },
      onInterestClick: (interest) => {
        sound.playClick();
        const starCards = document.querySelectorAll('.star-card');
        starCards.forEach(c => {
          if (c.dataset.interestId === interest.id) {
            this.highlightInterestCard(c, interest);
          }
        });
      },
      onFallback: () => {
        document.body.classList.add('webgl-fallback-active');
      }
    });
  }

  // 10. HUD Telemetry Loop (FPS calculation)
  startHUDTelemetryLoop() {
    const fpsEl = document.getElementById('telemetryFps');
    const update = (now) => {
      this.frameCount++;
      if (now - this.fpsTimer >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
        this.frameCount = 0;
        this.fpsTimer = now;
        if (fpsEl) fpsEl.textContent = `${this.fps} FPS`;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  rebootOS() {
    const bootOverlay = document.getElementById('bootOverlay');
    if (bootOverlay) {
      bootOverlay.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sound.playBootChime();
      setTimeout(() => {
        bootOverlay.classList.add('hidden');
      }, 1800);
    }
  }

  shutdownOS() {
    sound.playShutdown();
    const shutdownScreen = document.createElement('div');
    shutdownScreen.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: #000000; z-index: 1000000; display: flex; flex-direction: column;
      justify-content: center; align-items: center; color: var(--accent-cyan);
      font-family: var(--font-mono); font-size: 1.2rem; letter-spacing: 0.3em;
    `;
    shutdownScreen.innerHTML = `
      <div style="margin-bottom: 1.5rem;">[ SYSTEM POWERED DOWN ]</div>
      <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 2rem;">NIKHIL // DIGITAL LAB SHUTDOWN COMPLETE</div>
      <button id="rebootBtn" class="btn-primary">REBOOT LAB OS</button>
    `;
    document.body.appendChild(shutdownScreen);

    document.getElementById('rebootBtn').addEventListener('click', () => {
      document.body.removeChild(shutdownScreen);
      this.rebootOS();
    });
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new DigitalLabOS();
});
