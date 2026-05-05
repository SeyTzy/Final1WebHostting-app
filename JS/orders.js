var orders = JSON.parse(localStorage.getItem("inven_orders") || "[]");

function saveOrders() {
    localStorage.setItem("inven_orders", JSON.stringify(orders));
}

function renderOrders() {
    var body = document.getElementById("orderBody");
    if (!body) return;

    var html = "";
    if (orders.length === 0) {
        html = "<tr><td colspan='7' class='empty-state'><i class='fas fa-receipt'></i><div>No orders yet</div></td></tr>";
    } else {
        for (var i = 0; i < orders.length; i++) {
            var o = orders[i];
            html += "<tr>";
            html += "<td>" + (i + 1) + "</td>";
            html += "<td>" + o.customer + "</td>";
            html += "<td>" + o.product + "</td>";
            html += "<td>" + o.qty + "</td>";
            html += "<td style='font-weight:600;color:var(--primary)'>" + formatMoney(o.total) + "</td>";
            html += "<td>" + (o.date || "—") + "</td>";
            html += "<td><button onclick='editOrder(" + i + ")' class='btn-icon edit' title='Edit'><i class='fas fa-edit'></i></button><button onclick='deleteOrder(" + i + ")' class='btn-icon delete' title='Delete'><i class='fas fa-trash'></i></button></td>";
            html += "</tr>";
        }
    }
    body.innerHTML = html;
}

function editOrder(i) {
    var o = orders[i];
    var newCustomer = prompt("Customer:", o.customer);
    if (newCustomer === null) return;
    var newProduct = prompt("Product:", o.product);
    if (newProduct === null) return;
    var newQty = prompt("Qty:", o.qty);
    if (newQty === null) return;
    var newTotal = prompt("Total:", o.total);
    if (newTotal === null) return;
    if (newCustomer.trim() && newProduct.trim()) {
        orders[i].customer = newCustomer.trim();
        orders[i].product = newProduct.trim();
        orders[i].qty = newQty ? Number(newQty) : 1;
        orders[i].total = newTotal || "0";
        saveOrders();
        renderOrders();
    }
}

function deleteOrder(i) {
    orders.splice(i, 1);
    saveOrders();
    renderOrders();
}

var submitOrderBtn = document.getElementById("submitOrder");
if (submitOrderBtn) {
    submitOrderBtn.addEventListener("click", function() {
        var customer = document.getElementById("oCustomer");
        var product = document.getElementById("oProduct");
        var qty = document.getElementById("oQty");
        var total = document.getElementById("oTotal");

        if (!customer || !customer.value.trim() || !product || !product.value.trim()) {
            alert("Please fill in customer and product.");
            return;
        }

        orders.push({
            customer: customer.value.trim(),
            product: product.value.trim(),
            qty: qty && qty.value ? qty.value : 1,
            total: total && total.value ? total.value : "0",
            date: new Date().toLocaleDateString()
        });

        saveOrders();
        customer.value = "";
        product.value = "";
        if (qty) qty.value = "";
        if (total) total.value = "";
        renderOrders();
    });
}

renderOrders();
