

    const contractorName = localStorage.getItem('contractorName') || 'Engineer';
    document.getElementById('contractorName').textContent = contractorName;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('contractorName');
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });