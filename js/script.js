/**
 * 11:11 — A Beautiful Coincidence
 * Master Interactive Script for Divya Shree's Birthday Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initPetals();
  initSparkles();
  initConfetti();
  initWishButtons();
  initPhotoModal();
  initLetterActions();
  initSwitzerlandExperience();
  initPromiseSeal();
  initFinalSurpriseObserver();
  initReplay();
  initCardInteractions();
});

/* ==============================================================
   1. ENVELOPE EXPERIENCE
   ============================================================== */
function initEnvelope() {
  const envelopeScreen = document.getElementById('envelope-section');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('open-surprise-btn');
  const envelopeFlap = document.getElementById('envelope-flap');
  const envelopeLetter = document.getElementById('envelope-letter');
  const waxSeal = document.getElementById('wax-seal');
  const envelopeWrapper = document.getElementById('envelope-wrapper');

  let isOpened = false;

  const triggerOpen = () => {
    if (isOpened) return;
    isOpened = true;

    // 1. Play wax break sound & animation
    if (waxSeal) waxSeal.style.transform = 'scale(1.25) rotate(15deg)';
    
    // 2. Open flap
    if (envelopeFlap) envelopeFlap.classList.add('flap-opened');

    // 3. Slide letter up
    setTimeout(() => {
      if (envelopeLetter) envelopeLetter.classList.add('slide-out');
      // Confetti burst on letter reveal
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.45);
    }, 450);

    // 4. Start romantic music if audio manager exists
    if (window.romanticAudio && !window.romanticAudio.isPlaying) {
      window.romanticAudio.play();
    }

    // 5. Reveal main content & scroll
    setTimeout(() => {
      if (envelopeScreen) envelopeScreen.classList.add('opened');
      if (mainContent) {
        mainContent.classList.remove('main-content-hidden');
        mainContent.classList.add('main-content-revealed');
      }

      // Smooth scroll to hero section
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Second celebratory confetti burst
      setTimeout(() => {
        fireConfetti(window.innerWidth * 0.3, window.innerHeight * 0.3);
        fireConfetti(window.innerWidth * 0.7, window.innerHeight * 0.3);
      }, 600);
    }, 1400);
  };

  if (openBtn) openBtn.addEventListener('click', triggerOpen);
  if (waxSeal) waxSeal.addEventListener('click', triggerOpen);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerOpen);
}

