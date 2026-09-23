/**
 * Procedural Web Audio Engine for "A Spirál Lehelete"
 * Generates dark, icy, sci-fi atmospheric soundscapes:
 * - Subterranean sub-bass drone
 * - Arctic ice wind filter
 * - Resonant cold harmonic crystals
 * - Multi-zone acoustic profiles (Antarktisz, Jég alatti világ, Spirál, Törés Városa, Időn Túli Város)
 */

export type AudioZone = 'antarctica' | 'sub-ice' | 'spiral' | 'fracture' | 'timeless';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentZone: AudioZone = 'antarctica';
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private pulseTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  public async start(initialZone: AudioZone = 'antarctica'): Promise<boolean> {
    try {
      this.init();
      if (!this.ctx) return false;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      this.currentZone = initialZone;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.24, now + 2.5);
      this.masterGain.connect(this.ctx.destination);

      // 1. Deep Sub Drone
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneFilter = this.ctx.createBiquadFilter();

      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(110, now);

      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55.0, now);

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.4, now); // 0.4 Hz binaural beat

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.35, now);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(droneGain);
      droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);

      // 2. Arctic Wind Generator (Filtered Noise Buffer)
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.11;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(280, now);
      this.windFilter.Q.setValueAtTime(3.5, now);

      const windLfo = this.ctx.createOscillator();
      const windLfoGain = this.ctx.createGain();
      windLfo.frequency.setValueAtTime(0.12, now);
      windLfoGain.gain.setValueAtTime(140, now);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(this.windFilter.frequency);
      windLfo.start(now);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.18, now);

      this.noiseSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.noiseSource.start(now);

      // Apply zone signature
      this.applyZoneParameters(initialZone);

      // 3. Periodic Subterranean Echo/Resonance
      this.schedulePings();

      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Audio start failed', e);
      return false;
    }
  }

  public setZone(zone: AudioZone) {
    this.currentZone = zone;
    if (this.isPlaying && this.ctx) {
      this.applyZoneParameters(zone);
    }
  }

  public getZone(): AudioZone {
    return this.currentZone;
  }

  private applyZoneParameters(zone: AudioZone) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (zone) {
      case 'antarctica':
        if (this.windGain) this.windGain.gain.setTargetAtTime(0.22, now, 0.5);
        if (this.windFilter) this.windFilter.frequency.setTargetAtTime(320, now, 0.5);
        if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(55, now, 0.5);
        if (this.droneFilter) this.droneFilter.frequency.setTargetAtTime(110, now, 0.5);
        break;

      case 'sub-ice':
        if (this.windGain) this.windGain.gain.setTargetAtTime(0.08, now, 0.5);
        if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(42, now, 0.5);
        if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(42.3, now, 0.5);
        if (this.droneFilter) this.droneFilter.frequency.setTargetAtTime(80, now, 0.5);
        break;

      case 'spiral':
        if (this.windGain) this.windGain.gain.setTargetAtTime(0.05, now, 0.5);
        if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(65.4, now, 0.5);
        if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(130.8, now, 0.5);
        if (this.droneFilter) this.droneFilter.frequency.setTargetAtTime(180, now, 0.5);
        break;

      case 'fracture':
        if (this.windGain) this.windGain.gain.setTargetAtTime(0.16, now, 0.5);
        if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(73.4, now, 0.5);
        if (this.droneFilter) this.droneFilter.frequency.setTargetAtTime(260, now, 0.5);
        break;

      case 'timeless':
        if (this.windGain) this.windGain.gain.setTargetAtTime(0.04, now, 0.5);
        if (this.droneOsc1) this.droneOsc1.frequency.setTargetAtTime(108, now, 0.5);
        if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(216, now, 0.5);
        if (this.droneFilter) this.droneFilter.frequency.setTargetAtTime(440, now, 0.5);
        break;
    }
  }

  private schedulePings() {
    if (!this.ctx || !this.masterGain) return;

    const triggerPing = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const now = this.ctx.currentTime;
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        const pingFilter = this.ctx.createBiquadFilter();

        let freqs = [330, 440, 523.25, 659.25, 880];
        if (this.currentZone === 'timeless') {
          freqs = [528, 660, 792, 1056];
        } else if (this.currentZone === 'sub-ice') {
          freqs = [110, 165, 220, 330];
        }

        const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];

        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(chosenFreq, now);

        pingFilter.type = 'bandpass';
        pingFilter.frequency.setValueAtTime(chosenFreq, now);
        pingFilter.Q.setValueAtTime(7.0, now);

        pingGain.gain.setValueAtTime(0.0001, now);
        pingGain.gain.exponentialRampToValueAtTime(0.05, now + 0.12);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        pingOsc.connect(pingFilter);
        pingFilter.connect(pingGain);
        pingGain.connect(this.masterGain);

        pingOsc.start(now);
        pingOsc.stop(now + 4.0);
      } catch {
        // silent catch
      }

      const nextDelay = 4000 + Math.random() * 6000;
      this.pulseTimer = window.setTimeout(triggerPing, nextDelay);
    };

    this.pulseTimer = window.setTimeout(triggerPing, 2500);
  }

  public playSonarPing() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.6);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch {
      // silent
    }
  }

  public playDeepChime() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(144, now);
      osc.frequency.exponentialRampToValueAtTime(72, now + 2.0);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.0);
    } catch {
      // silent
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      if (this.pulseTimer) {
        clearTimeout(this.pulseTimer);
        this.pulseTimer = null;
      }

      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.noiseSource?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.noiseSource?.disconnect();
        } catch {
          // ignore
        }
        this.isPlaying = false;
      }, 900);
    } catch {
      this.isPlaying = false;
    }
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
