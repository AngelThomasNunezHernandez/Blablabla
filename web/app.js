const projectFilter = document.getElementById('projectFilter');
const severityFilter = document.getElementById('severityFilter');

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${url}`);
  }
  return response.json();
}

function renderKpis(projects) {
  const totals = projects.reduce(
    (acc, p) => {
      acc.bugs += p.bugs;
      acc.vulns += p.vulnerabilities;
      acc.smells += p.code_smells;
      acc.coverage += p.coverage;
      return acc;
    },
    { bugs: 0, vulns: 0, smells: 0, coverage: 0 }
  );

  const avgCoverage = projects.length ? (totals.coverage / projects.length).toFixed(1) : '0.0';

  const cards = [
    { label: 'Bugs', value: totals.bugs },
    { label: 'Vulnerabilidades', value: totals.vulns },
    { label: 'Code Smells', value: totals.smells },
    { label: 'Cobertura media', value: `${avgCoverage}%` },
  ];

  document.getElementById('kpiCards').innerHTML = cards
    .map((c) => `<article class="card"><small>${c.label}</small><strong>${c.value}</strong></article>`)
    .join('');
}

function renderIssues(issues) {
  document.getElementById('issuesTable').innerHTML = issues
    .map(
      (issue) => `<tr>
        <td>${issue.id}</td>
        <td>${issue.project}</td>
        <td>${issue.type}</td>
        <td>${issue.severity}</td>
        <td>${issue.status}</td>
      </tr>`
    )
    .join('');
}

function renderGate(gate) {
  document.getElementById('gateList').innerHTML = gate
    .map((g) => `<li><span class="badge ${g.status.toLowerCase()}">${g.status}</span> ${g.rule}</li>`)
    .join('');
}

async function loadProjects() {
  const projects = await getJson('/api/projects');
  projectFilter.innerHTML = '<option value="">Todos</option>' +
    projects.map((p) => `<option value="${p.key}">${p.name}</option>`).join('');
  return projects;
}

async function loadIssues() {
  const params = new URLSearchParams();
  if (projectFilter.value) params.set('project', projectFilter.value);
  if (severityFilter.value) params.set('severity', severityFilter.value);

  const issues = await getJson(`/api/issues?${params.toString()}`);
  renderIssues(issues);
}

async function refreshDashboard() {
  const [projects, gate] = await Promise.all([getJson('/api/projects'), getJson('/api/quality-gate')]);
  renderKpis(projects);
  renderGate(gate);
  await loadIssues();
}

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  await getJson('/api/analyze', { method: 'POST' });
  await refreshDashboard();
});

projectFilter.addEventListener('change', loadIssues);
severityFilter.addEventListener('change', loadIssues);

(async () => {
  await loadProjects();
  await refreshDashboard();
})();
