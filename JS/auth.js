(function() {
    var stored = localStorage.getItem("inven_auth");
    if (stored) {
        window.location.href = "./HTML/dashboard.html";
    }
})();

var openLoginBtns = [
    document.getElementById("openLogin"),
    document.getElementById("openHero"),
    document.getElementById("openCta"),
    document.getElementById("mobileLogin")
];

var loginModal = document.getElementById("loginModal");
var signupModal = document.getElementById("signupModal");
var backdrop = document.getElementById("modalBackdrop");
var closeLoginBtn = document.getElementById("closeLogin");
var closeSignupBtn = document.getElementById("closeSignup");
var goToSignup = document.getElementById("goToSignup");
var goToLogin = document.getElementById("goToLogin");
var mobileToggle = document.getElementById("mobileToggle");
var mobileMenu = document.getElementById("mobileMenu");

function openModal(modal) {
    backdrop.classList.add("active");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
}

function closeAll() {
    closeModal(loginModal);
    closeModal(signupModal);
}

openLoginBtns.forEach(function(btn) {
    if (btn) btn.addEventListener("click", function() {
        openModal(loginModal);
        if (mobileMenu) mobileMenu.classList.remove("active");
    });
});

if (closeLoginBtn) closeLoginBtn.addEventListener("click", function() { closeModal(loginModal); });
if (closeSignupBtn) closeSignupBtn.addEventListener("click", function() { closeModal(signupModal); });
if (backdrop) backdrop.addEventListener("click", closeAll);

if (goToSignup) {
    goToSignup.addEventListener("click", function(e) {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(function() { openModal(signupModal); }, 200);
    });
}

if (goToLogin) {
    goToLogin.addEventListener("click", function(e) {
        e.preventDefault();
        closeModal(signupModal);
        setTimeout(function() { openModal(loginModal); }, 200);
    });
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeAll();
});

if (mobileToggle) {
    mobileToggle.addEventListener("click", function() {
        mobileMenu.classList.toggle("active");
        var icon = mobileToggle.querySelector("i");
        if (mobileMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
}
