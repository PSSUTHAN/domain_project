// login.js

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const validEmail = "engineer@contractorpro.com";
      const validPassword = "admin123";

      if (email === validEmail && password === validPassword) {
        alert("Login successful!");

       
        localStorage.setItem("contractorName", email.split("@")[0]);
        window.location.href = "dash.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }
});
