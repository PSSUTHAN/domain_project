const clientName = localStorage.getItem('clientName') || 'Client';
const clientNameEl = document.getElementById('clientName');
if (clientNameEl) clientNameEl.textContent = clientName;

const logoutBtn = document.getElementById('clientLogoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('clientName');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
  });
}

// Pre-fill form
const clientQuoteForm = document.getElementById('clientQuoteForm');
if (clientQuoteForm) {
  const nameField = clientQuoteForm.querySelector('input[name="name"]');
  if (nameField) nameField.value = clientName;
}

// Handle form submission
if (clientQuoteForm) {
  clientQuoteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(clientQuoteForm);
    const data = Object.fromEntries(formData.entries());

    // add metadata
    data.id = Date.now();
    data.submittedAt = new Date().toISOString();
    data.clientUser = clientName;
    data.status = 'pending';

    // persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
      existing.unshift(data);
      localStorage.setItem('quoteRequests', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save quote request', err);
    }

    console.log('Client Quote Request Submitted:', data);

    // Show success message
    const successMessage = document.createElement('p');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Thank you! Your quote request has been sent successfully. We will contact you shortly.';
    successMessage.style.color = 'green';
    successMessage.style.marginTop = '15px';

    if (!clientQuoteForm.querySelector('.success-message')) {
      clientQuoteForm.appendChild(successMessage);
    }

    // Reset form
    clientQuoteForm.reset();
    // Re-set name
    const nameField = clientQuoteForm.querySelector('input[name="name"]');
    if (nameField) nameField.value = clientName;

    // Re-render requests
    renderClientRequests();

    // Notify other tabs
    try { window.dispatchEvent(new Event('storage')); } catch (e) {}
  });
}

function getRequests(){
  try { return JSON.parse(localStorage.getItem('quoteRequests') || '[]'); }
  catch(e){ return []; }
}

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderClientRequests(){
  const list = document.getElementById('clientRequestsList');
  if(!list) return;
  const all = getRequests();
  const my = all.filter(r => (r.clientUser && r.clientUser === clientName) || ((r.email||'').split('@')[0] === clientName));
  if(!my.length){
    list.innerHTML = '<div class="card"><p>No requests found. Submit one from the homepage contact form.</p></div>';
    return;
  }
  list.innerHTML = my.map(r => {
    const details = escapeHtml((r.project_details || '').slice(0,140));
    const name = escapeHtml(r.name || r.clientUser || '');
    const email = escapeHtml(r.email || '');
    const phone = escapeHtml(r.phone || '');
    const time = r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '';
    const status = escapeHtml(r.status || 'pending');
    return `\n      <div class="card">\n        <h3>${details || 'Quote Request'}</h3>\n        <p><strong>Name:</strong> ${name}</p>\n        <p><strong>Email:</strong> ${email}</p>\n        <p><strong>Phone:</strong> ${phone}</p>\n        <p><small>Submitted: ${time}</small></p>\n        <p>Status: <span class="status ${status}">${status}</span></p>\n      </div>\n    `;
  }).join('\n');
}

renderClientRequests();
