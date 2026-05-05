(function() {
    var auth = localStorage.getItem("inven_auth");
    var isLanding = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    if (!isLanding && !auth) {
        window.location.href = "../index.html";
    }
})();

document.querySelectorAll(".nav-toggle").forEach(function(btn) {
    btn.addEventListener("click", function() {
        var isOpen = this.classList.contains("open");
        document.querySelectorAll(".nav-toggle").forEach(function(t) { t.classList.remove("open"); });
        if (!isOpen) this.classList.add("open");
    });
});

var menuToggle = document.getElementById("menuToggle");
var sidebar = document.getElementById("sidebar");
var overlay = document.getElementById("sidebarOverlay");

if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener("click", function() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", function() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });
}

var logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        if (confirm("Do you want to log out?")) {
            localStorage.removeItem("inven_auth");
            window.location.href = "../index.html";
        }
    });
}
