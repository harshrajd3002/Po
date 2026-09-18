// ============================================================
// js/main.js — Section Renderers · Init Sequence
// ============================================================
// Depends on: data.js → portfolioData
//             animations.js → TextScramble, Typewriter,
//                             initScrollReveal, initTimelineDraw

// ---- SVG Icon Registry ------------------------------------
const ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,

  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,

  figma: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51c-1.665 0-3.019 1.355-3.019 3.019 0 1.665 1.355 3.019 3.019 3.019 1.665 0 3.019-1.355 3.019-3.019v-3.019H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-.098z"/></svg>`,

  mail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,

  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="m8 11 4 4 4-4"/><path d="M3 19h18"/></svg>`,

  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,

  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="scroll-arrow"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
};

// ---- Helpers -----------------------------------------------
function el(tag, cls, html) {
  const d = document.createElement(tag);
  if (cls)  d.className   = cls;
  if (html) d.innerHTML   = html;
  return d;
}

function tagsHtml(tags = []) {
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}

function sectionHeader(num, title) {
  return `
    <div class="section-header" data-animate="fade-in">
      <span class="section-num">${num}</span>
      <span class="section-rule" role="presentation"></span>
      <h2 class="section-title">${title}</h2>
    </div>`;
}

// ---- Section Renderers ------------------------------------

function renderHome() {
  const s  = document.getElementById('home');
  const d  = portfolioData.home;
  if (!s)  return;

  const nameParts = d.name.split(' ');
  const nameLinesHtml = nameParts.map(p =>
    `<span class="line" data-scramble-part="${p}">${p}</span>`
  ).join('');

  s.innerHTML = `
    <div class="container">
      <div class="hero__inner">

        ${d.availableForWork ? `
        <div class="hero__avail" data-animate="fade-in">
          <span class="avail-dot" aria-hidden="true"></span>
          <span>${d.availableText || 'Available for work'}</span>
        </div>` : ''}

        <p class="hero__greeting">${d.greeting}</p>

        <div class="hero__name-wrap">
          <h1 class="hero__name" id="heroName" aria-label="${d.name}">
            ${nameLinesHtml}
          </h1>
        </div>

        <div class="hero__role-wrap">
          <span class="hero__role-dash" aria-hidden="true"></span>
          <span class="hero__role" id="heroRole" aria-live="polite"></span>
          <span class="typing-cursor" aria-hidden="true"></span>
        </div>

        <p class="hero__tagline">${d.tagline.replace(/\n/g, '<br>')}</p>

        <div class="hero__scroll" aria-label="${d.scrollText}">
          <span class="scroll-line" aria-hidden="true"></span>
          <span>${d.scrollText}</span>
          ${ICONS.arrowDown}
        </div>

      </div>
    </div>`;

  // Start scramble on name after delay
  requestAnimationFrame(() => {
    const nameEl = document.getElementById('heroName');
    if (!nameEl) return;

    setTimeout(() => {
      const lines = nameEl.querySelectorAll('.line');
      lines.forEach((lineEl, i) => {
        const scrambler = new TextScramble(lineEl);
        setTimeout(() => scrambler.setText(lineEl.dataset.scramblePart), i * 200);
      });
    }, 500);

    // Start typewriter after scramble settles
    setTimeout(() => {
      const roleEl = document.getElementById('heroRole');
      if (roleEl && d.roles && d.roles.length) {
        const tw = new Typewriter(roleEl, d.roles, { pauseStart: 0 });
        tw.start();
      }
    }, 1400);
  });
}

function renderAbout() {
  const s = document.getElementById('about');
  const d = portfolioData.about;
  if (!s)  return;

  const hasPhoto = d.photo && d.photo.length > 0;
  const photoHtml = `
    <div class="about-photo-placeholder" aria-hidden="true">
      <span class="photo-initials">H.D.</span>
    </div>`;
  const imgHtml = hasPhoto
    ? `<img src="${d.photo}" alt="Harshraj Dodiya" class="about-photo" loading="lazy">`
    : photoHtml;


  const traitsHtml = (d.traits || []).map(t =>
    `<div class="trait-item" data-animate="fade-up">${t}</div>`
  ).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('02', 'About')}
      <div class="about-grid">

        <div class="about-photo-wrap" data-animate="slide-left">
          ${imgHtml}
        </div>

        <div class="about-content">
          <p class="about-headline" data-animate="fade-up">${d.headline.replace(/\n/g, '<br>')}</p>
          <p class="about-bio" data-animate="fade-up">${d.bio.replace(/\n\n/g, '</p><p class="about-bio" data-animate="fade-up">')}</p>
          <div class="traits-grid" data-stagger>
            ${traitsHtml}
          </div>
        </div>

      </div>
    </div>`;
}

