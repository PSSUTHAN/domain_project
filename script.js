document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
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