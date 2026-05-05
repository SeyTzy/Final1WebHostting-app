const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Do you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("demo_logged_in");
            window.location.href = "../index.html";
        }
    });
}
