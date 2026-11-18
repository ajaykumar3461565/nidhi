const beginButton = document.querySelector('#begin');
beginButton.addEventListener('click', () => document.querySelector('#invitation').scrollIntoView({ behavior: 'smooth' }));

// A brief, self-contained title sequence. The content remains usable if motion is reduced.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  const loader = document.createElement('div');
  loader.className = 'intro-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = '<span class="loader-mark">for Nidhi</span>';
  for (let i = 0; i < 28; i++) {
    const particle = document.createElement('i');
    particle.className = 'loader-particle';
    particle.style.setProperty('--x', `${8 + Math.random() * 84}%`);
    particle.style.setProperty('--y', `${15 + Math.random() * 78}%`);
    particle.style.setProperty('--dur', `${2.4 + Math.random() * 2.6}s`);
    particle.style.setProperty('--delay', `${Math.random() * 1.8}s`);
    loader.append(particle);
  }
  document.body.append(loader);
  window.setTimeout(() => loader.classList.add('is-gone'), 1150);
  window.setTimeout(() => loader.remove(), 2300);
}

let characterIndex = 0;
document.querySelectorAll('.hero-title > span, .hero-title > em').forEach(line => {
  line.classList.add('hero-line');
  const letters = [...line.textContent];
  line.textContent = '';
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.className = letter === ' ' ? 'hero-space' : 'hero-char';
    span.style.setProperty('--i', characterIndex++);
    span.textContent = letter === ' ' ? '\u00a0' : letter;
    line.append(span);
  });
});

const glow = document.querySelector('.cursor-glow');
let pointerX = 0, pointerY = 0, framePending = false;
window.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  pointerX = event.clientX; pointerY = event.clientY;
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(() => {
      glow.style.left = `${pointerX}px`; glow.style.top = `${pointerY}px`; glow.style.opacity = '1';
      framePending = false;
    });
  }
}, { passive: true });
window.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });

const observed = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('in-view', 'motion-in');
    if (entry.target.id === 'keepsake' && !reducedMotion) {
      for (let i = 0; i < 12; i++) {
        const heart = document.createElement('span');
        heart.className = 'final-particle';
        heart.setAttribute('aria-hidden', 'true');
        heart.textContent = i % 3 === 0 ? '♥' : '✳';
        heart.style.setProperty('--x', `${3 + Math.random() * 94}%`);
        heart.style.setProperty('--delay', `${Math.random() * 5}s`);
        heart.style.setProperty('--size', `${8 + Math.random() * 11}px`);
        entry.target.append(heart);
      }
    }
    observed.unobserve(entry.target);
  }
}), { threshold: .16 });
document.querySelectorAll('main > section:not(.hero)').forEach(section => observed.observe(section));

// Magnetic response and gentle 3D tilt are desktop-only, avoiding touch scroll interference.
if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.enter-button,.play-button,.quality,.promise-item').forEach(element => {
    element.addEventListener('pointermove', event => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) / box.width;
      const y = (event.clientY - box.top - box.height / 2) / box.height;
      element.style.setProperty('--magnet-x', `${x * 7}px`);
      element.style.setProperty('--magnet-y', `${y * 6}px`);
      if (element.classList.contains('quality')) {
        element.style.transform = `translate3d(${x * 7}px,${y * 6}px,0) rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`;
      }
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--magnet-x', '0px');
      element.style.setProperty('--magnet-y', '0px');
      element.style.removeProperty('transform');
    });
  });
}

let scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--scroll-progress', maxScroll > 0 ? (scrollY / maxScroll).toFixed(4) : 0);
    scrollTick = false;
  });
}, { passive: true });

const reveal = document.querySelector('#qualityReveal');
document.querySelectorAll('.quality').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.quality').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  reveal.classList.add('is-changing');
  window.setTimeout(() => reveal.classList.remove('is-changing'), 30);
  window.setTimeout(() => { reveal.textContent = button.dataset.message; }, 180);
}));

const surpriseButton = document.querySelector('#surpriseButton');
const surpriseMessage = document.querySelector('#surpriseMessage');
let pressTimer;
function startSurprise() {
  surpriseButton.classList.add('holding');
  pressTimer = window.setTimeout(() => {
    surpriseMessage.classList.add('show');
    surpriseButton.querySelector('.touch-label').textContent = 'A HUG, JUST FOR YOU';
  }, 1100);
}
function stopSurprise() {
  surpriseButton.classList.remove('holding');
  window.clearTimeout(pressTimer);
}
surpriseButton.addEventListener('pointerdown', startSurprise);
['pointerup', 'pointerleave', 'pointercancel'].forEach(name => surpriseButton.addEventListener(name, stopSurprise));
surpriseButton.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') startSurprise(); });
surpriseButton.addEventListener('keyup', stopSurprise);

const portrait = document.querySelector('#portrait');
const photoPlaceholder = document.querySelector('#photoPlaceholder');
portrait.addEventListener('load', () => { portrait.hidden = false; photoPlaceholder.hidden = true; });
portrait.addEventListener('error', () => { portrait.hidden = true; photoPlaceholder.hidden = false; });
if (portrait.complete && portrait.naturalWidth) { portrait.hidden = false; photoPlaceholder.hidden = true; }

const audio = document.querySelector('#audio');
const playButton = document.querySelector('#playButton');
const seek = document.querySelector('#seek');
const volume = document.querySelector('#volume');
const audioStatus = document.querySelector('#audioStatus');
const durationLabel = document.querySelector('#duration');
const currentLabel = document.querySelector('#currentTime');
const musicOrb = document.querySelector('.music-orb');
const trackName = document.querySelector('#trackName');
const formatTime = value => Number.isFinite(value) ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}` : '0:00';
audio.volume = Number(volume.value);
audio.addEventListener('loadedmetadata', () => {
  durationLabel.textContent = formatTime(audio.duration);
  seek.max = Math.floor(audio.duration || 0);
  audioStatus.textContent = 'A little song, chosen with love.';
  trackName.textContent = 'Reeshma magical Puttamalli vibe';
});
audio.addEventListener('timeupdate', () => {
  seek.value = Math.floor(audio.currentTime);
  currentLabel.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('play', () => {
  playButton.textContent = 'Ⅱ';
  playButton.setAttribute('aria-label', 'Pause song');
  musicOrb.classList.add('playing');
});
audio.addEventListener('pause', () => {
  playButton.textContent = '▶';
  playButton.setAttribute('aria-label', 'Play song');
  musicOrb.classList.remove('playing');
});
audio.addEventListener('ended', () => { audio.currentTime = 0; });
audio.addEventListener('error', () => {
  audioStatus.innerHTML = 'Place your song at <code>assets/nidhi-song.mp3</code> to play it here.';
  trackName.textContent = 'Your song will live here';
});
playButton.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); }
    catch { audioStatus.innerHTML = 'Add your song at <code>assets/nidhi-song.mp3</code>, then press play.'; }
  } else audio.pause();
});
seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value); });
volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
