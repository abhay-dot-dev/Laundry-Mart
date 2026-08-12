// EmailJS SETUP
emailjs.init("szwEkenpc5qaYIaO1")

// GLOBAL DOM VARIABLES

const addBtns = document.querySelectorAll(".add-item");
const removeBtns = document.querySelectorAll(".remove-item");
const cartList = document.getElementById("cart-list");
const totalAmount = document.getElementById("total-amount");
const bookNowBtn = document.getElementById("book-now-btn");
const formDetails = document.querySelector(".form-details")
const formDetailsInputs = document.querySelector(".form-details").querySelectorAll("input");
const subscribeBtn = document.querySelector(".subscribe-btn");
const newsletterSection = document.querySelector(".newsletter");

// STATE
const cart = []; // universal cart container

// INITIAL PAGE STATE
bookNowBtn.classList.add("disabled"); // disabled until an item is added

// FUNCTIONS

// rebuilds the cart list HTML from the cart array
function renderCart() {
    if (cart.length === 0) {
        cartList.innerHTML = `
        <div class="pdt-items" id="empty-cart">
            <ion-icon class="info-icon" name="information-circle-outline"></ion-icon>
            <p>No Items Added</p>
            <p>Add items to the cart from the service bar</p>
        </div>
        `;
        return;
    }

    let rowsHTML = "";
    for (let [index, item] of cart.entries()) {
        rowsHTML += `
        <div class="cart-row">
            <p>${index + 1}</p>
            <p>${item.name}</p>
            <p>${item.price}</p>
        </div> 
        `;
    }
    cartList.innerHTML = rowsHTML;
}

// recalculates and displays the total from the cart array
function updateTotal() {
    let calcTotal = 0;

    for (let item of cart) {
        let numPrice = parseFloat(item.price.replace("₹", "").replace(/\s/g, ""));
        calcTotal += numPrice;
    }

    totalAmount.innerHTML = `₹ ${calcTotal}`;
    return calcTotal;
}

// enables/disables the Book Now button based on cart contents
function updateBookBtnState() {
    if (cart.length > 0) {
        bookNowBtn.classList.remove("disabled");
    } else {
        bookNowBtn.classList.add("disabled");
    }
}

// hides the "add items to cart" warning popup once the cart has items
function hideWarningPopup() {
    if (cart.length > 0) {
        const rightPopupOne = document.getElementById("right-popup-1");
        rightPopupOne.classList.remove("show");
    }
}

// EVENT LISTENERS

// Add Item — pushes to cart, re-renders, updates total/button/popup, swaps buttons
for (let btn of addBtns) {
    btn.addEventListener('click', () => {
        const serviceItem = btn.parentElement.parentElement;
        const serviceId = serviceItem.dataset.id;
        const serviceName = serviceItem.querySelector(".service-name").textContent;
        const servicePrice = serviceItem.querySelector(".service-price").textContent;

        cart.push({
            id: serviceId,             // added serviceId for unique identification
            name: serviceName,
            price: servicePrice
        });

        renderCart();
        updateTotal();
        hideWarningPopup();
        updateBookBtnState();

        const addBtn = serviceItem.querySelector(".add-item");
        const removeBtn = serviceItem.querySelector(".remove-item");

        addBtn.style.display = "none";
        removeBtn.style.display = "flex";
    });
}

// Remove Item — removes from cart, re-renders, updates total/button, swaps buttons
for (let btn of removeBtns) {
    btn.addEventListener('click', () => {
        const serviceItem = btn.parentElement.parentElement;

        const serviceId = serviceItem.dataset.id;

        let index = cart.findIndex(item => item.id === serviceId); // deleting by id
        cart.splice(index, 1);

        renderCart();
        updateTotal();
        updateBookBtnState();

        const addBtn = serviceItem.querySelector(".add-item");
        const removeBtn = serviceItem.querySelector(".remove-item");

        addBtn.style.display = "flex";
        removeBtn.style.display = "none";
    });
}

// Booking form inputs — show warning popup if user clicks in while cart is empty
for (let formInputs of formDetailsInputs) {
    formInputs.addEventListener("click", () => {
        if (cart.length === 0) {
            const rightPopupOne = document.getElementById("right-popup-1");
            rightPopupOne.classList.add("show");
        }
    });
}

// Book Now — show confirmation popup (button is disabled/unclickable when cart is empty)
bookNowBtn.addEventListener("click", () => {
    const rightPopupTwo = document.getElementById("right-popup-2");

    const name = formDetailsInputs[2].value.trim();
    const email = formDetailsInputs[3].value.toLowerCase().trim();
    const phone = formDetailsInputs[4].value.trim();

    //Form validation
    if (name === "" | email === "" | phone === "") {
        alert("Please fill in all fields before booking.")
        return;
    }

    // checking if this is a valid email or not.
    // if not, trigger a alert message.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let services = "";
    for (let item of cart) {
        services += `${item.name} - ${item.price}\n`
    }

    const total = updateTotal();

    document.getElementById("services").value = services
    document.getElementById("total").value = total

    emailjs.sendForm(
        "service_owheyop",
        "template_vgo352k",
        formDetails
    )
        .then(() => {
            rightPopupTwo.classList.add("show");

            // Resetting form inputs
            formDetailsInputs[2].value = "";
            formDetailsInputs[3].value = "";
            formDetailsInputs[4].value = "";

            // Resetting items in cart
            cart.length = 0;
            renderCart();
            updateTotal();
            updateBookBtnState();

            // Resetting all the remove items btn to add item back again
            for (let btn of addBtns)
                btn.style.display = "flex";
            for (let btn of removeBtns)
                btn.style.display = "none";
        })
        .catch((error) => {
            console.log(error);
        })
});


subscribeBtn.addEventListener("click", () => {
    const fName = document.getElementById("Full Name").value.trim();
    const email = document.getElementById("Email").value.toLowerCase().trim();

    if (fName === "" | email === "") {
        alert("Please enter a valid name and email to subscribe.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    newsletterSection.innerHTML = `
    <p class="subscribe-thanks">
    <i class="ph ph-check"></i>
    Thanks for subscribing! We'll keep you updated.
    </p>
    `;

    const thanksMsg = document.querySelector(".subscribe-thanks");
    requestAnimationFrame(() => {
        thanksMsg.classList.add("show");
    });
});