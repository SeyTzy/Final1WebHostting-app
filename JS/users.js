var users = JSON.parse(localStorage.getItem("inven_users_list") || "[]");

function saveUsers() {
    localStorage.setItem("inven_users_list", JSON.stringify(users));
}

function renderUsers() {
    var body = document.getElementById("userBody");
    if (!body) return;

    var html = "";
    if (users.length === 0) {
        html = "<tr><td colspan='5' class='empty-state'><i class='fas fa-user-group'></i><div>No users yet</div></td></tr>";
    } else {
        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + u.name + "</td>";
            html += "<td>" + (u.phone || "—") + "</td>";
            html += "<td><span class='badge badge-blue'>" + (u.role || "User") + "</span></td>";
            html += "<td><button onclick='editUser(" + i + ")' class='btn-icon edit' title='Edit'><i class='fas fa-edit'></i></button><button onclick='deleteUser(" + i + ")' class='btn-icon delete' title='Delete'><i class='fas fa-trash'></i></button></td>";
            html += "</tr>";
        }
    }
    body.innerHTML = html;
}

function editUser(i) {
    var u = users[i];
    var newName = prompt("Name:", u.name);
    if (newName === null) return;
    var newPhone = prompt("Phone:", u.phone || "");
    if (newPhone === null) return;
    var newRole = prompt("Role:", u.role || "User");
    if (newRole === null) return;
    if (newName.trim()) {
        users[i].name = newName.trim();
        users[i].phone = newPhone.trim();
        users[i].role = newRole.trim() || "User";
        saveUsers();
        renderUsers();
    }
}

function deleteUser(i) {
    users.splice(i, 1);
    saveUsers();
    renderUsers();
}

var submitUserBtn = document.getElementById("submitUser");
if (submitUserBtn) {
    submitUserBtn.addEventListener("click", function() {
        var name = document.getElementById("uName");
        var phone = document.getElementById("uPhone");
        var role = document.getElementById("uRole");

        if (!name || !name.value.trim()) {
            alert("Please enter a name.");
            return;
        }

        users.push({
            name: name.value.trim(),
            phone: phone ? phone.value.trim() : "",
            role: role ? role.value.trim() : "User"
        });

        saveUsers();
        if (name) name.value = "";
        if (phone) phone.value = "";
        if (role) role.value = "";
        renderUsers();
    });
}

renderUsers();
