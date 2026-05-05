var DEFAULT_SETTINGS = {
    storeName: "InvenTrack",
    currency: "$",
    accentColor: "#6366f1",
    theme: "system",
    groupItems: true,
    showSubIssues: true,
    defaultOrder: "created"
};

function getSettings() {
    var saved = localStorage.getItem("inven_settings");
    if (!saved) return Object.assign({}, DEFAULT_SETTINGS);
    var parsed = JSON.parse(saved);
    return Object.assign({}, DEFAULT_SETTINGS, parsed);
}

function saveSettings(settings) {
    localStorage.setItem("inven_settings", JSON.stringify(settings));
}

function getCurrency() {
    return getSettings().currency || "$";
}

function getCurrencyName() {
    return getCurrency() === "$" ? "USD" : "Riel";
}

function formatMoney(amount) {
    var currency = getCurrency();
    var value = Number(amount);
    if (currency === "៛") {
        value = value * 4000;
    }
    return currency + value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
}

function hexToHSL(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return {h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100)};
}

function applyAccentColor(hex) {
    var hsl = hexToHSL(hex);
    var root = document.documentElement.style;
    root.setProperty("--primary", hex);
    root.setProperty("--primary-hover", "hsl(" + hsl.h + ", " + (hsl.s) + "%, " + Math.max(hsl.l - 10, 0) + "%)");
    root.setProperty("--primary-light", "hsl(" + hsl.h + ", " + (hsl.s) + "%, " + Math.min(hsl.l + 10, 100) + "%)");
    root.setProperty("--primary-bg", "hsla(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%, 0.08)");
    root.setProperty("--border-focus", hex);
}

function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === "dark") {
        html.classList.add("dark-mode");
        html.classList.remove("light-mode");
        applyDarkVars();
    } else if (theme === "light") {
        html.classList.add("light-mode");
        html.classList.remove("dark-mode");
        applyLightVars();
    } else {
        html.classList.remove("dark-mode", "light-mode");
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            applyDarkVars();
        } else {
            applyLightVars();
        }
    }
}

function applyDarkVars() {
    var root = document.documentElement.style;
    root.setProperty("--bg-body", "#0f172a");
    root.setProperty("--bg-surface", "#1e293b");
    root.setProperty("--bg-sidebar", "#020617");
    root.setProperty("--bg-sidebar-hover", "rgba(255, 255, 255, 0.08)");
    root.setProperty("--bg-input", "#1e293b");
    root.setProperty("--bg-muted", "#334155");
    root.setProperty("--text-primary", "#f8fafc");
    root.setProperty("--text-secondary", "#cbd5e1");
    root.setProperty("--text-muted", "#64748b");
    root.setProperty("--text-sidebar", "#94a3b8");
    root.setProperty("--border", "#334155");
    root.setProperty("--border-light", "#1e293b");
}

function applyLightVars() {
    var root = document.documentElement.style;
    root.setProperty("--bg-body", "#f1f5f9");
    root.setProperty("--bg-surface", "#ffffff");
    root.setProperty("--bg-sidebar", "#0f172a");
    root.setProperty("--bg-sidebar-hover", "rgba(255, 255, 255, 0.06)");
    root.setProperty("--bg-input", "#ffffff");
    root.setProperty("--bg-muted", "#f8fafc");
    root.setProperty("--text-primary", "#0f172a");
    root.setProperty("--text-secondary", "#475569");
    root.setProperty("--text-muted", "#94a3b8");
    root.setProperty("--text-sidebar", "#94a3b8");
    root.setProperty("--border", "#e2e8f0");
    root.setProperty("--border-light", "#f1f5f9");
}

function loadSettingsUI() {
    var settings = getSettings();

    var storeNameEl = document.getElementById("settingStoreName");
    if (storeNameEl) {
        storeNameEl.value = settings.storeName;
    }

    var savedCurrency = settings.currency || "$";
    var currencyOptions = document.querySelectorAll(".currency-option");
    currencyOptions.forEach(function(opt) {
        var radio = opt.querySelector('input[type="radio"]');
        if (radio.value === savedCurrency) {
            opt.classList.add("active");
            radio.checked = true;
        } else {
            opt.classList.remove("active");
        }
    });

    var savedColor = settings.accentColor || "#6366f1";
    var swatches = document.querySelectorAll(".swatch");
    swatches.forEach(function(swatch) {
        swatch.classList.remove("active");
        var dataColor = swatch.getAttribute("data-color");
        if (dataColor && dataColor === savedColor) {
            swatch.classList.add("active");
        }
    });
    var customColorInput = document.getElementById("customColor");
    if (customColorInput) {
        customColorInput.value = savedColor;
    }
    if (!document.querySelector(".swatch.active")) {
        var customSwatch = document.querySelector(".custom-swatch");
        if (customSwatch) customSwatch.classList.add("active");
    }

    var savedTheme = settings.theme || "system";
    var themeCards = document.querySelectorAll(".theme-card");
    themeCards.forEach(function(card) {
        card.classList.remove("active");
        var dataTheme = card.getAttribute("data-theme");
        if (dataTheme === savedTheme) {
            card.classList.add("active");
            var radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }
    });

    var optGroup = document.getElementById("optGroup");
    if (optGroup) optGroup.checked = settings.groupItems !== false;
    var optSubIssues = document.getElementById("optSubIssues");
    if (optSubIssues) optSubIssues.checked = settings.showSubIssues !== false;
    var optOrder = document.getElementById("optOrder");
    if (optOrder) optOrder.value = settings.defaultOrder || "created";
}