function renderExperience() {
  const s = document.getElementById('experience');
  const d = portfolioData.experience || [];
  if (!s)  return;

  const itemsHtml = d.map(exp => `
    <div class="timeline__item" data-animate="fade-up">
      <div class="timeline__dot" aria-hidden="true"></div>
      <div class="timeline__meta">
        <span class="timeline__duration">${exp.duration}</span>
        <span class="timeline__type">${exp.type}</span>
      </div>
      <h3 class="timeline__company">${exp.company}</h3>
      <p class="timeline__role">${exp.role}${exp.location ? ` · ${exp.location}` : ''}</p>
      <p class="timeline__desc">${exp.description}</p>
      <div class="timeline__tags">${tagsHtml(exp.tags)}</div>
    </div>`).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('03', 'Experience')}
      <div class="timeline">
        <div class="timeline__line" aria-hidden="true">
          <div class="timeline__line-fill"></div>
        </div>
        <div class="timeline__items" data-stagger>
          ${itemsHtml}
        </div>
      </div>
    </div>`;
}

function renderEducation() {
  const s = document.getElementById('education');
  const d = portfolioData.education || [];
  if (!s)  return;

  const cardsHtml = d.map(edu => `
    <div class="edu-card" data-animate="scale-up">
      <p class="edu-year">${edu.year}</p>
      <h3 class="edu-institution">${edu.institution}</h3>
      <p class="edu-degree">${edu.degree}${edu.location ? ` · ${edu.location}` : ''}</p>
      ${edu.description ? `<p class="edu-desc">${edu.description}</p>` : ''}
    </div>`).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('04', 'Education')}
      <div class="edu-grid" data-stagger>
        ${cardsHtml}
      </div>
    </div>`;
}

function renderCertifications() {
  const s = document.getElementById('certifications');
  const d = portfolioData.certifications || [];
  if (!s) return;

  const cardsHtml = d.map(cert => {
    const initials = cert.issuer ? cert.issuer.charAt(0).toUpperCase() : '?';
    const badgeHtml = cert.image
      ? `<img src="${cert.image}" alt="${cert.issuer} badge" class="cert-card__badge-img" loading="lazy">`
      : `<span class="cert-card__badge-initials">${initials}</span>`;

    return `
      <div class="cert-card" data-animate="scale-up">
        <div class="cert-card__badge">${badgeHtml}</div>
        <div class="cert-card__body">
          <p class="cert-card__issuer">${cert.issuer}</p>
          <h3 class="cert-card__title">${cert.title}</h3>
          <p class="cert-card__date">${cert.date}</p>
        </div>
        ${cert.credentialUrl && cert.credentialUrl !== '#'
          ? `<a href="${cert.credentialUrl}" class="cert-card__verify"
               target="_blank" rel="noopener noreferrer"
               aria-label="Verify ${cert.title} certificate">
               Verify ${ICONS.arrowRight}
             </a>`
          : `<span class="cert-card__verify cert-card__verify--placeholder">Credential</span>`
        }
      </div>`;
  }).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('05', 'Certifications')}
      <div class="cert-grid" data-stagger>
        ${cardsHtml}
      </div>
    </div>`;
}

function renderSkills() {
  const s = document.getElementById('skills');
  const d = portfolioData.skills || [];
  if (!s)  return;

  const catsHtml = d.map(cat => `
    <div class="skill-category" data-animate="fade-up">
      <p class="skill-category__title">${cat.category}</p>
      <div class="skill-tags" data-stagger>
        ${cat.items.map(item => `<span class="tag">${item}</span>`).join('')}
      </div>
    </div>`).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('06', 'Skills')}
      <div class="skills-categories">
        ${catsHtml}
      </div>
    </div>`;
}

