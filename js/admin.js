// ============================================================
// js/admin.js — Admin Panel: Login · Tabs · Forms · Save
// ============================================================
// Depends on: data.js → portfolioData, saveData, exportData,
//                        importData, resetData, DEFAULT_DATA

(function () {
  'use strict';

  // ---- State -----------------------------------------------
  let workingData = null;   // deep copy of portfolioData for editing
  let activePanel = 'meta'; // current tab id

  // ---- DOM refs --------------------------------------------
  const loginScreen  = document.getElementById('adminLogin');
  const adminLayout  = document.getElementById('adminLayout');
  const loginForm    = document.getElementById('loginForm');
  const loginError   = document.getElementById('loginError');
  const pwInput      = document.getElementById('adminPassword');
  const toast        = document.getElementById('adminToast');
  let   toastTimer   = null;

  // ---- Boot ------------------------------------------------
  function boot() {
    if (!loginScreen) return;
    const sessionValid = sessionStorage.getItem('admin_auth') === '1';
    if (sessionValid) enterAdmin();
  }

  // ---- Login -----------------------------------------------
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const pw       = pwInput.value;
      const correct  = (portfolioData.meta && portfolioData.meta.password) || 'harshraj@admin';
      if (pw === correct) {
        sessionStorage.setItem('admin_auth', '1');
        loginError.classList.remove('is-visible');
        enterAdmin();
      } else {
        loginError.classList.add('is-visible');
        pwInput.value = '';
        pwInput.focus();
      }
    });
  }

  function enterAdmin() {
    const ready = window._portfolioDataReady || Promise.resolve(portfolioData);
    ready.then(() => {
      workingData = JSON.parse(JSON.stringify(portfolioData));
      loginScreen.style.display  = 'none';
      adminLayout.classList.add('is-visible');
      buildSidebar();
      switchPanel(activePanel);
    });
  }

  // ---- Sidebar nav -----------------------------------------
  const NAV_ITEMS = [
    { id: 'meta',            label: 'Site Settings',  icon: settingsIcon()  },
    { id: 'home',            label: 'Home',            icon: homeIcon()      },
    { id: 'about',           label: 'About',           icon: userIcon()      },
    { id: 'experience',      label: 'Experience',      icon: briefcaseIcon() },
    { id: 'education',       label: 'Education',       icon: bookIcon()      },
    { id: 'certifications',  label: 'Certifications',  icon: certIcon()      },
    { id: 'skills',          label: 'Skills',          icon: starIcon()      },
    { id: 'projects',        label: 'Projects',        icon: gridIcon()      },
    { id: 'resume',          label: 'Resume',          icon: downloadIcon()  },
    { id: 'contact',         label: 'Contact',         icon: mailIcon()      },
  ];

  function buildSidebar() {
    const nav = document.getElementById('adminNav');
    if (!nav) return;
    nav.innerHTML = NAV_ITEMS.map(item => `
      <button class="admin-nav-item ${item.id === activePanel ? 'is-active' : ''}"
              data-panel="${item.id}"
              type="button">
        ${item.icon}
        ${item.label}
      </button>`).join('');

    nav.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });
  }

  function switchPanel(id) {
    activePanel = id;
    // Update sidebar
    document.querySelectorAll('.admin-nav-item').forEach(b =>
      b.classList.toggle('is-active', b.dataset.panel === id)
    );
    // Show/hide panels
    document.querySelectorAll('.admin-panel').forEach(p =>
      p.classList.toggle('is-active', p.id === `panel-${id}`)
    );
    // Render panel content
    renderPanel(id);
  }

  function renderPanel(id) {
    const panel = document.getElementById(`panel-${id}`);
    if (!panel) return;

    switch (id) {
      case 'meta':            renderMeta(panel);            break;
      case 'home':            renderHomePanel(panel);       break;
      case 'about':           renderAboutPanel(panel);      break;
      case 'experience':      renderExpPanel(panel);        break;
      case 'education':       renderEduPanel(panel);        break;
      case 'certifications':  renderCertPanel(panel);       break;
      case 'skills':          renderSkillsPanel(panel);     break;
      case 'projects':        renderProjectsPanel(panel);   break;
      case 'resume':          renderResumePanel(panel);     break;
      case 'contact':         renderContactPanel(panel);    break;
    }
  }

  // ---- Panel: Meta / Site Settings ------------------------
  function renderMeta(panel) {
    const d = workingData.meta;
    panel.innerHTML = `
      ${panelHeader('Site Settings', 'Password, site title, description.')}
      <div class="form-group">
        ${label('Site Title')}
        <input class="form-input" id="meta-siteTitle" value="${esc(d.siteTitle)}" placeholder="Your Name — Role">
      </div>
      <div class="form-group">
        ${label('Meta Description (SEO)')}
        <input class="form-input" id="meta-siteDescription" value="${esc(d.siteDescription)}" placeholder="Short description for search engines">
      </div>
      <div class="form-group">
        ${label('Admin Password')}
        <input class="form-input" type="password" id="meta-password" value="${esc(d.password)}" placeholder="Set new password">
        <p style="font-size:0.72rem;color:var(--text-muted);margin-top:0.4rem;">
          You will need to log in again after changing this.
        </p>
      </div>
      ${saveBar('meta')}`;
  }

  // ---- Panel: Home -----------------------------------------
  function renderHomePanel(panel) {
    const d = workingData.home;
    panel.innerHTML = `
      ${panelHeader('Home Section', 'Hero area — name, roles, tagline.')}
      <div class="form-row">
        <div class="form-group">
          ${label('Greeting Text')}
          <input class="form-input" id="home-greeting" value="${esc(d.greeting)}">
        </div>
        <div class="form-group">
          ${label('Your Full Name')}
          <input class="form-input" id="home-name" value="${esc(d.name)}">
        </div>
      </div>
      <div class="form-group">
        ${label('Tagline')}
        <textarea class="form-textarea" id="home-tagline" rows="2">${esc(d.tagline)}</textarea>
      </div>
      <div class="form-group">
        ${label('Roles (press Enter to add)')}
        ${tagEditor('home-roles', d.roles)}
      </div>
      <div class="form-group">
        ${label('Available Text')}
        <input class="form-input" id="home-availableText" value="${esc(d.availableText)}">
      </div>
      <div class="form-group">
        <label class="form-checkbox-group">
          <input type="checkbox" class="form-checkbox" id="home-availableForWork" ${d.availableForWork ? 'checked' : ''}>
          <span class="form-label" style="margin:0">Show "Available for work" badge</span>
        </label>
      </div>
      <div class="form-group">
        ${label('Scroll Indicator Text')}
        <input class="form-input" id="home-scrollText" value="${esc(d.scrollText)}">
      </div>
      ${saveBar('home')}`;
  }

  // ---- Panel: About ----------------------------------------
  function renderAboutPanel(panel) {
    const d = workingData.about;
    panel.innerHTML = `
      ${panelHeader('About Section', 'Bio, headline, traits, photo.')}
      <div class="form-group">
        ${label('Section Headline')}
        <textarea class="form-textarea" id="about-headline" rows="2">${esc(d.headline)}</textarea>
      </div>
      <div class="form-group">
        ${label('Bio (separate paragraphs with blank line)')}
        <textarea class="form-textarea" id="about-bio" rows="5">${esc(d.bio)}</textarea>
      </div>
      <div class="form-group">
        ${label('Photo URL (or relative path like assets/profile.jpg)')}
        <input class="form-input" id="about-photo" value="${esc(d.photo)}" placeholder="https://... or assets/profile.jpg">
      </div>
      <div class="form-group">
        ${label('Traits (press Enter to add)')}
        ${tagEditor('about-traits', d.traits)}
      </div>
      ${saveBar('about')}`;
  }

  // ---- Panel: Experience -----------------------------------
  function renderExpPanel(panel) {
    const d = workingData.experience || [];
    panel.innerHTML = `
      ${panelHeader('Experience', 'Work history entries.')}
      <div class="array-items" id="exp-items">
        ${d.map((exp, i) => expItemHtml(exp, i)).join('')}
      </div>
      <button class="btn-admin-add" id="exp-add" type="button">
        ${plusIcon()} Add Experience
      </button>
      ${saveBar('experience')}`;

    attachArrayItemHandlers('#exp-items', 'experience', expItemHtml, newExp);
    document.getElementById('exp-add').addEventListener('click', () => addArrayItem('experience', newExp(), expItemHtml));
  }

  function expItemHtml(exp, i) {
    return `
      <div class="array-item ${i === 0 ? 'is-expanded' : ''}" data-index="${i}">
        <div class="array-item__header">
          <div>
            <div class="array-item__title">${esc(exp.role) || 'New Role'}</div>
            <div class="array-item__subtitle">${esc(exp.company) || ''} · ${esc(exp.duration) || ''}</div>
          </div>
          <div class="array-item__controls">
            <button class="btn-icon danger" data-action="delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/><path d="M10 11v6m4-6v6"/></svg></button>
            <button class="btn-icon" data-action="toggle" title="Expand">
              <svg class="array-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
        <div class="array-item__body ${i === 0 ? 'is-open' : ''}">
          <div class="form-row">
            <div class="form-group">
              ${label('Company')}
              <input class="form-input" data-field="company" value="${esc(exp.company)}">
            </div>
            <div class="form-group">
              ${label('Role / Title')}
              <input class="form-input" data-field="role" value="${esc(exp.role)}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              ${label('Duration')}
              <input class="form-input" data-field="duration" value="${esc(exp.duration)}" placeholder="Jan 2024 — Present">
            </div>
            <div class="form-group">
              ${label('Type')}
              <input class="form-input" data-field="type" value="${esc(exp.type)}" placeholder="Full-time">
            </div>
          </div>
          <div class="form-group">
            ${label('Location')}
            <input class="form-input" data-field="location" value="${esc(exp.location)}" placeholder="Remote">
          </div>
          <div class="form-group">
            ${label('Description')}
            <textarea class="form-textarea" data-field="description" rows="3">${esc(exp.description)}</textarea>
          </div>
          <div class="form-group">
            ${label('Tags (press Enter to add)')}
            ${tagEditor(`exp-tags-${i}`, exp.tags, `data-field="tags" data-index="${i}"`)}
          </div>
        </div>
      </div>`;
  }

  function newExp() {
    return { id: `exp${Date.now()}`, company: '', role: '', type: 'Full-time', duration: '', location: '', description: '', tags: [] };
  }

  // ---- Panel: Education ------------------------------------
  function renderEduPanel(panel) {
    const d = workingData.education || [];
    panel.innerHTML = `
      ${panelHeader('Education', 'Degrees and certifications.')}
      <div class="array-items" id="edu-items">
        ${d.map((edu, i) => eduItemHtml(edu, i)).join('')}
      </div>
      <button class="btn-admin-add" id="edu-add" type="button">
        ${plusIcon()} Add Education
      </button>
      ${saveBar('education')}`;

    attachArrayItemHandlers('#edu-items', 'education', eduItemHtml, newEdu);
    document.getElementById('edu-add').addEventListener('click', () => addArrayItem('education', newEdu(), eduItemHtml));
  }

  // ---- Panel: Certifications --------------------------------
  function renderCertPanel(panel) {
    const d = workingData.certifications || [];
    panel.innerHTML = `
      ${panelHeader('Certifications', 'Courses, certificates, and credentials.')}
      <div class="array-items" id="cert-items">
        ${d.map((cert, i) => certItemHtml(cert, i)).join('')}
      </div>
      <button class="btn-admin-add" id="cert-add" type="button">
        ${plusIcon()} Add Certificate
      </button>
      ${saveBar('certifications')}`;

    attachArrayItemHandlers('#cert-items', 'certifications', certItemHtml, newCert);
    document.getElementById('cert-add').addEventListener('click', () => addArrayItem('certifications', newCert(), certItemHtml));
  }

  function certItemHtml(cert, i) {
    return `
      <div class="array-item ${i === 0 ? 'is-expanded' : ''}" data-index="${i}">
        <div class="array-item__header">
          <div>
            <div class="array-item__title">${esc(cert.title) || 'New Certificate'}</div>
            <div class="array-item__subtitle">${esc(cert.issuer) || ''} · ${esc(cert.date) || ''}</div>
          </div>
          <div class="array-item__controls">
            <button class="btn-icon danger" data-action="delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg></button>
            <button class="btn-icon" data-action="toggle" title="Expand">
              <svg class="array-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
        <div class="array-item__body ${i === 0 ? 'is-open' : ''}">
          <div class="form-row">
            <div class="form-group">
              ${label('Certificate / Course Title')}
              <input class="form-input" data-field="title" value="${esc(cert.title)}">
            </div>
            <div class="form-group">
              ${label('Issuing Organisation')}
              <input class="form-input" data-field="issuer" value="${esc(cert.issuer)}" placeholder="Google, Coursera, Udemy…">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              ${label('Year / Date')}
              <input class="form-input" data-field="date" value="${esc(cert.date)}" placeholder="2023">
            </div>
            <div class="form-group">
              ${label('Credential URL')}
              <input class="form-input" data-field="credentialUrl" value="${esc(cert.credentialUrl)}" placeholder="https://…">
            </div>
          </div>
          <div class="form-group">
            ${label('Badge / Logo Image URL (optional)')}
            <input class="form-input" data-field="image" value="${esc(cert.image)}" placeholder="https://…">
          </div>
        </div>
      </div>`;
  }

  function newCert() {
    return { id: `cert${Date.now()}`, title: '', issuer: '', date: '', credentialUrl: '#', image: '' };
  }

  function eduItemHtml(edu, i) {
    return `
      <div class="array-item ${i === 0 ? 'is-expanded' : ''}" data-index="${i}">
        <div class="array-item__header">
          <div>
            <div class="array-item__title">${esc(edu.institution) || 'New Institution'}</div>
            <div class="array-item__subtitle">${esc(edu.degree) || ''}</div>
          </div>
          <div class="array-item__controls">
            <button class="btn-icon danger" data-action="delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg></button>
            <button class="btn-icon" data-action="toggle" title="Expand">
              <svg class="array-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
        <div class="array-item__body ${i === 0 ? 'is-open' : ''}">
          <div class="form-row">
            <div class="form-group">
              ${label('Institution')}
              <input class="form-input" data-field="institution" value="${esc(edu.institution)}">
            </div>
            <div class="form-group">
              ${label('Degree')}
              <input class="form-input" data-field="degree" value="${esc(edu.degree)}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              ${label('Year')}
              <input class="form-input" data-field="year" value="${esc(edu.year)}" placeholder="2019 — 2023">
            </div>
            <div class="form-group">
              ${label('Location')}
              <input class="form-input" data-field="location" value="${esc(edu.location)}" placeholder="City, Country">
            </div>
          </div>
          <div class="form-group">
            ${label('Description')}
            <textarea class="form-textarea" data-field="description" rows="2">${esc(edu.description)}</textarea>
          </div>
        </div>
      </div>`;
  }

  function newEdu() {
    return { id: `edu${Date.now()}`, institution: '', degree: '', year: '', location: '', description: '' };
  }

  // ---- Panel: Skills ---------------------------------------
  function renderSkillsPanel(panel) {
    const d = workingData.skills || [];
    panel.innerHTML = `
      ${panelHeader('Skills', 'Skill categories and items.')}
      <div class="array-items" id="skills-items">
        ${d.map((cat, i) => skillCatHtml(cat, i)).join('')}
      </div>
      <button class="btn-admin-add" id="skills-add" type="button">
        ${plusIcon()} Add Category
      </button>
      ${saveBar('skills')}`;

    attachArrayItemHandlers('#skills-items', 'skills', skillCatHtml, newSkillCat);
    document.getElementById('skills-add').addEventListener('click', () => addArrayItem('skills', newSkillCat(), skillCatHtml));
  }

  function skillCatHtml(cat, i) {
    return `
      <div class="array-item is-expanded" data-index="${i}">
        <div class="array-item__header">
          <div>
            <div class="array-item__title">${esc(cat.category) || 'New Category'}</div>
            <div class="array-item__subtitle">${(cat.items || []).join(', ')}</div>
          </div>
          <div class="array-item__controls">
            <button class="btn-icon danger" data-action="delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg></button>
            <button class="btn-icon" data-action="toggle" title="Expand">
              <svg class="array-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
        <div class="array-item__body is-open">
          <div class="form-group">
            ${label('Category Name')}
            <input class="form-input" data-field="category" value="${esc(cat.category)}">
          </div>
          <div class="form-group">
            ${label('Skills (press Enter to add)')}
            ${tagEditor(`skill-items-${i}`, cat.items, `data-field="items" data-index="${i}"`)}
          </div>
        </div>
      </div>`;
  }

  function newSkillCat() {
    return { category: '', items: [] };
  }

  // ---- Panel: Projects -------------------------------------
  function renderProjectsPanel(panel) {
    const d = workingData.projects || [];
    panel.innerHTML = `
      ${panelHeader('Projects', 'Showcase entries — title, description, tags, link, image.')}
      <div class="array-items" id="projects-items">
        ${d.map((proj, i) => projItemHtml(proj, i)).join('')}
      </div>
      <button class="btn-admin-add" id="projects-add" type="button">
        ${plusIcon()} Add Project
      </button>
      ${saveBar('projects')}`;

    attachArrayItemHandlers('#projects-items', 'projects', projItemHtml, newProj);
    document.getElementById('projects-add').addEventListener('click', () => addArrayItem('projects', newProj(), projItemHtml));
  }

  function projItemHtml(proj, i) {
    return `
      <div class="array-item ${i === 0 ? 'is-expanded' : ''}" data-index="${i}">
        <div class="array-item__header">
          <div>
            <div class="array-item__title">${esc(proj.title) || 'New Project'}</div>
            <div class="array-item__subtitle">${(proj.tags || []).join(', ')}</div>
          </div>
          <div class="array-item__controls">
            <button class="btn-icon danger" data-action="delete" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/></svg></button>
            <button class="btn-icon" data-action="toggle" title="Expand">
              <svg class="array-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
        <div class="array-item__body ${i === 0 ? 'is-open' : ''}">
          <div class="form-group">
            ${label('Project Title')}
            <input class="form-input" data-field="title" value="${esc(proj.title)}">
          </div>
          <div class="form-group">
            ${label('Description')}
            <textarea class="form-textarea" data-field="description" rows="3">${esc(proj.description)}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              ${label('Case Study Link')}
              <input class="form-input" data-field="link" value="${esc(proj.link)}" placeholder="https://...">
            </div>
            <div class="form-group">
              ${label('Image URL')}
              <input class="form-input" data-field="image" value="${esc(proj.image)}" placeholder="https://...">
            </div>
          </div>
          <div class="form-group">
            ${label('Tags (press Enter to add)')}
            ${tagEditor(`proj-tags-${i}`, proj.tags, `data-field="tags" data-index="${i}"`)}
          </div>
        </div>
      </div>`;
  }

  function newProj() {
    return { id: `proj${Date.now()}`, title: '', description: '', tags: [], link: '#', image: '' };
  }

  // ---- Panel: Resume ---------------------------------------
  function renderResumePanel(panel) {
    const d = workingData.resume;
    panel.innerHTML = `
      ${panelHeader('Resume Section', 'Headline, description, download link.')}
      <div class="form-group">
        ${label('Section Headline')}
        <input class="form-input" id="resume-headline" value="${esc(d.headline)}">
      </div>
      <div class="form-group">
        ${label('Subtext')}
        <textarea class="form-textarea" id="resume-subtext" rows="2">${esc(d.subtext)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          ${label('Resume File / URL')}
          <input class="form-input" id="resume-link" value="${esc(d.link)}" placeholder="assets/resume.pdf or https://...">
        </div>
        <div class="form-group">
          ${label('Button Label')}
          <input class="form-input" id="resume-buttonText" value="${esc(d.buttonText)}">
        </div>
      </div>
      <div class="form-group">
        ${label('Note (e.g. "Last updated...")')}
        <input class="form-input" id="resume-note" value="${esc(d.note)}">
      </div>
      ${saveBar('resume')}`;
  }

  // ---- Panel: Contact --------------------------------------
  function renderContactPanel(panel) {
    const d = workingData.contact;
    const social = d.social || [];
    panel.innerHTML = `
      ${panelHeader('Contact Section', 'Headline, email, social links.')}
      <div class="form-group">
        ${label('Section Headline')}
        <input class="form-input" id="contact-headline" value="${esc(d.headline)}">
      </div>
      <div class="form-group">
        ${label('Subtext')}
        <textarea class="form-textarea" id="contact-subtext" rows="2">${esc(d.subtext)}</textarea>
      </div>
      <div class="form-group">
        ${label('Email Address')}
        <input class="form-input" id="contact-email" type="email" value="${esc(d.email)}">
      </div>
      <div class="form-group">
        ${label('LinkedIn URL')}
        <input class="form-input" id="contact-linkedin" value="${esc((social.find(s=>s.icon==='linkedin')||{}).url||'')}">
      </div>
      <div class="form-group">
        ${label('Instagram URL')}
        <input class="form-input" id="contact-instagram" value="${esc((social.find(s=>s.icon==='instagram')||{}).url||'')}">
      </div>
      <div class="form-group">
        ${label('Figma Profile URL')}
        <input class="form-input" id="contact-figma" value="${esc((social.find(s=>s.icon==='figma')||{}).url||'')}">
      </div>
      ${saveBar('contact')}`;
  }

  // ---- Save logic per section ------------------------------
  async function collectAndSave(sectionId) {
    collectSection(sectionId);
    showToast('Saving…', 'success');
    const ok = await saveData(workingData);
    // Reflect in global portfolioData
    Object.assign(portfolioData, JSON.parse(JSON.stringify(workingData)));
    showToast(ok ? 'Saved & published! All devices updated.' : 'Firestore save failed — check console.', ok ? 'success' : 'error');
  }

  function collectSection(id) {
    const g = (elId) => {
      const el = document.getElementById(elId);
      return el ? el.value : '';
    };
    const checked = (elId) => {
      const el = document.getElementById(elId);
      return el ? el.checked : false;
    };

    switch (id) {
      case 'meta':
        workingData.meta.siteTitle       = g('meta-siteTitle');
        workingData.meta.siteDescription = g('meta-siteDescription');
        workingData.meta.password        = g('meta-password') || workingData.meta.password;
        break;

      case 'home':
        workingData.home.greeting         = g('home-greeting');
        workingData.home.name             = g('home-name');
        workingData.home.tagline          = g('home-tagline');
        workingData.home.availableText    = g('home-availableText');
        workingData.home.scrollText       = g('home-scrollText');
        workingData.home.availableForWork = checked('home-availableForWork');
        workingData.home.roles            = getTagEditorValues('home-roles');
        break;

      case 'about':
        workingData.about.headline = g('about-headline');
        workingData.about.bio      = g('about-bio');
        workingData.about.photo    = g('about-photo');
        workingData.about.traits   = getTagEditorValues('about-traits');
        break;

      case 'experience':
        workingData.experience = collectArraySection('exp-items', (item, i) => {
          const tags = getTagEditorValues(`exp-tags-${i}`);
          return {
            id:          workingData.experience[i]?.id || `exp${i}`,
            company:     fieldVal(item, 'company'),
            role:        fieldVal(item, 'role'),
            type:        fieldVal(item, 'type'),
            duration:    fieldVal(item, 'duration'),
            location:    fieldVal(item, 'location'),
            description: fieldVal(item, 'description'),
            tags,
          };
        });
        break;

      case 'education':
        workingData.education = collectArraySection('edu-items', (item, i) => ({
          id:          workingData.education[i]?.id || `edu${i}`,
          institution: fieldVal(item, 'institution'),
          degree:      fieldVal(item, 'degree'),
          year:        fieldVal(item, 'year'),
          location:    fieldVal(item, 'location'),
          description: fieldVal(item, 'description'),
        }));
        break;

      case 'certifications':
        workingData.certifications = collectArraySection('cert-items', (item, i) => ({
          id:            workingData.certifications[i]?.id || `cert${i}`,
          title:         fieldVal(item, 'title'),
          issuer:        fieldVal(item, 'issuer'),
          date:          fieldVal(item, 'date'),
          credentialUrl: fieldVal(item, 'credentialUrl'),
          image:         fieldVal(item, 'image'),
        }));
        break;

      case 'skills':
        workingData.skills = collectArraySection('skills-items', (item, i) => ({
          category: fieldVal(item, 'category'),
          items:    getTagEditorValues(`skill-items-${i}`),
        }));
        break;

      case 'projects':
        workingData.projects = collectArraySection('projects-items', (item, i) => ({
          id:          workingData.projects[i]?.id || `proj${i}`,
          title:       fieldVal(item, 'title'),
          description: fieldVal(item, 'description'),
          link:        fieldVal(item, 'link'),
          image:       fieldVal(item, 'image'),
          tags:        getTagEditorValues(`proj-tags-${i}`),
        }));
        break;

      case 'resume':
        workingData.resume.headline   = g('resume-headline');
        workingData.resume.subtext    = g('resume-subtext');
        workingData.resume.link       = g('resume-link');
        workingData.resume.buttonText = g('resume-buttonText');
        workingData.resume.note       = g('resume-note');
        break;

      case 'contact': {
        workingData.contact.headline = g('contact-headline');
        workingData.contact.subtext  = g('contact-subtext');
        workingData.contact.email    = g('contact-email');
        const socials = workingData.contact.social;
        const set = (icon, val) => {
          const s = socials.find(s => s.icon === icon);
          if (s) s.url = val;
          else socials.push({ platform: icon.charAt(0).toUpperCase()+icon.slice(1), url: val, icon });
        };
        set('linkedin',  g('contact-linkedin'));
        set('instagram', g('contact-instagram'));
        set('figma',     g('contact-figma'));
        break;
      }
    }
  }

  // ---- Array helpers ---------------------------------------
  function collectArraySection(containerId, mapper) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll('.array-item')).map((item, i) => mapper(item, i));
  }

  function fieldVal(itemEl, field) {
    const el = itemEl.querySelector(`[data-field="${field}"]`);
    return el ? el.value : '';
  }

  function attachArrayItemHandlers(selector, sectionKey, renderFn, newFn) {
    const container = document.querySelector(selector);
    if (!container) return;

    container.addEventListener('click', e => {
      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn) return;
      const action = actionBtn.dataset.action;
      const item   = actionBtn.closest('.array-item');
      const index  = parseInt(item.dataset.index, 10);

      if (action === 'toggle') {
        item.classList.toggle('is-expanded');
        item.querySelector('.array-item__body').classList.toggle('is-open');
      }

      if (action === 'delete') {
        workingData[sectionKey].splice(index, 1);
        container.innerHTML = workingData[sectionKey].map(renderFn).join('');
        attachArrayItemHandlers(selector, sectionKey, renderFn, newFn);
      }
    });
  }

  function addArrayItem(sectionKey, newItem, renderFn) {
    workingData[sectionKey].push(newItem);
    const container = document.getElementById(`${sectionKey}-items`);
    if (!container) return;
    const i = workingData[sectionKey].length - 1;
    const div = document.createElement('div');
    div.innerHTML = renderFn(newItem, i);
    container.appendChild(div.firstElementChild);
  }

  // ---- Tag editor ------------------------------------------
  function tagEditor(id, values = [], extraAttr = '') {
    const tagsHtml = (values || []).map(v =>
      `<span class="tag-editor__tag">${esc(v)}<span class="tag-editor__remove" data-tag="${esc(v)}" title="Remove">×</span></span>`
    ).join('');

    return `
      <div class="tag-editor" id="${id}" ${extraAttr}>
        ${tagsHtml}
        <input class="tag-editor__input"
               placeholder="Type and press Enter…"
               aria-label="Add tag">
      </div>`;
  }

  // Bind tag editor events (delegated)
  document.addEventListener('click', e => {
    if (e.target.classList.contains('tag-editor__remove')) {
      e.target.closest('.tag-editor__tag').remove();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('tag-editor__input')) {
      e.preventDefault();
      const val     = e.target.value.trim();
      if (!val) return;
      const editor  = e.target.closest('.tag-editor');
      const tagEl   = document.createElement('span');
      tagEl.className = 'tag-editor__tag';
      tagEl.innerHTML = `${esc(val)}<span class="tag-editor__remove" data-tag="${esc(val)}" title="Remove">×</span>`;
      editor.insertBefore(tagEl, e.target);
      e.target.value = '';
    }
  });

  function getTagEditorValues(editorId) {
    const editor = document.getElementById(editorId);
    if (!editor) return [];
    return Array.from(editor.querySelectorAll('.tag-editor__tag')).map(t => {
      const removeSpan = t.querySelector('.tag-editor__remove');
      return (removeSpan ? removeSpan.dataset.tag : t.textContent.replace('×','').trim());
    });
  }

  // ---- Global actions (sidebar buttons) -------------------
  const btnExport  = document.getElementById('btnExport');
  const btnImport  = document.getElementById('btnImport');
  const btnReset   = document.getElementById('btnReset');
  const btnLogout  = document.getElementById('btnLogout');
  const importFile = document.getElementById('importFile');

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      exportData(workingData);
      showToast('JSON exported!', 'success');
    });
  }

  if (btnImport && importFile) {
    btnImport.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async ev => {
        try {
          workingData = importData(ev.target.result);
          showToast('Saving to cloud…', 'success');
          await saveData(workingData);
          Object.assign(portfolioData, JSON.parse(JSON.stringify(workingData)));
          switchPanel(activePanel);
          showToast('Imported & published! All devices updated.', 'success');
        } catch (err) {
          showToast('Import failed: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      importFile.value = '';
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', async () => {
      if (confirm('This will delete all saved changes and restore defaults for ALL visitors. Are you sure?')) {
        showToast('Resetting…', 'success');
        workingData = await resetData();
        Object.assign(portfolioData, JSON.parse(JSON.stringify(workingData)));
        switchPanel(activePanel);
        showToast('Reset to defaults. All devices updated.', 'success');
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('admin_auth');
      location.reload();
    });
  }

  // ---- Toast -----------------------------------------------
  function showToast(msg, type = 'success') {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.querySelector('.toast-msg').textContent = msg;
    toast.className = `admin-toast ${type}`;
    // force reflow
    void toast.offsetWidth;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

  // ---- Helpers ---------------------------------------------
  function panelHeader(title, sub) {
    return `
      <div class="admin-panel__header">
        <div>
          <h2 class="admin-panel__title">${title}</h2>
          <p class="admin-panel__subtitle">${sub}</p>
        </div>
      </div>`;
  }

  function saveBar(section) {
    return `
      <div style="display:flex;justify-content:flex-end;margin-top:2rem;padding-top:1.25rem;border-top:1px solid var(--border);">
        <button class="btn-save" type="button" data-save="${section}">
          ${checkIcon()} Save Changes
        </button>
      </div>`;
  }

  function label(text) {
    return `<label class="form-label">${text}</label>`;
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Save button delegation
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-save]');
    if (btn) collectAndSave(btn.dataset.save);
  });

  // ---- Micro icons ----------------------------------------
  function settingsIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`; }
  function homeIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`; }
  function userIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`; }
  function briefcaseIcon(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`; }
  function bookIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`; }
  function certIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`; }
  function starIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`; }
  function gridIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`; }
  function downloadIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="m8 11 4 4 4-4"/><path d="M3 19h18"/></svg>`; }
  function mailIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`; }
  function plusIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`; }
  function checkIcon()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`; }

  // ---- Boot ------------------------------------------------
  boot();
})();
