/**
 * Romantic Audio Controller
 * Handles background music with automatic fallback to Web Audio API synthesized piano/music box melody.
 */

class RomanticAudio {
  constructor() {
    this.audioEl = new Audio();
    this.audioEl.src = 'assets/music/song.mp3';
    this.audioEl.loop = true;
    this.hasCustomMp3 = false;
    this.isPlaying = false;
    this.synthInterval = null;
    this.audioCtx = null;
    this.masterGain = null;
    
    // Check if MP3 exists
    this.audioEl.addEventListener('canplaythrough', () => {
      this.hasCustomMp3 = true;
    });
    this.audioEl.addEventListener('error', () => {
      this.hasCustomMp3 = false;
    });

    this.initUI();
  }

  initUI() {
    this.playBtn = document.getElementById('music-toggle');
    this.musicPill = document.getElementById('music-player');
    this.vinyl = document.getElementById('music-vinyl');
    this.statusText = document.getElementById('music-status');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.toggle());
    }
  }

  initSynth() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.audioCtx = new AudioContext();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.28, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);
  }

  playPianoNote(freq, time, duration = 1.6, velocity = 0.5) {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    
    // Main warm oscillator (combination of sine & triangle)
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2, time); // 1st harmonic chime

    // Lowpass filter for warm, dreamy piano vibe
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration);

    // Natural piano ADSR
    const now = time;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.45, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.25, now + 0.3);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  startRomanticProgression() {
    this.initSynth();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Frequencies (Hz): D4, F#4, A4, C#5, E5, B4, G4, etc.
    // Dmaj9 -> Bm7 -> Gmaj7 -> Asus4
    const chords = [
      // Dmaj9
      [293.66, 369.99, 440.00, 554.37, 659.25],
      // F#m7
      [369.99, 440.00, 554.37, 659.25],
      // Gmaj7
      [392.00, 493.88, 587.33, 739.99],
      // Asus4 -> A
      [440.00, 587.33, 659.25, 880.00]
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isPlaying || this.hasCustomMp3) return;
      const now = this.audioCtx.currentTime;
      const chord = chords[chordIdx % chords.length];
      
      // Arpeggiate softly
      chord.forEach((note, i) => {
        const arpeggioDelay = i * 0.18;
        this.playPianoNote(note, now + arpeggioDelay, 2.4, 0.45);
      });

      // Add high romantic sparkle bell note
      if (Math.random() > 0.3) {
        const bellNotes = [880.00, 987.77, 1108.73, 1174.66, 1318.51];
        const bell = bellNotes[Math.floor(Math.random() * bellNotes.length)];
        this.playPianoNote(bell, now + 1.2, 1.8, 0.22);
      }

      chordIdx++;
    };

    playNextChord();
    this.synthInterval = setInterval(playNextChord, 3200);
  }

  stopRomanticProgression() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  play() {
    this.isPlaying = true;
    if (this.hasCustomMp3) {
      this.audioEl.play().catch(() => {
        // Fallback to synth if autoplay blocked
        this.startRomanticProgression();
      });
    } else {
      this.startRomanticProgression();
    }
    this.updateUI(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.hasCustomMp3) {
      this.audioEl.pause();
    }
    this.stopRomanticProgression();
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI(isPlaying) {
    if (this.vinyl) {
      if (isPlaying) {
        this.vinyl.classList.add('playing');
      } else {
        this.vinyl.classList.remove('playing');
      }
    }
    if (this.playBtn) {
      this.playBtn.innerHTML = isPlaying 
        ? '<span class="icon">⏸</span><span>Pause</span>' 
        : '<span class="icon">▶</span><span>Play</span>';
      this.playBtn.setAttribute('aria-label', isPlaying ? 'Pause Music' : 'Play Music');
    }
    if (this.statusText) {
      if (this.hasCustomMp3) {
        this.statusText.textContent = isPlaying ? 'Playing: Our Special Song 🎶' : 'Music Paused';
      } else {
        this.statusText.textContent = isPlaying ? 'Playing: 11:11 Melody 🎶' : 'Music Paused';
      }
    }
  }
}

window.romanticAudio = null;
document.addEventListener('DOMContentLoaded', () => {
  window.romanticAudio = new RomanticAudio();
});
