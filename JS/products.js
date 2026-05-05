var data = JSON.parse(localStorage.getItem("inven_products") || "[]");
var mood = "create";
var tmp;
var searchMode = "name";

var nameEl = document.getElementById("pName");
var priceEl = document.getElementById("pPrice");
var taxesEl = document.getElementById("pTaxes");
var adsEl = document.getElementById("pAds");
var discountEl = document.getElementById("pDiscount");
var totalEl = document.getElementById("pTotal");
var qtyEl = document.getElementById("pQty");
var catEl = document.getElementById("pCategory");
var submitBtn = document.getElementById("submitBtn");
var formTitleEl = document.getElementById("formTitle");

function calcTotal() {
    if (priceEl && priceEl.value) {
        var q = qtyEl && qtyEl.value > 0 ? +qtyEl.value : 1;
        var result = ((+priceEl.value + (+taxesEl.value || 0) + (+adsEl.value || 0)) - (+discountEl.value || 0)) * q;
        if (totalEl) totalEl.textContent = result.toFixed(2);
        var preview = document.querySelector(".price-preview");
        if (preview) preview.classList.add("success");
    } else {
        if (totalEl) totalEl.textContent = "0";
        var preview = document.querySelector(".price-preview");
        if (preview) preview.classList.remove("success");
    }
}

function saveData() {
    localStorage.setItem("inven_products", JSON.stringify(data));
}

if (submitBtn) {
    submitBtn.addEventListener("click", function() {
        var item = {
            name: nameEl.value.trim().toLowerCase(),
            price: priceEl.value,
            taxes: taxesEl.value || "0",
            ads: adsEl.value || "0",
            discount: discountEl.value || "0",
            total: totalEl ? totalEl.textContent : "0",
            qty: qtyEl && qtyEl.value ? +qtyEl.value : 1,
            category: catEl.value.trim().toLowerCase()
        };

        if (!item.name || !item.price || !item.category) {
            alert("Please fill in Name, Price, and Category.");
            return;
        }

        if (mood === "create") {
            data.push(item);
        } else {
            data[tmp] = item;
            mood = "create";
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
            if (formTitleEl) formTitleEl.textContent = "Add New Product";
        }

        saveData();
        clearForm();
        renderTable();
        renderStats();
    });
}

function clearForm() {
    if (nameEl) nameEl.value = "";
    if (priceEl) priceEl.value = "";
    if (taxesEl) taxesEl.value = "";
    if (adsEl) adsEl.value = "";
    if (discountEl) discountEl.value = "";
    if (totalEl) totalEl.textContent = "0";
    if (qtyEl) qtyEl.value = "";
    if (catEl) catEl.value = "";
    calcTotal();
}

function renderTable() {
    var tbody = document.getElementById("productBody");
    if (!tbody) return;

    var isList = !document.title.includes("Add");
    var html = "";

    for (var i = 0; i < data.length; i++) {
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + data[i].name + "</td>";
        if (isList) {
            html += "<td>" + getCurrency() + data[i].price + "</td>";
            html += "<td>" + data[i].qty + "</td>";
            html += "<td style='font-weight:600;color:var(--primary)'>" + formatMoney(data[i].total) + "</td>";
            html += "<td><span class='badge badge-gray'>" + data[i].category + "</span></td>";
            html += "<td>";
            html += "<button onclick='editItem(" + i + ")' class='btn-icon edit' title='Edit'><i class='fas fa-edit'></i></button>";
            html += "<button onclick='deleteItem(" + i + ")' class='btn-icon delete' title='Delete'><i class='fas fa-trash'></i></button>";
            html += "</td>";
        } else {
            html += "<td style='font-weight:600;color:var(--primary)'>" + formatMoney(data[i].total) + "</td>";
            html += "<td><span class='badge badge-gray'>" + data[i].category + "</span></td>";
        }
        html += "</tr>";
    }

    var emptyMsg = isList ? "No products found" : "No products yet";
    tbody.innerHTML = html || "<tr><td colspan='" + (isList ? 7 : 4) + "' class='empty-state'><i class='fas fa-box-open'></i><div>" + emptyMsg + "</div></td></tr>";

    var deleteWrap = document.getElementById("deleteAllWrap");
    if (deleteWrap && isList) {
        if (data.length > 0) {
            deleteWrap.innerHTML = "<div style='padding:0 24px 16px'><button onclick='deleteAll()' class='btn btn-danger-outline btn-sm'><i class='fas fa-trash'></i> Delete All (" + data.length + ")</button></div>";
        } else {
            deleteWrap.innerHTML = "";
        }
    }
}

