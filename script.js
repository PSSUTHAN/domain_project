document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default form submission

            // 1. COLLECT DATA (Simulation for MVP)
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData.entries());

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

            // 4. (FUTURE INTEGRATION)
            // In a real deployment (MVP stage - Week 11), this is where you would
            // use the MERN stack or WordPress backend to:
            // a) Send the data to a server API endpoint.
            // b) Trigger an email notification to the contractor.
            // c) Send event data to Google Analytics (SEO & analytics tools) [cite: 75]
        });
    }

    // 5. SIMPLE MOBILE NAV TOGGLE (Optional, if full nav is implemented)
    // For this basic MVP, the navigation is hidden on mobile devices (see CSS)
    // but a full solution would require a mobile hamburger menu icon.
});