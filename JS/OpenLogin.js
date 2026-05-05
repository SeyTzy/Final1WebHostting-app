// Auto-redirect to dashboard if already logged in
if (localStorage.getItem("demo_logged_in")) {
    window.location.href = "./HTML/dashboard.html";
}

const openBtn = document.getElementById("open");
const openHeroBtn = document.getElementById("open-hero");
const openCtaBtn = document.getElementById("open-cta");
const mobileLoginBtn = document.getElementById("mobileLoginBtn");
const loginPopup = document.getElementById("login-form");
const signupPopup = document.getElementById("signup-form");
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const modalOverlay = document.getElementById("modalOverlay");
const switchToSignup = document.querySelector(".switch-to-signup");
const switchToLogin = document.querySelector(".switch-to-login");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

function openModal(modal) {
    modalOverlay.classList.add("active");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

function closeAllModals() {
    loginPopup.classList.remove("active");
    signupPopup.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

if (openBtn) openBtn.addEventListener("click", () => openModal(loginPopup));
if (openHeroBtn) openHeroBtn.addEventListener("click", () => openModal(loginPopup));
if (openCtaBtn) openCtaBtn.addEventListener("click", () => openModal(loginPopup));
if (mobileLoginBtn) mobileLoginBtn.addEventListener("click", () => {
    openModal(loginPopup);
    mobileMenu.classList.remove("active");
});

if (closeLogin) closeLogin.addEventListener("click", () => closeModal(loginPopup));
if (closeSignup) closeSignup.addEventListener("click", () => closeModal(signupPopup));
if (modalOverlay) modalOverlay.addEventListener("click", closeAllModals);

if (switchToSignup) {
    switchToSignup.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(loginPopup);
        setTimeout(() => openModal(signupPopup), 200);
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(signupPopup);
        setTimeout(() => openModal(loginPopup), 200);
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
});

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (mobileMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});
