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

// Gmail validation helpers 🔍
function localPartStartsWithLetter(email){
  var parts = (email||'').split('@');
  var local = (parts[0]||'').trim();
  return /^[A-Za-z]/.test(local);
}
function isValidEmailFormat(email){
  var s = (email||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
  return localPartStartsWithLetter(s);
}
function isGmailAddress(email){
  if(!isValidEmailFormat(email)) return false;
  var parts = (email||'').split('@');
  var domain = (parts[1]||'').toLowerCase();
  return domain === 'gmail.com' || domain === 'googlemail.com';
} 
function attachEmailGmailValidator(form){
  if(!form) return;
  var emailInput = form.querySelector('input[name="email"]');
  if(!emailInput) return;
  var msg = form.querySelector('.email-validation');
  if(!msg){
    msg = document.createElement('small');
    msg.className = 'email-validation';
    msg.style.display = 'block';
    msg.style.marginTop = '6px';
    emailInput.insertAdjacentElement('afterend', msg);
  }
  function update(){
    var val = (emailInput.value||'').trim();
    if(!val){ msg.textContent=''; msg.style.color=''; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { msg.textContent='Invalid email format'; msg.style.color='red'; return; }
    if (!localPartStartsWithLetter(val)) { msg.textContent='Email local part must start with a letter'; msg.style.color='red'; return; }
    if(isGmailAddress(val)){ msg.textContent='Valid Gmail address'; msg.style.color='green'; }
    else{ msg.textContent='Valid email but not a Gmail address'; msg.style.color='orange'; }
  }
  emailInput.addEventListener('input', update);
  update();
}

// attach to client form
attachEmailGmailValidator(clientQuoteForm);

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

    // Validation: ensure area_size and budget are positive
    const area = data.area_size !== undefined ? Number(data.area_size) : NaN;
    const budget = data.budget !== undefined ? Number(data.budget) : NaN;
    const existingError = clientQuoteForm.querySelector('.error-message');
    if (existingError) existingError.remove();
    if (data.area_size !== undefined && (!isFinite(area) || area <= 0)) {
      const err = document.createElement('p');
      err.className = 'error-message';
      err.textContent = 'Please enter a positive value for area size.';
      err.style.color = 'red';
      err.style.marginTop = '10px';
      clientQuoteForm.appendChild(err);
      return;
    }
    if (data.budget !== undefined && (!isFinite(budget) || budget <= 0)) {
      const err = document.createElement('p');
      err.className = 'error-message';
      err.textContent = 'Please enter a positive value for budget.';
      err.style.color = 'red';
      err.style.marginTop = '10px';
      clientQuoteForm.appendChild(err);
      return;
    }

    // Phone validation: must be exactly 10 digits
    var phoneRaw = (data.phone || '').toString();
    var phoneDigits = phoneRaw.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phoneDigits)) {
      const err = document.createElement('p');
      err.className = 'error-message';
      err.textContent = 'Please enter a 10-digit phone number.';
      err.style.color = 'red';
      err.style.marginTop = '10px';
      clientQuoteForm.appendChild(err);
      return;
    }
    data.phone = phoneDigits;

    // Email checks
    const emailVal = (data.email || '').trim();
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      const err = document.createElement('p');
      err.className = 'error-message';
      err.textContent = 'Invalid email format.';
      err.style.color = 'red';
      err.style.marginTop = '10px';
      clientQuoteForm.appendChild(err);
      return;
    }
    if (emailVal && !localPartStartsWithLetter(emailVal)) {
      const err = document.createElement('p');
      err.className = 'error-message';
      err.textContent = 'Email local part must start with a letter.';
      err.style.color = 'red';
      err.style.marginTop = '10px';
      clientQuoteForm.appendChild(err);
      return;
    }

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
