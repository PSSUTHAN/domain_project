// login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = (document.getElementById("email").value || '').trim();
    const password = (document.getElementById("password").value || '').trim();
    const role = (document.getElementById("role").value || 'client');

    if (role === 'contractor') {
      const validEmail = "engineer@contractorpro.com";
      const validPassword = "admin123";
      if (email === validEmail && password === validPassword) {
        alert("Login successful!");
        localStorage.setItem("contractorName", email.split("@")[0]);
        window.location.href = "dash.html";
      } else {
        alert("Invalid contractor credentials. Please try again.");
      }
    } else {
      // Client credentials (MVP). Update or replace with real auth server later.
      const validClientEmail = "client@contractorpro.com";
      const validClientPassword = "client123";
      if (email === validClientEmail && password === validClientPassword) {
        alert("Client login successful!");
        localStorage.setItem("clientName", email.split("@")[0]);
        window.location.href = "client_dash.html";
      } else {
        alert("Invalid client credentials. Please try again.");
      }
    }
  });
});
