  // ✅ Display contractor name
  const contractorName = localStorage.getItem('contractorName');
  if (!contractorName) {
    window.location.href = "login.html";
  } else {
    document.getElementById('contractorName').textContent = contractorName;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('contractorName');
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
