const seedMonitors = [
  { id: 'core-api', name: 'Core API', url: 'api.yuin.dev/health', status: 'operational', response: 142, uptime: '99.99%', icon: '⌁', history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 'marketing-site', name: 'Marketing site', url: 'yuin.dev', status: 'operational', response: 82, uptime: '100.00%', icon: '◈', history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 'webhooks', name: 'Webhooks', url: 'api.yuin.dev/webhooks', status: 'degraded', response: 318, uptime: '99.73%', icon: '↯', history: [1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1] },
  { id: 'docs', name: 'Documentation', url: 'docs.yuin.dev', status: 'operational', response: 188, uptime: '100.00%', icon: '▤', history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }
];
const seedIncidents = [
  { status: 'monitoring', title: 'Elevated webhook latency', detail: 'Webhooks · Response times are above your 300 ms threshold.', time: '12 min ago' },
  { status: 'resolved', title: 'Core API connection reset', detail: 'Core API · Lasted 4 minutes and 12 seconds.', time: 'Sep 12' }
];
let monitors = JSON.parse(localStorage.getItem('pulseboard-monitors') || 'null') || seedMonitors;
let incidents = JSON.parse(localStorage.getItem('pulseboard-incidents') || 'null') || seedIncidents;
let currentFilter = 'all';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function persist() {
  localStorage.setItem('pulseboard-monitors', JSON.stringify(monitors));
  localStorage.setItem('pulseboard-incidents', JSON.stringify(incidents));
}

function makeChart(history, degraded = false) {
  return `<div class="monitor-chart ${degraded ? 'degraded' : ''}" aria-label="Recent check history">${history.map(value => `<i style="height:${value ? 7 + Math.floor(Math.random() * 11) : 5}px"></i>`).join('')}</div>`;
}

function monitorMarkup(monitor, full = false) {
  return `<div class="monitor-row" data-monitor-id="${monitor.id}">
    <div class="monitor-main"><span class="monitor-orb ${monitor.status === 'degraded' ? 'degraded' : ''}">${monitor.icon}</span><div class="monitor-info"><strong>${escapeHtml(monitor.name)}</strong><span>${escapeHtml(monitor.url)}</span></div></div>
    ${makeChart(monitor.history, monitor.status === 'degraded')}
    <div class="monitor-stat"><strong>${monitor.response} ms</strong><span>response time</span></div>
    <div class="status-pill ${monitor.status === 'degraded' ? 'degraded' : ''}"><i></i>${monitor.status === 'degraded' ? 'Degraded' : 'Operational'}</div>
    <button class="icon-button subtle monitor-menu" aria-label="More options for ${escapeHtml(monitor.name)}">•••</button>
  </div>`;
}

function incidentMarkup(incident) {
  const resolved = incident.status === 'resolved';
  return `<div class="incident-item"><span class="incident-node ${resolved ? 'resolved' : ''}">${resolved ? '✓' : '!'}</span><div><strong>${escapeHtml(incident.title)}</strong><p>${escapeHtml(incident.detail)}</p></div><time>${escapeHtml(incident.time)}</time></div>`;
}

function timelineMarkup(incident, index) {
  const resolved = incident.status === 'resolved';
  return `<div class="timeline-entry ${resolved ? '' : 'open'}"><time>${index === 0 ? 'TODAY · 21:03' : 'SEP 12 · 08:41'}</time><h3>${escapeHtml(incident.title)}</h3><p>${escapeHtml(incident.detail)}</p><span class="timeline-badge ${resolved ? '' : 'open'}">${resolved ? 'Resolved' : 'Monitoring'}</span></div>`;
}

function render() {
  const list = $('#monitor-list');
  const fullList = $('#full-monitor-list');
  if (list) list.innerHTML = monitors.slice(0, 4).map(m => monitorMarkup(m)).join('');
  if (fullList) fullList.innerHTML = monitors.filter(m => currentFilter === 'all' || m.status === currentFilter).map(m => monitorMarkup(m, true)).join('') || '<div class="empty-state">No monitors match this filter.</div>';
  const incidentList = $('#incident-list');
  if (incidentList) incidentList.innerHTML = incidents.slice(0, 3).map(incidentMarkup).join('');
  const timeline = $('#timeline');
  if (timeline) timeline.innerHTML = incidents.map(timelineMarkup).join('');
  const activeCount = monitors.filter(m => m.status === 'operational').length;
  const degradedCount = monitors.length - activeCount;
  const avg = Math.round(monitors.reduce((sum, m) => sum + m.response, 0) / Math.max(monitors.length, 1));
  $('#monitor-nav-count').textContent = monitors.length;
  $('#all-count').textContent = monitors.length;
  $('#metric-monitors').textContent = monitors.length;
  $('#metric-incidents').textContent = incidents.length;
  $('#avg-response').textContent = `${avg} ms`;
  $('#metric-latency').textContent = `${avg} ms`;
  $('#overall-uptime').textContent = degradedCount ? '99.94%' : '99.98%';
  $('#metric-uptime').textContent = degradedCount ? '99.94%' : '99.98%';
  const banner = $('#status-banner');
  banner.classList.toggle('degraded', degradedCount > 0);
  $('.status-copy strong').textContent = degradedCount ? `${degradedCount} monitor${degradedCount === 1 ? '' : 's'} need attention` : 'All systems operational';
  $('#status-updated').textContent = degradedCount ? 'Webhooks is running slower than usual · last checked just now' : 'Last checked just now · next check in 45 seconds';
  updatePaletteResults();
}

function escapeHtml(text) { return String(text).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function showToast(message) { $('#toast-message').textContent = message; $('#toast').classList.add('visible'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000); }
function setView(view) { $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view)); $$('.view-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === view)); $('#breadcrumb-title').textContent = view[0].toUpperCase() + view.slice(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function openModal() { $('#monitor-modal').showModal(); setTimeout(() => $('#monitor-form input').focus(), 50); }
function exportReport() { const report = { generatedAt: new Date().toISOString(), workspace: "Yuin's workspace", monitors, incidents }; const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pulseboard-report.json'; a.click(); URL.revokeObjectURL(a.href); showToast('Report exported as JSON.'); }
function checkAll() { monitors = monitors.map(m => { const shift = Math.floor(Math.random() * 21) - 10; const response = Math.max(45, m.response + shift); const status = Math.random() > .92 ? 'degraded' : 'operational'; return { ...m, response, status, history: [...m.history.slice(-29), status === 'operational' ? 1 : 0] }; }); persist(); render(); $('#status-updated').textContent = 'Last checked just now · next check in 45 seconds'; showToast('All monitors checked.'); }
function addMonitor(form) { const data = new FormData(form); const id = `${String(data.get('name')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`; monitors.unshift({ id, name: data.get('name'), url: String(data.get('url')).replace(/^https?:\/\//, ''), status: 'operational', response: 74, uptime: '100.00%', icon: '◌', history: Array(30).fill(1) }); persist(); render(); setView('monitors'); showToast(`${data.get('name')} added to your workspace.`); form.reset(); }
function updateTheme() { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; localStorage.setItem('pulseboard-theme', theme); $('#theme-toggle').textContent = theme === 'dark' ? '☾' : '☼'; }
function updatePaletteResults(query = '') { const q = query.toLowerCase(); const views = [{ id: 'overview', icon: '◈', label: 'Go to Overview', sub: 'Workspace pulse' }, { id: 'monitors', icon: '⌁', label: 'Go to Monitors', sub: `${monitors.length} active monitors` }, { id: 'incidents', icon: '◒', label: 'Go to Incidents', sub: `${incidents.length} recent incidents` }, { id: 'settings', icon: '⚙', label: 'Go to Settings', sub: 'Workspace preferences' }]; const monitorResults = monitors.map(m => ({ id: 'monitor', monitorId: m.id, icon: m.icon, label: m.name, sub: `${m.url} · ${m.status}` })); const results = [...views, ...monitorResults].filter(r => `${r.label} ${r.sub}`.toLowerCase().includes(q)); $('#palette-results').innerHTML = results.map((r, i) => `<button class="palette-result ${i === 0 ? 'selected' : ''}" data-palette-id="${r.id}" data-monitor-id="${r.monitorId || ''}"><span class="result-icon">${r.icon}</span><span><strong>${escapeHtml(r.label)}</strong><small>${escapeHtml(r.sub)}</small></span></button>`).join('') || '<div class="empty-state">No results. Try another search.</div>'; $$('.palette-result').forEach(button => button.addEventListener('click', () => { if (button.dataset.paletteId === 'monitor') { setView('monitors'); $('#palette-input').value = ''; closePalette(); } else { setView(button.dataset.paletteId); closePalette(); } })); }
function openPalette() { $('#command-palette').classList.add('open'); $('#command-palette').setAttribute('aria-hidden', 'false'); $('#palette-input').value = ''; updatePaletteResults(); setTimeout(() => $('#palette-input').focus(), 20); }
function closePalette() { $('#command-palette').classList.remove('open'); $('#command-palette').setAttribute('aria-hidden', 'true'); }

function init() {
  const theme = localStorage.getItem('pulseboard-theme'); if (theme) { document.documentElement.dataset.theme = theme; $('#theme-toggle').textContent = theme === 'dark' ? '☾' : '☼'; }
  const hour = new Date().getHours(); $('#greeting').textContent = `${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, Yuin`;
  const bars = $('.uptime-bars'); for (let i = 0; i < 30; i += 1) { const bar = document.createElement('i'); bar.style.height = `${8 + Math.round(Math.random() * 17)}px`; bars.appendChild(bar); }
  render();
  $$('.nav-item').forEach(item => item.addEventListener('click', () => setView(item.dataset.view)));
  $$('[data-view-target]').forEach(item => item.addEventListener('click', () => setView(item.dataset.viewTarget)));
  $('#view-all-monitors').addEventListener('click', () => setView('monitors'));
  $('#add-monitor-button').addEventListener('click', openModal); $('#add-monitor-button-monitors').addEventListener('click', openModal);
  $('#monitor-form').addEventListener('submit', e => { e.preventDefault(); addMonitor(e.currentTarget); $('#monitor-modal').close(); });
  $('#check-all').addEventListener('click', checkAll); $('#theme-toggle').addEventListener('click', updateTheme); $('#settings-theme').addEventListener('click', updateTheme);
  $('#export-button').addEventListener('click', exportReport); $('#export-button-monitors').addEventListener('click', exportReport);
  $('.dismiss-tip').addEventListener('click', e => e.currentTarget.closest('.tip-strip').remove());
  $$('.filter-tab').forEach(tab => tab.addEventListener('click', () => { $$('.filter-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); currentFilter = tab.dataset.filter; render(); }));
  $('#report-incident').addEventListener('click', () => showToast('Incident reporting is ready for your next real check.'));
  $('#search-trigger').addEventListener('click', openPalette); $('#command-palette').addEventListener('click', e => { if (e.target === $('#command-palette')) closePalette(); }); $('#palette-input').addEventListener('input', e => updatePaletteResults(e.target.value));
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); } if (e.key === 'Escape') closePalette(); if (e.key.toLowerCase() === 'n' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) openModal(); });
}
init();
