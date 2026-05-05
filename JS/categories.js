var categories = JSON.parse(localStorage.getItem("inven_categories") || "[]");

function saveCategories() {
    localStorage.setItem("inven_categories", JSON.stringify(categories));
}

function renderCategories() {
    var body = document.getElementById("categoryBody");
    if (!body) return;

    var products = JSON.parse(localStorage.getItem("inven_products") || "[]");
    var catMap = {};
    products.forEach(function(p) {
        if (!catMap[p.category]) catMap[p.category] = { count: 0, total: 0 };
        catMap[p.category].count++;
        catMap[p.category].total += +p.total;
    });

    var html = "";
    if (categories.length === 0) {
        html = "<tr><td colspan='5' class='empty-state'><i class='fas fa-layer-group'></i><div>No categories yet</div></td></tr>";
    } else {
        for (var i = 0; i < categories.length; i++) {
            var info = catMap[categories[i]] || { count: 0, total: 0 };
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + categories[i] + "</td>";
            html += "<td><span class='badge badge-gray'>" + info.count + "</span></td>";
            html += "<td style='font-weight:600;color:var(--primary)'>" + formatMoney(info.total) + "</td>";
            html += "<td><button onclick='editCat(" + i + ")' class='btn-icon edit' title='Edit'><i class='fas fa-edit'></i></button><button onclick='deleteCat(" + i + ")' class='btn-icon delete' title='Delete'><i class='fas fa-trash'></i></button></td>";
            html += "</tr>";
        }
    }
    body.innerHTML = html;
}

function editCat(i) {
    var newName = prompt("Edit category name:", categories[i]);
    if (newName !== null) {
        newName = newName.trim().toLowerCase();
        if (newName && newName !== categories[i]) {
            if (categories.indexOf(newName) !== -1) {
                alert("Category already exists.");
                return;
            }
            categories[i] = newName;
            saveCategories();
            renderCategories();
            populateCategoryDropdown();
        }
    }
}

function deleteCat(i) {
    if (!confirm("Delete \"" + categories[i] + "\"?")) return;
    categories.splice(i, 1);
    saveCategories();
    renderCategories();
    populateCategoryDropdown();
}

var submitCat = document.getElementById("submitCat");
var catNameEl = document.getElementById("catName");

if (submitCat && catNameEl) {
    submitCat.addEventListener("click", function() {
        var name = catNameEl.value.trim().toLowerCase();
        if (!name) {
            alert("Please enter a category name.");
            return;
        }

        if (categories.indexOf(name) !== -1) {
            alert("Category already exists.");
            return;
        }

        categories.push(name);
        saveCategories();
        catNameEl.value = "";
        populateCategoryDropdown();
        renderCategories();
    });
}

function populateCategoryDropdown() {
    var select = document.getElementById("pCategory");
    if (!select) return;

    var current = select.value;
    select.innerHTML = '<option value="">Select category...</option>';

    categories.forEach(function(cat) {
        var opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(opt);
    });

    select.value = current;
}

renderCategories();
populateCategoryDropdown();