function renderStats() {
    var elTotal = document.getElementById("statTotal");
    var elValue = document.getElementById("statValue");
    var elCat = document.getElementById("statCategories");
    var elAvg = document.getElementById("statAvg");

    if (elTotal) elTotal.textContent = data.length;

    var totalVal = data.reduce(function(acc, item) { return acc + +item.total; }, 0);
    if (elValue) elValue.textContent = formatMoney(totalVal);

    var cats = data.map(function(item) { return item.category; });
    var uniqueCats = cats.filter(function(v, i) { return cats.indexOf(v) === i; });
    if (elCat) elCat.textContent = uniqueCats.length;

    var avg = data.length > 0 ? totalVal / data.length : 0;
    if (elAvg) elAvg.textContent = formatMoney(avg);
}

function editItem(i) {
    if (!nameEl) {
        localStorage.setItem("inven_edit", i);
        window.location.href = "products-add.html";
        return;
    }

    nameEl.value = data[i].name;
    priceEl.value = data[i].price;
    taxesEl.value = data[i].taxes;
    adsEl.value = data[i].ads;
    discountEl.value = data[i].discount;
    catEl.value = data[i].category;
    if (qtyEl) qtyEl.value = data[i].qty;
    calcTotal();

    if (formTitleEl) formTitleEl.textContent = "Edit Product";
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    mood = "update";
    tmp = i;

    window.scrollTo({ top: 200, behavior: "smooth" });
}

var editIndex = localStorage.getItem("inven_edit");
if (editIndex !== null) {
    localStorage.removeItem("inven_edit");
    window.addEventListener("load", function() {
        setTimeout(function() { editItem(+editIndex); }, 50);
    });
}

function deleteItem(i) {
    data.splice(i, 1);
    saveData();
    renderTable();
    renderStats();
}

function deleteAll() {
    if (!confirm("Delete all products?")) return;
    data = [];
    localStorage.removeItem("inven_products");
    renderTable();
    renderStats();
}

function setFilter(mode, btn) {
    searchMode = mode;
    document.querySelectorAll(".filter-btns button").forEach(function(b) { b.classList.remove("active"); });
    btn.classList.add("active");
    var input = document.getElementById("searchInput");
    if (input) {
        input.placeholder = mode === "name" ? "Search by name..." : "Search by category...";
        input.value = "";
        input.focus();
    }
    renderTable();
}

function handleSearch(val) {
    var tbody = document.getElementById("productBody");
    if (!tbody) return;

    var html = "";
    var found = false;

    for (var i = 0; i < data.length; i++) {
        var match = false;
        if (searchMode === "name") {
            match = data[i].name.indexOf(val.toLowerCase()) !== -1;
        } else {
            match = data[i].category.indexOf(val.toLowerCase()) !== -1;
        }

        if (match) {
            found = true;
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + data[i].name + "</td>";
            html += "<td>" + getCurrency() + data[i].price + "</td>";
            html += "<td>" + data[i].qty + "</td>";
            html += "<td style='font-weight:600;color:var(--primary)'>" + formatMoney(data[i].total) + "</td>";
            html += "<td><span class='badge badge-gray'>" + data[i].category + "</span></td>";
            html += "<td>";
            html += "<button onclick='editItem(" + i + ")' class='btn-icon edit' title='Edit'><i class='fas fa-edit'></i></button>";
            html += "<button onclick='deleteItem(" + i + ")' class='btn-icon delete' title='Delete'><i class='fas fa-trash'></i></button>";
            html += "</td>";
            html += "</tr>";
        }
    }

    if (!found && val) {
        html = "<tr><td colspan='7' class='empty-state'>No results for \"" + val + "\"</td></tr>";
    }

    tbody.innerHTML = html;
}

function populateCategoryDropdown() {
    var select = document.getElementById("pCategory");
    if (!select) return;

    var cats = JSON.parse(localStorage.getItem("inven_categories") || "[]");
    var current = select.value;
    select.innerHTML = '<option value="">Select category...</option>';

    cats.forEach(function(cat) {
        var opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(opt);
    });

    select.value = current;
}

if (qtyEl) qtyEl.addEventListener("keyup", calcTotal);

populateCategoryDropdown();
renderTable();
renderStats();
