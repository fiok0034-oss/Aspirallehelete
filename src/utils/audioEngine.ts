/**
 * Procedural Web Audio Engine for "A Spirál Lehellete"
 * Generates dark, icy, sci-fi atmospheric soundscapes:
 * - Subterranean sub-bass drone
 * - Arctic ice wind filter
 * - Resonant cold harmonic crystals
 * - Intermittent telemetry/radio pulse
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private windGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private pulseTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  public async start(): Promise<boolean> {
    try {
      this.init();
      if (!this.ctx) return false;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.25, now + 3);
      this.masterGain.connect(this.ctx.destination);

      // 1. Deep Sub Drone (55Hz and 55.4Hz beating slowly)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(110, now);

      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55.0, now);

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(55.4, now); // 0.4 Hz binaural beat

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.35, now);

      this.droneOsc1.connect(droneFilter);
      this.droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);

      // 2. Arctic Wind Generator (Filtered Noise Buffer)
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
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

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(280, now);
      windFilter.Q.setValueAtTime(3.5, now);

      // Modulate wind frequency for slow icy gusts
      const windLfo = this.ctx.createOscillator();
      const windLfoGain = this.ctx.createGain();
      windLfo.frequency.setValueAtTime(0.12, now);
      windLfoGain.gain.setValueAtTime(140, now);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);
      windLfo.start(now);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.18, now);

      this.noiseSource.connect(windFilter);
      windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.noiseSource.start(now);

      // 3. Periodic Subterranean Echo/Resonance
      this.schedulePings();

      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Audio start failed', e);
      return false;
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

        const freqs = [330, 440, 523.25, 659.25, 880];
        const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];

        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(chosenFreq, now);

        pingFilter.type = 'bandpass';
        pingFilter.frequency.setValueAtTime(chosenFreq, now);
        pingFilter.Q.setValueAtTime(6.0, now);

        pingGain.gain.setValueAtTime(0.0001, now);
        pingGain.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        pingOsc.connect(pingFilter);
        pingFilter.connect(pingGain);
        pingGain.connect(this.masterGain);

        pingOsc.start(now);
        pingOsc.stop(now + 4.0);
      } catch {
        // silent catch
      }

      // Next random ping between 4 and 10 seconds
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

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);

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
      }, 1100);
    } catch {
      this.isPlaying = false;
    }
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
