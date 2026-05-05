var DEFAULT_CONTACT = {
    email: "thoeurnseyhat@gmail.com",
    phone: "",
    address: "Phnom Penh, Cambodia",
    telegram: "",
    facebook: ""
};

function getContact() {
    var saved = localStorage.getItem("inven_contact");
    if (!saved) return Object.assign({}, DEFAULT_CONTACT);
    return Object.assign({}, DEFAULT_CONTACT, JSON.parse(saved));
}

function saveContact(data) {
    localStorage.setItem("inven_contact", JSON.stringify(data));
}

function updateProfileEmails() {
    var contact = getContact();
    var emails = document.querySelectorAll(".profile-contact i.fa-envelope");
    emails.forEach(function(icon) {
        var container = icon.parentElement;
        var emailText = contact.email || "you@example.com";
        container.setAttribute("href", "contact.html");
        container.textContent = emailText;
        var iTag = document.createElement("i");
        iTag.className = "fas fa-envelope";
        container.prepend(iTag);
    });
}

function loadContactForm() {
    var contact = getContact();
    var emailEl = document.getElementById("contactEmail");
    var phoneEl = document.getElementById("contactPhone");
    var addressEl = document.getElementById("contactAddress");
    var telegramEl = document.getElementById("contactTelegram");
    var facebookEl = document.getElementById("contactFacebook");
    if (emailEl) emailEl.value = contact.email || "";
    if (phoneEl) phoneEl.value = contact.phone || "";
    if (addressEl) addressEl.value = contact.address || "";
    if (telegramEl) telegramEl.value = contact.telegram || "";
    if (facebookEl) facebookEl.value = contact.facebook || "";
}

document.addEventListener("DOMContentLoaded", function() {
    loadContactForm();

    var saveBtn = document.getElementById("saveContact");
    if (saveBtn) {
        saveBtn.addEventListener("click", function() {
            var data = {
                email: document.getElementById("contactEmail").value.trim(),
                phone: document.getElementById("contactPhone").value.trim(),
                address: document.getElementById("contactAddress").value.trim(),
                telegram: document.getElementById("contactTelegram").value.trim(),
                facebook: document.getElementById("contactFacebook").value.trim()
            };
            if (!data.email) {
                alert("Email is required.");
                return;
            }
            saveContact(data);

            var originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveBtn.style.background = "var(--success)";
            setTimeout(function() {
                saveBtn.innerHTML = originalHTML;
                saveBtn.style.background = "";
            }, 2000);
        });
    }

    var cancelBtn = document.getElementById("cancelContact");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            loadContactForm();
        });
    }

    var resetBtn = document.getElementById("resetContact");
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            if (confirm("Reset contact info to default?")) {
                saveContact(Object.assign({}, DEFAULT_CONTACT));
                loadContactForm();
            }
        });
    }

    var sendBtn = document.getElementById("sendMsg");
    if (sendBtn) {
        sendBtn.addEventListener("click", function() {
            var subject = document.getElementById("msgSubject").value.trim();
            var body = document.getElementById("msgBody").value.trim();
            if (!subject || !body) {
                alert("Please fill in subject and message.");
                return;
            }
            var contact = getContact();
            var msgKey = "inven_messages";
            var msgs = JSON.parse(localStorage.getItem(msgKey) || "[]");
            msgs.push({
                subject: subject,
                body: body,
                date: new Date().toLocaleString(),
                to: contact.email || "thoeurnseyhat@gmail.com"
            });
            localStorage.setItem(msgKey, JSON.stringify(msgs));
            document.getElementById("msgSubject").value = "";
            document.getElementById("msgBody").value = "";

            var originalHTML = sendBtn.innerHTML;
            sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            sendBtn.style.background = "var(--success)";
            setTimeout(function() {
                sendBtn.innerHTML = originalHTML;
                sendBtn.style.background = "";
            }, 2000);
        });
    }
});
