const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    const confirmLogout = confirm("Do you want to log out?");
    
    if (confirmLogout) {
      // If user clicks OK
      window.location.href = "../index.html";
    } else {
      // If user clicks Cancel
      // Do nothing (stay on page)
    }
  });
}