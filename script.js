document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quoteForm');

    // Gmail validation helpers 🔍
    function localPartStartsWithLetter(email) {
        var parts = (email || '').split('@');
        var local = (parts[0] || '').trim();
        return /^[A-Za-z]/.test(local);
    }
    function isValidEmailFormat(email) {
        var s = (email || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
        return localPartStartsWithLetter(s);
    }

    function isGmailAddress(email) {
        if (!isValidEmailFormat(email)) return false;
        var parts = (email || '').split('@');
        var domain = (parts[1] || '').toLowerCase();
        return domain === 'gmail.com' || domain === 'googlemail.com';
    }

    function attachEmailGmailValidator(form) {
        if (!form) return;
        var emailInput = form.querySelector('input[name="email"]');
        if (!emailInput) return;
        var msg = form.querySelector('.email-validation');
        if (!msg) {
            msg = document.createElement('small');
            msg.className = 'email-validation';
            msg.style.display = 'block';
            msg.style.marginTop = '6px';
            emailInput.insertAdjacentElement('afterend', msg);
        }
        function update() {
            var val = (emailInput.value || '').trim();
            if (!val) { msg.textContent = ''; msg.style.color = ''; return; }
            // basic format check
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { msg.textContent = 'Invalid email format'; msg.style.color = 'red'; return; }
            if (!localPartStartsWithLetter(val)) { msg.textContent = 'Email local part must start with a letter'; msg.style.color = 'red'; return; }
            if (isGmailAddress(val)) { msg.textContent = 'Valid Gmail address'; msg.style.color = 'green'; }
            else { msg.textContent = 'Valid email but not a Gmail address'; msg.style.color = 'orange'; }
        }
        emailInput.addEventListener('input', update);
        update();
    }


    if (quoteForm) {
        attachEmailGmailValidator(quoteForm);
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default form submission

            // 1. COLLECT DATA (Simulation for MVP)
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData.entries());

            // add metadata for storage and dashboard association
            data.id = Date.now();
            data.submittedAt = new Date().toISOString();
            data.clientUser = (data.email || '').split('@')[0];
            data.status = 'pending';

            // Validation: ensure area_size and budget are positive (if present)
            const area = data.area_size !== undefined ? Number(data.area_size) : NaN;
            const budget = data.budget !== undefined ? Number(data.budget) : NaN;
            // remove existing error if any
            const existingError = quoteForm.querySelector('.error-message');
            if (existingError) existingError.remove();
            if (data.area_size !== undefined && (!isFinite(area) || area <= 0)) {
                const err = document.createElement('p');
                err.className = 'error-message';
                err.textContent = 'Please enter a positive value for area size.';
                err.style.color = 'red';
                err.style.marginTop = '10px';
                quoteForm.appendChild(err);
                return;
            }
            if (data.budget !== undefined && (!isFinite(budget) || budget <= 0)) {
                const err = document.createElement('p');
                err.className = 'error-message';
                err.textContent = 'Please enter a positive value for budget.';
                err.style.color = 'red';
                err.style.marginTop = '10px';
                quoteForm.appendChild(err);
                return;
            }

            // Phone validation: must be exactly 10 digits
            var phoneRaw = (data.phone || '').toString();
            var phoneDigits = phoneRaw.replace(/\D/g, '');
            if (phoneDigits && !/^\d{10}$/.test(phoneDigits)) {
                const err = document.createElement('p');
                err.className = 'error-message';
                err.textContent = 'Please enter a 10-digit phone number.';
                err.style.color = 'red';
                err.style.marginTop = '10px';
                quoteForm.appendChild(err);
                return;
            }
            if (phoneDigits) data.phone = phoneDigits;

            // Email validation before submit
            const emailVal = (data.email || '').trim();
            if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                const err = document.createElement('p');
                err.className = 'error-message';
                err.textContent = 'Invalid email format.';
                err.style.color = 'red';
                err.style.marginTop = '10px';
                quoteForm.appendChild(err);
                return;
            }
            if (emailVal && !localPartStartsWithLetter(emailVal)) {
                const err = document.createElement('p');
                err.className = 'error-message';
                err.textContent = 'Email local part must start with a letter.';
                err.style.color = 'red';
                err.style.marginTop = '10px';
                quoteForm.appendChild(err);
                return;
            }
            // persist to localStorage so dashboards can read it
            try {
                const existing = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
                existing.unshift(data);
                localStorage.setItem('quoteRequests', JSON.stringify(existing));
            } catch (err) {
                console.error('Failed to save quote request', err);
            }

            console.log('Quote Request Submitted:', data);

            // 2. FORM VALIDATION & FEEDBACK
            const successMessage = document.createElement('p');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! Your quote request has been sent successfully. We will contact you shortly.';
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '15px';

            // Check if a success message already exists to prevent duplicates
            if (!quoteForm.querySelector('.success-message')) {
                quoteForm.appendChild(successMessage);
            }

            // 3. Clear the form for the next user
            quoteForm.reset();

            // 4. Notify other tabs (best-effort)
            try { window.dispatchEvent(new Event('storage')); } catch (e) {}

            // 5. (FUTURE INTEGRATION)
            // In a real deployment, replace storage with a network POST:
            // fetch('/api/quotes', { method: 'POST', body: JSON.stringify(data) })
        });
    }

    const supportForm = document.getElementById('supportForm');

    if (supportForm) {
        supportForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default form submission

            // 1. COLLECT DATA (Simulation for MVP)
            const formData = new FormData(supportForm);
            const data = Object.fromEntries(formData.entries());

            // add metadata
            data.id = Date.now();
            data.submittedAt = new Date().toISOString();
            data.type = 'support';

            // persist to localStorage
            try {
                const existing = JSON.parse(localStorage.getItem('supportRequests') || '[]');
                existing.unshift(data);
                localStorage.setItem('supportRequests', JSON.stringify(existing));
            } catch (err) {
                console.error('Failed to save support request', err);
            }

            console.log('Support Request Submitted:', data);

            // 2. FORM VALIDATION & FEEDBACK
            const successMessage = document.createElement('p');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! Your message has been sent successfully. We will respond within 24 hours.';
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '15px';

            // Check if a success message already exists to prevent duplicates
            if (!supportForm.querySelector('.success-message')) {
                supportForm.appendChild(successMessage);
            }

            // 3. Clear the form
            supportForm.reset();

            // 4. (FUTURE INTEGRATION)
            // fetch('/api/support', { method: 'POST', body: JSON.stringify(data) })
        });
    }
});