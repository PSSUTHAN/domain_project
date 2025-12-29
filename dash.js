

    const contractorName = localStorage.getItem('contractorName') || 'Engineer';
const contractorEl = document.getElementById('contractorName');
if (contractorEl) contractorEl.textContent = contractorName;

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('contractorName');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
  });
}

function getRequests(){
  try { return JSON.parse(localStorage.getItem('quoteRequests') || '[]'); }
  catch(e){ return []; }
}

function saveRequests(reqs){
  localStorage.setItem('quoteRequests', JSON.stringify(reqs));
}

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderRequests(){
  const list = document.getElementById('requestsList');
  if(!list) return;
  const reqs = getRequests();
  if(!reqs.length){
    list.innerHTML = '<div class="card"><p>No quote requests yet.</p></div>';
    return;
  }
  list.innerHTML = reqs.map(r => {
    const details = escapeHtml((r.project_details || '').slice(0,140));
    const name = escapeHtml(r.name || r.clientUser || '');
    const email = escapeHtml(r.email || '');
    const phone = escapeHtml(r.phone || '');
    const time = r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '';
    const status = escapeHtml(r.status || 'pending');
    return `\n      <div class="card">\n        <h3>${details || 'Quote Request'}</h3>\n        <p><strong>From:</strong> ${name} &nbsp; &nbsp; <strong>Email:</strong> ${email}</p>\n        <p><strong>Phone:</strong> ${phone}</p>\n        <p><small>Submitted: ${time}</small></p>\n        <p>Status: <span class="status ${status}">${status}</span></p>\n        <button class="update-btn mark-complete" data-id="${r.id}">Mark Completed</button>\n      </div>\n    `;
  }).join('\n');
}

// mark completed using event delegation
const requestsList = document.getElementById('requestsList');
if (requestsList) {
  requestsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.mark-complete');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const reqs = getRequests();
    const idx = reqs.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return;
    reqs[idx].status = 'completed';
    saveRequests(reqs);
    renderRequests();
  });
}

// initial render
renderRequests();