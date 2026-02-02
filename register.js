// register.js

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (!registerForm) return;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("name").value || '').trim();
    const email = (document.getElementById("email").value || '').trim();
    const phone = (document.getElementById("phone").value || '').trim();
    const password = (document.getElementById("password").value || '').trim();
    const confirmPassword = (document.getElementById("confirmPassword").value || '').trim();
    const role = (document.getElementById("role").value || 'client');

    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Email checks: valid format and local part starts with a letter
    function localPartStartsWithLetter(emailStr){
      var parts = (emailStr||'').split('@');
      var local = (parts[0]||'').trim();
      return /^[A-Za-z]/.test(local);
    }
    function isValidEmailFormat(emailStr){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((emailStr||'').trim());
    }

    if (!isValidEmailFormat(email)){
      alert('Please enter a valid email address.');
      return;
    }
    if (!localPartStartsWithLetter(email)){
      alert('Email local part must start with a letter.');
      return;
    }

    // Phone validation: normalize and require exactly 10 digits
    var phoneDigits = phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phoneDigits)){
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    // normalize the phone field value
    document.getElementById("phone").value = phoneDigits;

    // Simulate registration success (MVP). In production, send to server.
    alert("Registration successful! Please login with your credentials.");
    // Optionally store in localStorage for demo, but not secure
    // localStorage.setItem("registeredUser", JSON.stringify({name, email, role}));
    window.location.href = "login.html";
  });
});