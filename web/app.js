const state = {
  kpis: [
    { label: 'Bugs', value: 31 },
    { label: 'Vulnerabilidades', value: 7 },
    { label: 'Code Smells', value: 143 },
    { label: 'Cobertura', value: '78%' },
  ],
  issues: [
    { project: 'api-core', type: 'Bug', severity: 'Alta', status: 'Open' },
    { project: 'frontend-ui', type: 'Code Smell', severity: 'Media', status: 'Open' },
    { project: 'worker-jobs', type: 'Vulnerability', severity: 'Crítica', status: 'Confirmed' },
    { project: 'api-core', type: 'Security Hotspot', severity: 'Media', status: 'Reviewed' },
  ],
  gates: [
    { rule: 'Coverage > 80%', status: 'warning' },
    { rule: 'New Bugs = 0', status: 'fail' },
    { rule: 'New Vulnerabilities = 0', status: 'fail' },
    { rule: 'Duplicación < 3%', status: 'pass' },
  ],
};

function statusClass(label) {
  if (label === 'pass') return 'ok';
  if (label === 'warning') return 'warn';
  return 'bad';
}

function render() {
  document.getElementById('kpiCards').innerHTML = state.kpis
    .map((k) => `<article class="card"><small>${k.label}</small><strong>${k.value}</strong></article>`)
    .join('');

  document.getElementById('issuesTable').innerHTML = state.issues
    .map(
      (issue) => `<tr>
        <td>${issue.project}</td>
        <td>${issue.type}</td>
        <td>${issue.severity}</td>
        <td>${issue.status}</td>
      </tr>`
    )
    .join('');

  document.getElementById('gateList').innerHTML = state.gates
    .map(
      (gate) => `<li><span class="badge ${statusClass(gate.status)}">${gate.status.toUpperCase()}</span> ${gate.rule}</li>`
    )
    .join('');
}

document.getElementById('refreshBtn').addEventListener('click', () => {
  state.kpis[0].value = Math.max(0, state.kpis[0].value - 1);
  state.kpis[2].value = Math.max(0, state.kpis[2].value - 2);
  render();
});

render();
