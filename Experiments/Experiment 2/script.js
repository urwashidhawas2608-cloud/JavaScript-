// Demonstrating var
var shopName = "ABC Super Store";

// Demonstrating const
const GST = 0.05;      // 5%

function calculateBill() {

    // Demonstrating let
    let customerName = document.getElementById("name").value;
    let productName = document.getElementById("product").value;
    let price = Number(document.getElementById("price").value);
    let quantity = Number(document.getElementById("quantity").value);

    if (
        customerName === "" ||
        productName === "" ||
        price <= 0 ||
        quantity <= 0
    ) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Object
    let customer = {

        name: customerName,
        product: productName,
        price: price,
        quantity: quantity

    };

    // Destructuring
    const { name, product, price: p, quantity: q } = customer;

    // Calculations
    let subtotal = p * q;

    let gstAmount = subtotal * GST;

    let total = subtotal + gstAmount;

    // Date & Time
    let today = new Date().toLocaleString();

    // Template Literals
    document.getElementById("result").style.display = "block";

    document.getElementById("result").innerHTML = `

<h2>Billing Receipt</h2>

<p class="date">${today}</p>

<div class="bill-row">
<span>Store</span>
<span>${shopName}</span>
</div>

<div class="bill-row">
<span>Customer</span>
<span>${name}</span>
</div>

<div class="bill-row">
<span>Product</span>
<span>${product}</span>
</div>

<div class="bill-row">
<span>Price</span>
<span>₹${p.toFixed(2)}</span>
</div>

<div class="bill-row">
<span>Quantity</span>
<span>${q}</span>
</div>

<div class="bill-row">
<span>Subtotal</span>
<span>₹${subtotal.toFixed(2)}</span>
</div>

<div class="bill-row">
<span>GST (5%)</span>
<span>₹${gstAmount.toFixed(2)}</span>
</div>

<div class="bill-row total">
<span>Total</span>
<span>₹${total.toFixed(2)}</span>
</div>

`;

    console.log("Bill Generated Successfully");
}