function setupEventListeners() {
    var currencyOptions = document.querySelectorAll(".currency-option");
    currencyOptions.forEach(function(opt) {
        opt.addEventListener("click", function(e) {
            e.preventDefault();
            currencyOptions.forEach(function(o) { o.classList.remove("active"); });
            opt.classList.add("active");
            var radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    var swatches = document.querySelectorAll(".swatch");
    swatches.forEach(function(swatch) {
        swatch.addEventListener("click", function(e) {
            var input = swatch.querySelector('input[type="color"]');
            if (input && e.target === input) return;
            swatches.forEach(function(s) { s.classList.remove("active"); });
            swatch.classList.add("active");
            var color = swatch.getAttribute("data-color");
            if (color) {
                applyAccentColor(color);
                var customInput = document.getElementById("customColor");
                if (customInput) customInput.value = color;
            }
        });
    });

    var customColorInput = document.getElementById("customColor");
    if (customColorInput) {
        customColorInput.addEventListener("input", function() {
            swatches.forEach(function(s) { s.classList.remove("active"); });
            var customSwatch = document.querySelector(".custom-swatch");
            if (customSwatch) customSwatch.classList.add("active");
            applyAccentColor(customColorInput.value);
        });
    }

    var themeCards = document.querySelectorAll(".theme-card");
    themeCards.forEach(function(card) {
        card.addEventListener("click", function(e) {
            e.preventDefault();
            themeCards.forEach(function(c) { c.classList.remove("active"); });
            card.classList.add("active");
            var radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            applyTheme(card.getAttribute("data-theme"));
        });
    });

    var saveBtn = document.getElementById("saveSettings");
    if (saveBtn) {
        saveBtn.addEventListener("click", function() {
            var activeCurrency = document.querySelector(".currency-option.active");
            var activeSwatch = document.querySelector(".swatch.active[data-color]");
            var customInput = document.getElementById("customColor");
            var color = activeSwatch ? activeSwatch.getAttribute("data-color") : (customInput ? customInput.value : "#6366f1");
            var activeTheme = document.querySelector(".theme-card.active");
            var settings = {
                storeName: document.getElementById("settingStoreName") ? document.getElementById("settingStoreName").value.trim() : "InvenTrack",
                currency: activeCurrency ? activeCurrency.getAttribute("data-value") : "$",
                accentColor: color,
                theme: activeTheme ? activeTheme.getAttribute("data-theme") : "system",
                groupItems: document.getElementById("optGroup") ? document.getElementById("optGroup").checked : true,
                showSubIssues: document.getElementById("optSubIssues") ? document.getElementById("optSubIssues").checked : true,
                defaultOrder: document.getElementById("optOrder") ? document.getElementById("optOrder").value : "created"
            };
            saveSettings(settings);

            var originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveBtn.style.background = "var(--success)";
            setTimeout(function() {
                saveBtn.innerHTML = originalHTML;
                saveBtn.style.background = "";
            }, 2000);
        });
    }

    var cancelBtn = document.getElementById("cancelSettings");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            loadSettingsUI();
            var settings = getSettings();
            applyAccentColor(settings.accentColor || "#6366f1");
            applyTheme(settings.theme || "system");
        });
    }

    var resetBtn = document.getElementById("resetDefaults");
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            if (confirm("Reset all settings to default?")) {
                saveSettings(Object.assign({}, DEFAULT_SETTINGS));
                loadSettingsUI();
                applyAccentColor(DEFAULT_SETTINGS.accentColor);
                applyTheme(DEFAULT_SETTINGS.theme);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadSettingsUI();
    var settings = getSettings();
    applyAccentColor(settings.accentColor || "#6366f1");
    applyTheme(settings.theme || "system");
    setupEventListeners();
});

if (document.readyState !== "loading") {
    loadSettingsUI();
    var settings = getSettings();
    applyAccentColor(settings.accentColor || "#6366f1");
    applyTheme(settings.theme || "system");
    setupEventListeners();
}
