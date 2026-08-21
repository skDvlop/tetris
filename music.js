'use strict';

// 코로베이니키(테트리스 Type A) 멜로디 — Web Audio API 오실레이터 합성
const NOTE_FREQ = {
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

// [음이름, 박자(초)] — TEMPO_SCALE로 전체 속도 조절
const TEMPO_SCALE = 1.85;

const KOROBEINIKI = [
  ['E5', 0.15], ['B4', 0.075], ['C5', 0.075], ['D5', 0.15],
  ['E5', 0.075], ['D5', 0.075], ['C5', 0.15], ['B4', 0.15],
  ['A4', 0.15], ['A4', 0.075], ['C5', 0.15], ['E5', 0.15],
  ['D5', 0.075], ['C5', 0.075], ['B4', 0.225], ['B4', 0.075],
  ['C5', 0.075], ['D5', 0.15], ['E5', 0.075], ['C5', 0.075],
  ['A4', 0.15], ['A4', 0.15],
  ['B4', 0.15], ['B4', 0.075], ['C5', 0.15], ['D5', 0.15],
  ['E5', 0.15], ['C5', 0.15], ['A4', 0.15], ['A4', 0.15],
];

const TetrisMusic = {
  ctx: null,
  masterGain: null,
  playing: false,
  enabled: true,
  loopTimer: null,
  melodyDuration: 0,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    this.melodyDuration = KOROBEINIKI.reduce((sum, [, dur]) => sum + dur * TEMPO_SCALE, 0);
  },

  setAudible(audible) {
    if (!this.masterGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(audible ? 1 : 0, t);
  },

  playNote(freq, startTime, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  },

  scheduleMelody(startAt) {
    let t = startAt;
    for (const [note, dur] of KOROBEINIKI) {
      const scaled = dur * TEMPO_SCALE;
      this.playNote(NOTE_FREQ[note], t, scaled);
      t += scaled;
    }
    return t;
  },

  async start() {
    if (!this.enabled) return;
    this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.setAudible(true);
    if (this.playing) return;

    this.playing = true;
    const loop = () => {
      if (!this.playing) return;
      const startAt = this.ctx.currentTime + 0.05;
      this.scheduleMelody(startAt);
      this.loopTimer = setTimeout(loop, this.melodyDuration * 1000);
    };
    loop();
  },

  stop() {
    this.playing = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.setAudible(false);
  },

  pause() {
    this.stop();
  },

  toggle(shouldPlayNow = false) {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    } else if (shouldPlayNow) {
      this.start();
    }
    return this.enabled;
  },

  isEnabled() {
    return this.enabled;
  },
};
