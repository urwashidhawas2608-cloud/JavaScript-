/* =====================================================
   GLAM VAULT - BEAUTY CART
   SCRIPT.JS  (fixed)
   ===================================================== */


/* =========================
   PRODUCT DATA
   ========================= */

const products = [
    {
        id: 1,
        brand: "Chanel",
        name: "Rouge Allure Velvet Éternelle",
        price: 4200,
        image: "images/chanel-rouge-allure-velvet-eternelle.jpeg",
        badge: "Luxury"
    },

    {
        id: 2,
        brand: "Kay Beauty",
        name: "Cashmere Lip & Cheek Blur",
        price: 999,
        image: "images/kay-beauty-cashmere-lip-cheek-blur.jpeg",
        badge: "Popular"
    },

    {
        id: 3,
        brand: "KIKO Milano",
        name: "3D Hydra Lip Gloss",
        price: 1200,
        image: "images/kiko-milano-3d-hydra-lip-gloss.jpeg",
        badge: "Bestseller"
    },

    {
        id: 4,
        brand: "Laneige",
        name: "Lip Sleeping Mask Strawberry Shortcake",
        price: 1450,
        image: "images/laneige-lip-sleeping-mask-strawberry-shortcake.jpeg",
        badge: "Trending"
    },

    {
        id: 5,
        brand: "Victoria's Secret",
        name: "Velvet Petals Shimmer Mist",
        price: 2100,
        image: "images/victorias-secret-velvet-petals-shimmer-mist.jpeg",
        badge: "Featured"
    }
];


/* =========================
   CART
   ========================= */

let cart = [];

// FIX: store the coupon as a PERCENT, not a frozen rupee amount,
// so the discount always recalculates against the live subtotal.
let couponPercent = 0;

let appliedCouponCode = "";

let appliedCoupon = false;


/* =========================
   GET HTML ELEMENTS
   ========================= */

const productGrid =
    document.getElementById("productGrid");

const cartList =
    document.getElementById("cartList");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartCount =
    document.getElementById("cartCount");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const discountRow =
    document.getElementById("discountRow");

const deliveryElement =
    document.getElementById("delivery");

const grandTotalElement =
    document.getElementById("grandTotal");

const couponInput =
    document.getElementById("couponInput");

const couponButton =
    document.getElementById("couponButton");

const couponMessage =
    document.getElementById("couponMessage");

const tierNote =
    document.getElementById("tierNote");

const checkoutButton =
    document.getElementById("checkoutButton");


/* =========================
   CURRENCY FORMAT
   ========================= */

function formatPrice(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN") + ".00";
}


/* =========================
   DISPLAY PRODUCTS
   ========================= */

