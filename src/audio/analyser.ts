import type { AudioFeatures } from '../types';

const silentFeatures: AudioFeatures = {
  bass: 0,
  mid: 0,
  high: 0,
  rms: 0,
  beat: 0,
  waveform: 0,
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export class AudioFeatureAnalyzer {
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private waveformData: Uint8Array<ArrayBuffer> | null = null;
  private bassMemory = 0.08;
  private lastBeatAt = 0;

  async connect(audio: HTMLAudioElement): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.82;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.waveformData = new Uint8Array(this.analyser.fftSize);
    }

    if (!this.source && this.analyser && this.context) {
      this.source = this.context.createMediaElementSource(audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.context.destination);
    }

    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  sample(): AudioFeatures {
    if (!this.context || !this.analyser || !this.frequencyData || !this.waveformData) {
      return silentFeatures;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);

    const nyquist = this.context.sampleRate / 2;
    const binHz = nyquist / this.frequencyData.length;

    const averageBand = (fromHz: number, toHz: number) => {
      const start = Math.max(0, Math.floor(fromHz / binHz));
      const end = Math.min(this.frequencyData!.length - 1, Math.ceil(toHz / binHz));
      let total = 0;
      let count = 0;

      for (let index = start; index <= end; index += 1) {
        total += this.frequencyData![index];
        count += 1;
      }

      return count === 0 ? 0 : total / count / 255;
    };

    let sumSquares = 0;
    let waveTotal = 0;
    for (const value of this.waveformData) {
      const centered = (value - 128) / 128;
      sumSquares += centered * centered;
      waveTotal += Math.abs(centered);
    }

    const bass = averageBand(20, 160);
    const mid = averageBand(160, 2200);
    const high = averageBand(2200, 12000);
    const rms = clamp01(Math.sqrt(sumSquares / this.waveformData.length) * 1.8);
    const waveform = clamp01(waveTotal / this.waveformData.length);

    this.bassMemory = this.bassMemory * 0.965 + bass * 0.035;
    const now = performance.now();
    const beatCandidate = bass > this.bassMemory * 1.42 && bass > 0.22;
    const beat = beatCandidate && now - this.lastBeatAt > 180 ? 1 : 0;
    if (beat) {
      this.lastBeatAt = now;
    }

    return {
      bass: clamp01(bass * 1.2),
      mid: clamp01(mid * 1.3),
      high: clamp01(high * 1.5),
      rms,
      beat,
      waveform,
    };
  }

  async suspend(): Promise<void> {
    if (this.context?.state === 'running') {
      await this.context.suspend();
    }
  }
}
