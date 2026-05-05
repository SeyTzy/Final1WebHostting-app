function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function storeUser(email, password) {
    var users = JSON.parse(localStorage.getItem("inven_users") || "{}");
    users[email.toLowerCase()] = { email: email.toLowerCase(), password: password };
    localStorage.setItem("inven_users", JSON.stringify(users));
}

function getUser(email) {
    var users = JSON.parse(localStorage.getItem("inven_users") || "{}");
    return users[email.toLowerCase()] || null;
}

function showMsg(container, text, isError) {
    var m = container.querySelector(".form-msg");
    if (!m) {
        m = document.createElement("div");
        m.className = "form-msg";
        container.querySelector(".lp-modal-form").after(m);
    }
    m.textContent = text;
    m.className = "form-msg " + (isError ? "error" : "success");
    setTimeout(function() { m.remove(); }, 3000);
}

function clearErrors(modal) {
    modal.querySelectorAll(".input-error").forEach(function(e) { e.remove(); });
    modal.querySelectorAll(".lp-input").forEach(function(w) { w.classList.remove("has-error"); });
    var m = modal.querySelector(".form-msg");
    if (m) m.remove();
}

// Signup
var signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors(signupModal);

        var email = document.getElementById("signupEmail").value.trim();
        var pass = document.getElementById("signupPassword").value;
        var confirm = document.getElementById("signupConfirm").value;
        var valid = true;

        if (!email) {
            valid = false;
            showFieldError("signupEmail", "Email is required.");
        } else if (!isValidEmail(email)) {
            valid = false;
            showFieldError("signupEmail", "Enter a valid email.");
        }

        if (!pass) {
            valid = false;
            showFieldError("signupPassword", "Password is required.");
        } else if (pass.length < 6) {
            valid = false;
            showFieldError("signupPassword", "Min 6 characters.");
        }

        if (pass !== confirm) {
            valid = false;
            showFieldError("signupConfirm", "Passwords don't match.");
        }

        if (!valid) {
            showMsg(signupModal, "Fix errors above", true);
            return;
        }

        if (getUser(email)) {
            showFieldError("signupEmail", "Email already exists.");
            return;
        }

        storeUser(email, pass);
        localStorage.setItem("inven_auth", email);
        showMsg(signupModal, "Account created! Redirecting...", false);

        setTimeout(function() {
            window.location.href = "./HTML/dashboard.html";
        }, 1000);
    });
}

// Login
var loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors(loginModal);

        var email = document.getElementById("loginEmail").value.trim();
        var pass = document.getElementById("loginPassword").value;
        var valid = true;

        if (!email) {
            valid = false;
            showFieldError("loginEmail", "Email is required.");
        } else if (!isValidEmail(email)) {
            valid = false;
            showFieldError("loginEmail", "Invalid email.");
        }

        if (!pass) {
            valid = false;
            showFieldError("loginPassword", "Password is required.");
        }

        if (!valid) {
            showMsg(loginModal, "Fix errors above", true);
            return;
        }

        var user = getUser(email);
        if (!user) {
            showFieldError("loginEmail", "User not found.");
            return;
        }

        if (user.password !== pass) {
            showFieldError("loginPassword", "Wrong password.");
            return;
        }

        showMsg(loginModal, "Login success!", false);
        localStorage.setItem("inven_auth", email);

        setTimeout(function() {
            window.location.href = "./HTML/dashboard.html";
        }, 1000);
    });
}

function showFieldError(inputId, message) {
    var input = document.getElementById(inputId);
    var wrapper = input.closest(".lp-input");
    wrapper.classList.add("has-error");
    var err = wrapper.querySelector(".input-error");
    if (err) err.remove();
    var el = document.createElement("div");
    el.className = "input-error";
    el.textContent = message;
    wrapper.appendChild(el);
}