function displayProducts() {

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML = "";

    products.forEach(function(product) {

        const card =
            document.createElement("article");

        card.className = "pcard";

        card.innerHTML = `
            <div class="pcard-media">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.style.display='none'; this.nextElementSibling.insertAdjacentHTML('afterend','<div class=\\'img-fallback\\'>drop your photo in<br>/${product.image}</div>');"
                >

                <span class="pcard-badge">
                    ${product.badge}
                </span>

            </div>

            <div class="pcard-body">

                <div class="pcard-brand">
                    ${product.brand}
                </div>

                <h3 class="pcard-name">
                    ${product.name}
                </h3>

                <p class="pcard-price">
                    ${formatPrice(product.price)}
                </p>

                <div class="pcard-controls">

                    <div class="qty-stepper">

                        <button
                            type="button"
                            class="minus-button"
                            data-id="${product.id}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <span
                            id="quantity-${product.id}"
                        >1</span>

                        <button
                            type="button"
                            class="plus-button"
                            data-id="${product.id}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="btn-add"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        productGrid.appendChild(card);
    });

    addProductEvents();
}


/* =========================
   PRODUCT BUTTON EVENTS
   ========================= */

function addProductEvents() {

    const plusButtons =
        document.querySelectorAll(".plus-button");

    const minusButtons =
        document.querySelectorAll(".minus-button");

    const addButtons =
        document.querySelectorAll(".btn-add");


    plusButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            changeProductQuantity(id, 1);
        });
    });


    minusButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            changeProductQuantity(id, -1);
        });
    });


    addButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            const quantityElement =
                document.getElementById(
                    "quantity-" + id
                );

            const quantity =
                quantityElement
                    ? Number(quantityElement.textContent)
                    : 1;

            addToCart(id, quantity);

            // FIX: reset the on-card stepper back to 1 after adding,
            // so repeated "Add to Cart" clicks don't silently escalate.
            if (quantityElement) {
                quantityElement.textContent = "1";
            }

            button.textContent = "Added ✓";

            button.classList.add("added");

            setTimeout(function() {

                button.textContent =
                    "Add to Cart";

                button.classList.remove("added");

            }, 1000);
        });
    });
}


/* =========================
   CHANGE PRODUCT QUANTITY
   ========================= */

function changeProductQuantity(id, amount) {

    const quantityElement =
        document.getElementById(
            "quantity-" + id
        );

    if (!quantityElement) {
        return;
    }

    let quantity =
        Number(quantityElement.textContent);

    quantity += amount;

    if (quantity < 1) {
        quantity = 1;
    }

    if (quantity > 20) {
        quantity = 20;
    }

    quantityElement.textContent =
        quantity;
}


/* =========================
   ADD TO CART
   ========================= */

function addToCart(id, quantity) {

    const product =
        products.find(function(item) {
            return item.id === id;
        });

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(function(item) {
            return item.id === id;
        });


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            quantity: quantity
        });
    }


    renderCart();
}


/* =========================
   REMOVE FROM CART
   ========================= */

function removeFromCart(id) {

    cart =
        cart.filter(function(item) {
            return item.id !== id;
        });

    renderCart();
}


/* =========================
   UPDATE CART QUANTITY
   ========================= */

function updateCartQuantity(id, amount) {

    const item =
        cart.find(function(cartItem) {
            return cartItem.id === id;
        });

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    renderCart();
}


/* =========================
   RENDER CART
   ========================= */

function renderCart() {

    if (!cartList) {
        return;
    }

    cartList.innerHTML = "";


    if (cart.length === 0) {

        if (cartEmpty) cartEmpty.style.display = "block";

    } else {

        if (cartEmpty) cartEmpty.style.display = "none";
    }


    let totalItems = 0;


    cart.forEach(function(item) {

        const product =
            products.find(function(productItem) {
                return productItem.id === item.id;
            });

        if (!product) {
            return;
        }


        totalItems += item.quantity;


        const cartItem =
            document.createElement("li");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2242%22 height=%2242%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ffe4ee%22/></svg>'"
            >

            <div class="cart-item-info">

                <div class="cart-item-name">
                    ${product.name}
                </div>

                <div class="cart-item-meta">

                    <button
                        type="button"
                        class="cart-minus"
                        data-id="${product.id}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    ${item.quantity}

                    <button
                        type="button"
                        class="cart-plus"
                        data-id="${product.id}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

            </div>

            <div class="cart-item-price">
                ${formatPrice(
                    product.price * item.quantity
                )}
            </div>

            <button
                type="button"
                class="cart-item-remove"
                data-id="${product.id}"
                aria-label="Remove product"
            >
                ×
            </button>
        `;


        cartList.appendChild(cartItem);
    });


    if (cartCount) {
        cartCount.textContent =
            totalItems +
            (totalItems === 1 ? " item" : " items");
    }


    addCartEvents();

    calculateTotals();
}


/* =========================
   CART EVENTS
   ========================= */

function addCartEvents() {

    const removeButtons =
        document.querySelectorAll(
            ".cart-item-remove"
        );

    const plusButtons =
        document.querySelectorAll(
            ".cart-plus"
        );

    const minusButtons =
        document.querySelectorAll(
            ".cart-minus"
        );


    removeButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            removeFromCart(id);
        });
    });


    plusButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            updateCartQuantity(id, 1);
        });
    });


    minusButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const id =
                Number(button.dataset.id);

            updateCartQuantity(id, -1);
        });
    });
}


/* =========================
   GET SUBTOTAL
   ========================= */

function getSubtotal() {

    let subtotal = 0;


    cart.forEach(function(item) {

        const product =
            products.find(function(productItem) {
                return productItem.id === item.id;
            });

        if (product) {

            subtotal +=
                product.price * item.quantity;
        }
    });


    return subtotal;
}


/* =========================
   CALCULATE TOTALS
   ========================= */

