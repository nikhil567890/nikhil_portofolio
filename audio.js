/**
 * NIKHIL // DIGITAL LAB v3 — SYNTHESIZED WEB AUDIO ENGINE
 * Zero external audio files required. Real-time procedural Web Audio synthesis.
 * Safe, user-friendly, muted by default with visualizer frequency hooks.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isInitialized = false;
    this.masterGain = null;
    this.ambientGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.analyser = null;
    this.dataArray = null;

    // Check stored preference
    try {
      const stored = localStorage.getItem("nikhil_lab_audio_muted");
      if (stored !== null) {
        this.isMuted = stored === "true";
      }
    } catch (e) {
      console.warn("Storage not available:", e);
    }
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.initAmbientDrone();
      this.isInitialized = true;
    } catch (err) {
      console.warn("Web Audio API not supported or blocked:", err);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.resume();
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem("nikhil_lab_audio_muted", String(this.isMuted));
    } catch (e) {}

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.4;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }

    if (!this.isMuted) {
      this.playBeep(880, "sine", 0.08, 0.15);
    }

    return !this.isMuted;
  }

  initAmbientDrone() {
    if (!this.ctx || this.droneOsc1) return;
    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = "lowpass";
      this.droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = "sine";
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = "triangle";
      this.droneOsc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // A2 slight detune

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn("Ambient drone error:", e);
    }
  }

  playBeep(freq = 440, type = "sine", duration = 0.08, gainVal = 0.1) {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playHover() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  playKey() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const freq = 450 + Math.random() * 200;
      this.playBeep(freq, "sine", 0.03, 0.025);
    } catch (e) {}
  }

  playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const now = this.ctx.currentTime;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(360, now + 0.25);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playBootChime() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const notes = [220, 329.63, 440, 659.25, 880]; // A3, E4, A4, E5, A5
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.7);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.7);
      });
    } catch (e) {}
  }

  playShutdown() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  getVisualizerData() {
    if (!this.analyser || this.isMuted) {
      // Return simulated quiet pulse if muted
      return [12, 18, 24, 16, 8, 14, 20, 10];
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    return Array.from(this.dataArray.slice(0, 8));
  }
}

export const sound = new SoundEngine();