function renderProjects() {
  const s = document.getElementById('projects');
  const d = portfolioData.projects || [];
  if (!s)  return;

  const cardsHtml = d.map(proj => {
    const imgContent = proj.image
      ? `<img src="${proj.image}" alt="${proj.title}" loading="lazy">`
      : `<div class="project-card__img-inner" data-label="${proj.tags[0] || 'Project'}"></div>`;

    return `
      <article class="project-card" data-animate="fade-up">
        <div class="project-card__img">${imgContent}</div>
        <div class="project-card__body">
          <div class="project-card__tags">${tagsHtml(proj.tags)}</div>
          <h3 class="project-card__title">${proj.title}</h3>
          <p class="project-card__desc">${proj.description}</p>
          <a href="${proj.link}" class="project-card__link"
             target="${proj.link !== '#' ? '_blank' : '_self'}"
             rel="noopener noreferrer">
            View Case Study
            ${ICONS.arrowRight}
          </a>
        </div>
      </article>`;
  }).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('07', 'Projects')}
      <div class="projects-grid" data-stagger>
        ${cardsHtml}
      </div>
    </div>`;
}

function renderResume() {
  const s = document.getElementById('resume');
  const d = portfolioData.resume;
  if (!s)  return;

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('08', 'Resume')}
      <div class="resume__inner">
        <h2 class="resume__headline" data-animate="fade-up">${d.headline}</h2>
        <p class="resume__sub" data-animate="fade-up">${d.subtext}</p>
        <a href="${d.link}"
           class="btn-primary"
           download
           data-animate="scale-up"
           aria-label="Download resume PDF">
          ${ICONS.download}
          ${d.buttonText}
        </a>
        <p class="resume__note" data-animate="fade-in">${d.note}</p>
      </div>
    </div>`;
}

function renderContact() {
  const s = document.getElementById('contact');
  const d = portfolioData.contact;
  if (!s)  return;

  const socialsHtml = (d.social || []).map(soc => `
    <a href="${soc.url}"
       class="social-link"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="${soc.platform}">
      ${ICONS[soc.icon] || ''}
      <span>${soc.platform}</span>
    </a>`).join('');

  s.innerHTML = `
    <div class="container">
      ${sectionHeader('09', 'Contact')}
      <div class="contact__inner">
        <h2 class="contact__headline" data-animate="fade-up">${d.headline}</h2>
        <p class="contact__sub" data-animate="fade-up">${d.subtext}</p>
        <a href="mailto:${d.email}"
           class="contact__email"
           data-animate="fade-up"
           aria-label="Send email to ${d.email}">
          ${d.email}
        </a>
        <div class="contact__socials" data-stagger data-animate="fade-up">
          ${socialsHtml}
        </div>
      </div>
    </div>`;
}

function renderFooter() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;
}

// ---- Meta / SEO -------------------------------------------
function applyMeta() {
  const m = portfolioData.meta;
  document.title = m.siteTitle || 'Harshraj Dodiya — UI/UX Designer';
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', m.siteDescription || '');
}

// ---- Init --------------------------------------------------
function init() {
  document.body.classList.remove('js-loading');

  applyMeta();

  // Render all sections
  renderHome();
  renderAbout();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderSkills();

  renderProjects();
  renderResume();
  renderContact();
  renderFooter();

  // Init animations after render
  requestAnimationFrame(() => {
    initScrollReveal();
    initTimelineDraw();
  });
}

// Wait for Firestore data before rendering so all visitors
// always see the latest published content, not just defaults.
document.addEventListener('DOMContentLoaded', () => {
  // _portfolioDataReady is set by data.js — resolves once
  // Firestore (or cache/default fallback) data is ready.
  const ready = window._portfolioDataReady || Promise.resolve(portfolioData);
  ready.then(() => init());
});

// Expose for admin panel live preview
window.portfolioRerender = init;