function calculateTotals() {

    const subtotal = getSubtotal();

    // Automatic spend-based discount — applies on its own, no coupon needed:
    //   10% off once the cart crosses ₹1,000
    //   20% off once the cart crosses ₹2,000
    //   30% off once the cart crosses ₹3,000
    let autoDiscountPercent = 0;

    if (subtotal >= 3000) {
        autoDiscountPercent = 30;
    } else if (subtotal >= 2000) {
        autoDiscountPercent = 20;
    } else if (subtotal >= 1000) {
        autoDiscountPercent = 10;
    }

    // A coupon code can still be applied on top, but it only takes over
    // when it beats the automatic tier — the customer always gets
    // whichever discount is larger, never a worse one.
    let couponPercentIfValid = 0;

    if (appliedCoupon && subtotal > 0) {
        couponPercentIfValid = couponPercent;
    }

    const effectivePercent =
        Math.max(autoDiscountPercent, couponPercentIfValid);

    // FIX: discount is derived fresh from the CURRENT subtotal every
    // time, instead of reusing a rupee amount frozen at apply-time.
    // This also auto-corrects to 0 once the cart empties out, and
    // never lets the discount exceed the subtotal.
    let discount = 0;

    if (subtotal > 0 && effectivePercent > 0) {
        discount = Math.round(subtotal * (effectivePercent / 100));
    }


    let delivery = 0;


    if (subtotal > 0 && subtotal < 999) {

        delivery = 99;
    }


    const total =
        subtotal - discount + delivery;


    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);

    if (discountElement) discountElement.textContent = "-" + formatPrice(discount);

    if (deliveryElement) deliveryElement.textContent = formatPrice(delivery);

    if (grandTotalElement) grandTotalElement.textContent = formatPrice(total);


    if (discountRow) {
        discountRow.style.display = discount > 0 ? "flex" : "none";
    }


    updateTier(subtotal);
}


/* =========================
   DISCOUNT / DELIVERY MESSAGE
   ========================= */

function updateTier(subtotal) {

    if (!tierNote) {
        return;
    }


    if (subtotal === 0) {

        tierNote.textContent = "";
        tierNote.style.display = "none";  // FIX: hide the empty box instead of leaving a blank pill

        return;
    }

    tierNote.style.display = "block";


    if (subtotal < 999) {

        const remaining =
            999 - subtotal;

        tierNote.textContent =
            "Add " +
            formatPrice(remaining) +
            " more for free delivery.";

        return;
    }


    if (subtotal < 1999) {

        const remaining =
            1999 - subtotal;

        tierNote.textContent =
            "Add " +
            formatPrice(remaining) +
            " more and unlock a bigger beauty reward.";

        return;
    }


    tierNote.textContent =
        "You unlocked our premium beauty tier!";
}


/* =========================
   COUPON
   ========================= */

function applyCoupon() {

    if (!couponInput || !couponMessage) {
        return;
    }

    const code =
        couponInput.value
            .trim()
            .toUpperCase();


    if (code === "") {

        couponMessage.textContent =
            "Please enter a coupon code.";

        couponMessage.className =
            "coupon-msg err";

        return;
    }


    const subtotal =
        getSubtotal();


    if (subtotal === 0) {

        couponMessage.textContent =
            "Add products before applying a coupon.";

        couponMessage.className =
            "coupon-msg err";

        return;
    }


    if (code === "GLAM10") {

        couponPercent = 10;
        appliedCouponCode = code;
        appliedCoupon = true;


        couponMessage.textContent =
            "GLAM10 applied. You saved 10%!";

        couponMessage.className =
            "coupon-msg ok";


    } else if (code === "BEAUTY20") {

        couponPercent = 20;
        appliedCouponCode = code;
        appliedCoupon = true;


        couponMessage.textContent =
            "BEAUTY20 applied. You saved 20%!";

        couponMessage.className =
            "coupon-msg ok";


    } else {

        couponPercent = 0;
        appliedCouponCode = "";
        appliedCoupon = false;


        couponMessage.textContent =
            "Invalid coupon code.";

        couponMessage.className =
            "coupon-msg err";
    }


    calculateTotals();
}


/* =========================
   CHECKOUT
   ========================= */

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;
    }


    const total =
        grandTotalElement ? grandTotalElement.textContent : "";


    alert(
        "Thank you for shopping with Glam Vault!\n\n" +
        "Your order total is " +
        total +
        "."
    );
}


/* =========================
   BUTTON EVENTS
   ========================= */

if (couponButton) {

    couponButton.addEventListener(
        "click",
        applyCoupon
    );
}

if (couponInput) {

    couponInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") applyCoupon();
    });
}


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        checkout
    );
}


/* =========================
   INITIALIZE WEBSITE
   ========================= */

displayProducts();

renderCart();