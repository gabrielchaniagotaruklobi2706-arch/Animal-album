// High-fidelity Web Audio API synthesizer for realistic wildlife acoustics

export type SoundType =
  | 'lion'
  | 'tiger'
  | 'elephant'
  | 'wolf'
  | 'bird'
  | 'eagle'
  | 'dolphin'
  | 'monkey'
  | 'frog'
  | 'whale'
  | 'owl'
  | 'general';

type SoundListener = (type: string, isPlaying: boolean) => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private ambientTimer: number | null = null;
  public isMuted: boolean = false;
  private listeners: SoundListener[] = [];

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public addListener(listener: SoundListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(type: string, isPlaying: boolean) {
    this.listeners.forEach((l) => l(type, isPlaying));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.isMuted;
  }

  // Helper: create white/pink noise buffer for breath/fur/wind turbulence
  private createNoiseBuffer(ctx: AudioContext, seconds: number = 2): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink-ish noise filter
      lastOut = (lastOut * 0.95) + (white * 0.05);
      data[i] = lastOut * 3;
    }
    return buffer;
  }

  /**
   * Play realistic animal sounds modeled with multi-oscillator formant synthesis,
   * acoustic resonance chambers, and authentic vocal tract modulation.
   */
  public playAnimalSound(type: string) {
    if (this.isMuted) return;

    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      this.notify(type, true);

      switch (type) {
        // ==========================================
        // 1. LION & TIGER: Deep chest roar with throat turbulence
        // ==========================================
        case 'lion':
        case 'tiger': {
          const duration = type === 'lion' ? 3.2 : 2.6;

          // Fundamental vocal cord oscillation (chest rumble)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const oscSub = ctx.createOscillator();
          const gainNode = ctx.createGain();
          const formant1 = ctx.createBiquadFilter();
          const formant2 = ctx.createBiquadFilter();

          // Noise for throat turbulence (growl air rasp)
          const noiseBuffer = this.createNoiseBuffer(ctx, duration);
          const noiseSrc = ctx.createBufferSource();
          noiseSrc.buffer = noiseBuffer;
          const noiseFilter = ctx.createBiquadFilter();
          const noiseGain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'triangle';
          oscSub.type = 'sine';

          // Frequency pitch contour of a feline roar: low start -> deep rise -> long guttural roar -> 2 pulse grunts
          const startPitch = type === 'lion' ? 82 : 95;
          osc1.frequency.setValueAtTime(startPitch, now);
          osc1.frequency.exponentialRampToValueAtTime(125, now + 0.6);
          osc1.frequency.linearRampToValueAtTime(88, now + 1.8);
          osc1.frequency.exponentialRampToValueAtTime(52, now + duration);

          osc2.frequency.setValueAtTime(startPitch * 1.5, now);
          osc2.frequency.exponentialRampToValueAtTime(180, now + 0.6);
          osc2.frequency.linearRampToValueAtTime(110, now + 1.8);
          osc2.frequency.exponentialRampToValueAtTime(60, now + duration);

          oscSub.frequency.setValueAtTime(42, now);
          oscSub.frequency.linearRampToValueAtTime(55, now + 0.6);
          oscSub.frequency.exponentialRampToValueAtTime(32, now + duration);

          // Formant resonance: mouth & pharynx acoustic cavity
          formant1.type = 'bandpass';
          formant1.frequency.setValueAtTime(380, now);
          formant1.frequency.linearRampToValueAtTime(620, now + 0.7);
          formant1.frequency.linearRampToValueAtTime(320, now + 2.2);
          formant1.Q.value = 4.0;

          formant2.type = 'bandpass';
          formant2.frequency.setValueAtTime(850, now);
          formant2.frequency.linearRampToValueAtTime(1250, now + 0.7);
          formant2.frequency.linearRampToValueAtTime(700, now + 2.2);
          formant2.Q.value = 5.0;

          // Tremolo modulation for guttural throat fluttering
          const tremolo = ctx.createOscillator();
          const tremoloGain = ctx.createGain();
          tremolo.type = 'sine';
          tremolo.frequency.setValueAtTime(22, now); // 22Hz flutter
          tremoloGain.gain.setValueAtTime(0.18, now);

          // Envelope
          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(0.38, now + 0.4);
          gainNode.gain.linearRampToValueAtTime(0.42, now + 1.2);
          gainNode.gain.linearRampToValueAtTime(0.28, now + 2.0);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

          // Throat air rasp
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(450, now);
          noiseFilter.frequency.linearRampToValueAtTime(900, now + 0.6);
          noiseFilter.Q.value = 3.0;

          noiseGain.gain.setValueAtTime(0.001, now);
          noiseGain.gain.linearRampToValueAtTime(0.16, now + 0.5);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

          // Connections
          osc1.connect(formant1);
          osc2.connect(formant1);
          formant1.connect(gainNode);

          oscSub.connect(gainNode);

          noiseSrc.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(gainNode);

          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          oscSub.start(now);
          noiseSrc.start(now);

          osc1.stop(now + duration);
          osc2.stop(now + duration);
          oscSub.stop(now + duration);
          noiseSrc.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 2. ARCTIC WOLF: Haunting pack howl with echoing harmonics
        // ==========================================
        case 'wolf': {
          const duration = 3.4;

          // Main pure howl tone + acoustic upper overtone
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const oscHarmonic = ctx.createOscillator();
          const gain = ctx.createGain();
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();

          // Subtle wind breathiness
          const windBuffer = this.createNoiseBuffer(ctx, duration);
          const windSrc = ctx.createBufferSource();
          windSrc.buffer = windBuffer;
          const windFilter = ctx.createBiquadFilter();
          const windGain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          oscHarmonic.type = 'sine';

          // Pitch trajectory of a real arctic wolf howl:
          // Low call -> soaring mournful climb -> steady high peak -> smooth melancholic descent
          osc1.frequency.setValueAtTime(260, now);
          osc1.frequency.exponentialRampToValueAtTime(590, now + 0.8);
          osc1.frequency.linearRampToValueAtTime(570, now + 1.8);
          osc1.frequency.exponentialRampToValueAtTime(280, now + 3.0);
          osc1.frequency.exponentialRampToValueAtTime(180, now + duration);

          osc2.frequency.setValueAtTime(262, now);
          osc2.frequency.exponentialRampToValueAtTime(593, now + 0.8);
          osc2.frequency.linearRampToValueAtTime(573, now + 1.8);
          osc2.frequency.exponentialRampToValueAtTime(282, now + 3.0);

          oscHarmonic.frequency.setValueAtTime(520, now);
          oscHarmonic.frequency.exponentialRampToValueAtTime(1180, now + 0.8);
          oscHarmonic.frequency.linearRampToValueAtTime(1140, now + 1.8);
          oscHarmonic.frequency.exponentialRampToValueAtTime(560, now + 3.0);

          // Vocal tract pitch vibrato (subtle 5.5 Hz natural flutter)
          vibrato.frequency.setValueAtTime(5.5, now);
          vibratoGain.gain.setValueAtTime(4.5, now);
          vibrato.connect(osc1.frequency);
          vibrato.connect(osc2.frequency);

          // Envelope
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.28, now + 0.7);
          gain.gain.linearRampToValueAtTime(0.24, now + 2.0);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          // Wind filter
          windFilter.type = 'bandpass';
          windFilter.frequency.setValueAtTime(750, now);
          windFilter.Q.value = 5.0;
          windGain.gain.setValueAtTime(0.001, now);
          windGain.gain.linearRampToValueAtTime(0.06, now + 0.5);
          windGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc1.connect(gain);
          osc2.connect(gain);
          oscHarmonic.connect(gain);
          windSrc.connect(windFilter);
          windFilter.connect(windGain);
          windGain.connect(gain);

          gain.connect(ctx.destination);

          vibrato.start(now);
          osc1.start(now);
          osc2.start(now);
          oscHarmonic.start(now);
          windSrc.start(now);

          vibrato.stop(now + duration);
          osc1.stop(now + duration);
          osc2.stop(now + duration);
          oscHarmonic.stop(now + duration);
          windSrc.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 3. ELEPHANT: Piercing brassy trumpeting with acoustic flutter
        // ==========================================
        case 'elephant': {
          const duration = 2.0;

          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Lip buzz AM modulation (32 Hz trunk vibration)
          const flutter = ctx.createOscillator();
          const flutterGain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'square';
          flutter.type = 'sine';

          osc1.frequency.setValueAtTime(260, now);
          osc1.frequency.exponentialRampToValueAtTime(540, now + 0.3);
          osc1.frequency.linearRampToValueAtTime(680, now + 0.7);
          osc1.frequency.exponentialRampToValueAtTime(310, now + 1.8);

          osc2.frequency.setValueAtTime(130, now);
          osc2.frequency.exponentialRampToValueAtTime(270, now + 0.3);
          osc2.frequency.linearRampToValueAtTime(340, now + 0.7);
          osc2.frequency.exponentialRampToValueAtTime(155, now + 1.8);

          flutter.frequency.setValueAtTime(32, now);
          flutterGain.gain.setValueAtTime(30, now);
          flutter.connect(osc1.frequency);

          // Resonant brass filter
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(650, now);
          filter.frequency.linearRampToValueAtTime(1400, now + 0.5);
          filter.frequency.exponentialRampToValueAtTime(550, now + 1.8);
          filter.Q.value = 4.2;

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
          gain.gain.linearRampToValueAtTime(0.4, now + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          flutter.start(now);
          osc1.start(now);
          osc2.start(now);

          flutter.stop(now + duration);
          osc1.stop(now + duration);
          osc2.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 4. ORANGUTAN / GREAT APE: Pant-hoots & long-call whoops
        // ==========================================
        case 'monkey': {
          const duration = 2.4;
          // Sequence of 3 rhythmic low chest grunts followed by 2 rising canopy whoops
          const pulses = [
            { t: 0.0, freq: 310, endFreq: 420, dur: 0.22, vol: 0.25 },
            { t: 0.3, freq: 340, endFreq: 480, dur: 0.24, vol: 0.28 },
            { t: 0.65, freq: 400, endFreq: 620, dur: 0.35, vol: 0.34 },
            { t: 1.15, freq: 520, endFreq: 880, dur: 0.45, vol: 0.38 },
            { t: 1.7, freq: 460, endFreq: 750, dur: 0.4, vol: 0.32 },
          ];

          pulses.forEach(({ t, freq, endFreq, dur, vol }) => {
            const start = now + t;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur * 0.4);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.9, start + dur);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, start);
            filter.frequency.linearRampToValueAtTime(1400, start + dur * 0.4);
            filter.Q.value = 3.0;

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(vol, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + dur + 0.02);
          });

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 5. DOLPHIN: Echolocation clicks + signature whistle
        // ==========================================
        case 'dolphin': {
          const duration = 2.0;

          // Rapid biosonar click burst (12 micro pulses)
          for (let i = 0; i < 14; i++) {
            const clickTime = now + i * 0.045;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(3800 + i * 150, clickTime);
            osc.frequency.linearRampToValueAtTime(6200, clickTime + 0.015);

            g.gain.setValueAtTime(0.18, clickTime);
            g.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(clickTime);
            osc.stop(clickTime + 0.025);
          }

          // Signature joyful whistle sweep
          const whistle = ctx.createOscillator();
          const wGain = ctx.createGain();
          whistle.type = 'sine';
          const wStart = now + 0.7;

          whistle.frequency.setValueAtTime(2600, wStart);
          whistle.frequency.exponentialRampToValueAtTime(4200, wStart + 0.35);
          whistle.frequency.linearRampToValueAtTime(3100, wStart + 0.7);
          whistle.frequency.exponentialRampToValueAtTime(4600, wStart + 1.1);

          wGain.gain.setValueAtTime(0.001, wStart);
          wGain.gain.linearRampToValueAtTime(0.2, wStart + 0.15);
          wGain.gain.linearRampToValueAtTime(0.22, wStart + 0.7);
          wGain.gain.exponentialRampToValueAtTime(0.001, wStart + 1.25);

          whistle.connect(wGain);
          wGain.connect(ctx.destination);
          whistle.start(wStart);
          whistle.stop(wStart + 1.26);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 6. EAGLE: Piercing raptor dive screech
        // ==========================================
        case 'eagle': {
          const duration = 2.2;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Screech rasp
          const noiseBuffer = this.createNoiseBuffer(ctx, duration);
          const noiseSrc = ctx.createBufferSource();
          noiseSrc.buffer = noiseBuffer;
          const noiseFilter = ctx.createBiquadFilter();
          const noiseGain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'sine';

          // Raptor screech drops sharply from 3600Hz down to 1300Hz
          osc1.frequency.setValueAtTime(3400, now);
          osc1.frequency.exponentialRampToValueAtTime(1400, now + 1.4);
          osc1.frequency.exponentialRampToValueAtTime(900, now + 1.9);

          osc2.frequency.setValueAtTime(3420, now);
          osc2.frequency.exponentialRampToValueAtTime(1420, now + 1.4);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2800, now);
          filter.frequency.exponentialRampToValueAtTime(1400, now + 1.5);
          filter.Q.value = 5.0;

          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(3200, now);
          noiseFilter.Q.value = 3.0;

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
          gain.gain.linearRampToValueAtTime(0.28, now + 0.9);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noiseGain.gain.setValueAtTime(0.001, now);
          noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);

          noiseSrc.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(gain);

          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          noiseSrc.start(now);

          osc1.stop(now + duration);
          osc2.stop(now + duration);
          noiseSrc.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 7. SONGBIRD / AVIARY: Melodic flutey birdsong trills
        // ==========================================
        case 'bird': {
          const duration = 1.8;
          // Sequence of 5 delicate, rapid warbles
          const notes = [
            { t: 0.0, f1: 2200, f2: 3100, len: 0.15 },
            { t: 0.18, f1: 2600, f2: 3600, len: 0.16 },
            { t: 0.38, f1: 2100, f2: 2900, len: 0.14 },
            { t: 0.65, f1: 3200, f2: 4400, len: 0.22 },
            { t: 0.92, f1: 2800, f2: 3900, len: 0.25 },
            { t: 1.25, f1: 3500, f2: 2400, len: 0.3 },
          ];

          notes.forEach(({ t, f1, f2, len }) => {
            const start = now + t;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f1, start);
            osc.frequency.exponentialRampToValueAtTime(f2, start + len * 0.5);
            osc.frequency.exponentialRampToValueAtTime(f1 * 0.95, start + len);

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, start + len);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + len + 0.02);
          });

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 8. FROG: Resonant throat cavity croaks
        // ==========================================
        case 'frog': {
          const duration = 1.4;
          for (let i = 0; i < 2; i++) {
            const t = now + i * 0.45;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.linearRampToValueAtTime(95, t + 0.25);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(380, t);
            filter.Q.value = 6.0;

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.3);
          }

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 9. WHALE / OCEAN GIANTS: Deep haunting subsonic ocean song
        // ==========================================
        case 'whale': {
          const duration = 3.5;
          const osc = ctx.createOscillator();
          const oscSub = ctx.createOscillator();
          const gain = ctx.createGain();
          const vibrato = ctx.createOscillator();
          const vGain = ctx.createGain();

          osc.type = 'sine';
          oscSub.type = 'sine';

          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 1.2);
          osc.frequency.linearRampToValueAtTime(180, now + 2.2);
          osc.frequency.exponentialRampToValueAtTime(80, now + duration);

          oscSub.frequency.setValueAtTime(60, now);
          oscSub.frequency.exponentialRampToValueAtTime(120, now + 1.2);
          oscSub.frequency.exponentialRampToValueAtTime(40, now + duration);

          vibrato.frequency.setValueAtTime(3.0, now);
          vGain.gain.setValueAtTime(10, now);
          vibrato.connect(osc.frequency);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.32, now + 0.8);
          gain.gain.linearRampToValueAtTime(0.3, now + 2.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(gain);
          oscSub.connect(gain);
          gain.connect(ctx.destination);

          vibrato.start(now);
          osc.start(now);
          oscSub.start(now);

          vibrato.stop(now + duration);
          osc.stop(now + duration);
          oscSub.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // 10. OWL: Deep nocturnal hooting
        // ==========================================
        case 'owl': {
          const duration = 2.0;
          const hoots = [
            { t: 0.0, f: 380, len: 0.4 },
            { t: 0.6, f: 420, len: 0.25 },
            { t: 0.95, f: 360, len: 0.6 },
          ];

          hoots.forEach(({ t, f, len }) => {
            const start = now + t;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            osc.frequency.exponentialRampToValueAtTime(f - 30, start + len);

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(0.28, start + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, start + len);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + len + 0.02);
          });

          setTimeout(() => this.notify(type, false), duration * 1000);
          break;
        }

        // ==========================================
        // DEFAULT / GENERAL WILDLIFE
        // ==========================================
        default: {
          const duration = 1.2;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.3);
          osc.frequency.exponentialRampToValueAtTime(260, now + 1.0);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + duration);

          setTimeout(() => this.notify(type, false), duration * 1000);
        }
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Mascot playful voice blip ("pip-poo-peep!")
  public playMascotSpeech() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const notes = [440, 587.33, 739.99]; // A4, D5, F#5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq + 100, t + 0.06);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      });
    } catch {}
  }

  // UI Sound effects
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  public playCameraShutter() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      // Click 1 (Mirror flip)
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1400, now);
      g1.gain.setValueAtTime(0.2, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Click 2 (Shutter curtain snap)
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(650, now + 0.08);
      g2.gain.setValueAtTime(0.25, now + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.17);
    } catch {}
  }

  public playFeedCrunch() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + i * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 - i * 40, t);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
    } catch {}
  }

  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch {}
  }

  // Ambient jungle background synthesizer
  public startAmbient() {
    if (this.isAmbientPlaying) return;
    try {
      const ctx = this.initCtx();
      this.isAmbientPlaying = true;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      // Periodic gentle chirp or rustle
      const triggerChirp = () => {
        if (!this.isAmbientPlaying || this.isMuted) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200 + Math.random() * 800, now);
        osc.frequency.exponentialRampToValueAtTime(2600 + Math.random() * 500, now + 0.1);
        g.gain.setValueAtTime(0.02, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.connect(g);
        if (this.ambientGain) g.connect(this.ambientGain);
        osc.start(now);
        osc.stop(now + 0.2);

        this.ambientTimer = window.setTimeout(triggerChirp, 3500 + Math.random() * 4500);
      };

      triggerChirp();
    } catch {}
  }

  public stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
}

export const soundManager = new SoundManager();