/* ==============================================================
   2. FLOATING PETALS CANVAS
   ============================================================== */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalCount = window.innerWidth < 600 ? 24 : 45;
  const petals = [];
  const petalColors = [
    'rgba(244, 194, 215, 0.75)', // Baby pink
    'rgba(251, 230, 240, 0.85)', // Soft blush
    'rgba(185, 163, 214, 0.55)', // Lavender
    'rgba(128, 0, 32, 0.45)',    // Sheer burgundy
    'rgba(246, 231, 161, 0.65)'  // Butter petal
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.2 - 0.4,
      speedY: Math.random() * 1.3 + 0.8,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      oscillation: Math.random() * Math.PI,
      oscSpeed: Math.random() * 0.02 + 0.01,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;

    // Organic petal shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size, -p.size * 1.5, -p.size * 1.5, p.size, 0, p.size * 1.8);
    ctx.bezierCurveTo(p.size * 1.5, p.size, p.size, -p.size * 1.5, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.oscillation += p.oscSpeed;
      p.x += p.speedX + Math.sin(p.oscillation) * 0.8;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==============================================================
   3. SPARKLES & CURSOR TRAIL CANVAS
   ============================================================== */
function initSparkles() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientSparkles = [];
  const ambientCount = 30;

  for (let i = 0; i < ambientCount; i++) {
    ambientSparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
    });
  }

  // Interactive cursor sparkle trail
  const trailSparkles = [];

  const addTrailPoint = (x, y) => {
    for (let k = 0; k < 2; k++) {
      trailSparkles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  };

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.3) {
      addTrailPoint(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && Math.random() > 0.4) {
      addTrailPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient sparkles
    for (let i = 0; i < ambientSparkles.length; i++) {
      const s = ambientSparkles[i];
      s.alpha += s.alphaSpeed;
      if (s.alpha >= 1 || s.alpha <= 0.1) {
        s.alphaSpeed = -s.alphaSpeed;
      }

      ctx.save();
      ctx.fillStyle = `rgba(246, 231, 161, ${s.alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw trail sparkles
    for (let j = trailSparkles.length - 1; j >= 0; j--) {
      const ts = trailSparkles[j];
      ts.x += ts.vx;
      ts.y += ts.vy;
      ts.alpha -= ts.decay;

      if (ts.alpha <= 0) {
        trailSparkles.splice(j, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = `rgba(244, 194, 215, ${ts.alpha})`;
      ctx.beginPath();
      ctx.arc(ts.x, ts.y, ts.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==============================================================
   4. CELEBRATION CONFETTI ENGINE
   ============================================================== */
let confettiParticles = [];
let confettiCtx = null;
let confettiWidth = 0;
let confettiHeight = 0;
let isConfettiLoopRunning = false;

function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  confettiCtx = canvas.getContext('2d');
  confettiWidth = canvas.width = window.innerWidth;
  confettiHeight = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    confettiWidth = canvas.width = window.innerWidth;
    confettiHeight = canvas.height = window.innerHeight;
  });
}

function fireConfetti(originX, originY, count = 75) {
  if (!confettiCtx) return;

  const colors = [
    '#800020', // Burgundy
    '#F4C2D7', // Baby Pink
    '#F6E7A1', // Butter Yellow
    '#B9A3D6', // Lavender
    '#708238', // Olive Green
    '#FFFFFF'  // Soft White
  ];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    const isHeart = Math.random() > 0.6;

    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.22,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      isHeart: isHeart
    });
  }

  if (!isConfettiLoopRunning) {
    isConfettiLoopRunning = true;
    requestAnimationFrame(updateConfetti);
  }
}

function updateConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0 || p.y > confettiHeight + 50) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.fillStyle = p.color;

    if (p.isHeart) {
      // Draw Heart Confetti
      const h = p.size * 0.7;
      confettiCtx.beginPath();
      confettiCtx.moveTo(0, 0);
      confettiCtx.bezierCurveTo(-h, -h, -h * 1.5, h * 0.5, 0, h * 1.5);
      confettiCtx.bezierCurveTo(h * 1.5, h * 0.5, h, -h, 0, 0);
      confettiCtx.fill();
    } else {
      // Draw Rectangle / Streamer Confetti
      confettiCtx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
    }

    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    requestAnimationFrame(updateConfetti);
  } else {
    isConfettiLoopRunning = false;
    confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);
  }
}

/* ==============================================================
   5. WISH BUTTONS & 11:11 DIALOG
   ============================================================== */
function initWishButtons() {
  const wishBtn = document.getElementById('wish-btn');
  const wishBadge = document.getElementById('wish-badge');

  const makeWish = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    fireConfetti(x, y, 90);

    // Show emotional toast alert
    showWishToast();
  };

  if (wishBtn) wishBtn.addEventListener('click', makeWish);
  if (wishBadge) wishBadge.addEventListener('click', makeWish);
}

function showWishToast() {
  let existingToast = document.getElementById('wish-toast-card');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'wish-toast-card';
  toast.innerHTML = `
    <div class="wish-toast-inner">
      <div class="wish-toast-icon">✨ 11:11 ✨</div>
      <h4 class="wish-toast-title">Your Birthday Wish Has Been Made</h4>
      <p class="wish-toast-body">
        "Divya, the universe heard you. And as Harsh, I promise to spend every day making sure your wishes, dreams, and quiet prayers come true. Happy Birthday, my Rasamalai!"
      </p>
      <button class="wish-toast-close" onclick="this.parentElement.parentElement.remove()">Thank You ♥</button>
    </div>
  `;

  // Append styling for toast
  const style = document.createElement('style');
  style.textContent = `
    #wish-toast-card {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100000;
      background: rgba(255, 253, 248, 0.98);
      border: 2px solid var(--color-baby-pink);
      border-radius: 20px;
      padding: 2rem;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(128, 0, 32, 0.35);
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn {
      from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    .wish-toast-icon { font-size: 1.6rem; color: var(--color-burgundy); font-weight: 700; margin-bottom: 0.5rem; }
    .wish-toast-title { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-burgundy); margin-bottom: 0.75rem; }
    .wish-toast-body { font-size: 0.95rem; color: var(--color-chocolate-brown); line-height: 1.6; margin-bottom: 1.5rem; }
    .wish-toast-close { background: var(--color-burgundy); color: #fff; border: none; padding: 0.6rem 1.8rem; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    .wish-toast-close:hover { transform: scale(1.05); }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
}

/* ==============================================================
   6. PHOTO PREVIEW MODAL & PERSISTENT INDEXEDDB STORAGE
   ============================================================== */
const PhotoDB = {
  dbName: 'DivyaBirthdayPhotosDB',
  storeName: 'photos',
  db: null,

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(this.dbName, 2);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => resolve(null);
    });
  },

  async save(key, dataUrl) {
    if (!this.db) await this.init();
    if (!this.db) {
      try { localStorage.setItem(key, dataUrl); } catch(e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([this.storeName], 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put(dataUrl, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        resolve(false);
      }
    });
  },

  async get(key) {
    if (!this.db) await this.init();
    if (!this.db) {
      try { return localStorage.getItem(key); } catch(e) { return null; }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([this.storeName], 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }
};

function optimizeImageForPolaroid(file, maxDim = 1200, quality = 0.88) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

async function initPhotoModal() {
  await PhotoDB.init();

  // 1. Immediately restore any saved photos from IndexedDB/localStorage
  for (let i = 1; i <= 11; i++) {
    const imgSlot = document.getElementById(`img-slot-${i}`);
    if (imgSlot) {
      try {
        const saved = await PhotoDB.get(`divya_photo_slot_${i}`);
        if (saved) {
          imgSlot.src = saved;
        }
      } catch (e) {
        // Safe fallback
      }
    }
  }

  const toggleBtn = document.getElementById('toggle-photo-modal-btn');
  const modal = document.getElementById('photo-modal');
  const closeBtn = document.getElementById('close-modal-btn');

  if (toggleBtn && modal) {
    toggleBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Click outside to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Handle local file inputs for slots 1-11 with persistent storage
  for (let i = 1; i <= 11; i++) {
    const input = document.getElementById(`slot-input-${i}`);
    const imgSlot = document.getElementById(`img-slot-${i}`);

    if (input && imgSlot) {
      input.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const optimizedDataUrl = await optimizeImageForPolaroid(file);
          if (optimizedDataUrl) {
            imgSlot.src = optimizedDataUrl;
            await PhotoDB.save(`divya_photo_slot_${i}`, optimizedDataUrl);
          }
        }
      });
    }
  }

  // Enable direct clicking on any polaroid card to trigger instant file picker
  document.querySelectorAll('.polaroid-item').forEach((item) => {
    item.addEventListener('click', () => {
      const slotIndex = item.getAttribute('data-index');
      const input = document.getElementById(`slot-input-${slotIndex}`);
      if (input) {
        input.click();
      }
    });
  });
}

/* ==============================================================
   7. LETTER ACTIONS (Copy & Print)
   ============================================================== */
function initLetterActions() {
  const copyBtn = document.getElementById('copy-letter-btn');
  const printBtn = document.getElementById('print-letter-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const letterBody = document.querySelector('.parchment-letter');
      if (!letterBody) return;

      const text = letterBody.innerText.replace('Save as Keepsake', '').replace('Copy Letter', '').trim();
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '<span>✓ Copied with love!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<span>📋 Copy Letter</span>';
        }, 2500);
      }).catch(() => {
        alert('Letter text ready to share with Divya!');
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==============================================================
   8. SWITZERLAND EXPERIENCE & BOARDING PASS
   ============================================================== */
function initSwitzerlandExperience() {
  const goBtn = document.getElementById('go-there-btn');
  const boardingPass = document.getElementById('boarding-pass-card');

  if (goBtn && boardingPass) {
    goBtn.addEventListener('click', (e) => {
      boardingPass.classList.remove('hidden');
      goBtn.innerHTML = '<span>Ticket Issued for Two! ✈️</span>';
      
      const rect = goBtn.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top, 80);

      // Smooth scroll slightly down to center boarding pass
      boardingPass.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/* ==============================================================
   9. PROMISE SEAL INTERACTION
   ============================================================== */
function initPromiseSeal() {
  const sealBtn = document.getElementById('seal-promise-btn');
  const sealedMsg = document.getElementById('promise-sealed-msg');

  if (sealBtn && sealedMsg) {
    sealBtn.addEventListener('click', (e) => {
      sealedMsg.classList.remove('hidden');
      sealBtn.style.display = 'none';

      const rect = sealedMsg.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top, 100);
    });
  }
}

/* ==============================================================
   10. FINAL SURPRISE OBSERVER & SEQUENTIAL REVEAL
   ============================================================== */
function initFinalSurpriseObserver() {
  const finalSection = document.getElementById('final-surprise-section');
  const messages = document.querySelectorAll('.reveal-message');
  const finalActions = document.getElementById('final-actions-wrap');

  if (!finalSection || messages.length === 0) return;

  let hasTriggered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTriggered) {
        hasTriggered = true;
        
        // Sequentially reveal messages
        messages.forEach((msg, idx) => {
          setTimeout(() => {
            msg.classList.add('visible');

            // Fire heart confetti on final "I LOVE YOU, MY RASAMALAI."
            if (idx === messages.length - 1) {
              fireConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 120);
              if (finalActions) {
                setTimeout(() => {
                  finalActions.classList.add('visible');
                }, 800);
              }
            }
          }, idx * 1400);
        });
      }
    });
  }, { threshold: 0.4 });

  observer.observe(finalSection);
}

/* ==============================================================
   11. REPLAY EXPERIENCE
   ============================================================== */
function initReplay() {
  const replayBtn = document.getElementById('replay-btn');
  if (!replayBtn) return;

  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Optionally re-close envelope
    setTimeout(() => {
      const envelopeScreen = document.getElementById('envelope-section');
      const envelopeFlap = document.getElementById('envelope-flap');
      const envelopeLetter = document.getElementById('envelope-letter');
      const mainContent = document.getElementById('main-content');

      if (envelopeScreen) envelopeScreen.classList.remove('opened');
      if (envelopeFlap) envelopeFlap.classList.remove('flap-opened');
      if (envelopeLetter) envelopeLetter.classList.remove('slide-out');
      if (mainContent) {
        mainContent.classList.add('main-content-hidden');
        mainContent.classList.remove('main-content-revealed');
      }
    }, 800);
  });
}

/* ==============================================================
   12. CARD MICRO-INTERACTIONS
   ============================================================== */
function initCardInteractions() {
  const cards = document.querySelectorAll('.personality-card, .favorite-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Little heart burst on click
      const rect = card.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    });
  });
}
