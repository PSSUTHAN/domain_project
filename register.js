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

    // Simulate registration success (MVP). In production, send to server.
    alert("Registration successful! Please login with your credentials.");
    // Optionally store in localStorage for demo, but not secure
    // localStorage.setItem("registeredUser", JSON.stringify({name, email, role}));
    window.location.href = "login.html";
  });
});