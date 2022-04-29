const openForm = document.querySelector('#openForm');
const formWrapper = document.querySelector('.form-wrapper');
const overlay = document.querySelector('.form-overlay');
const select = document.querySelectorAll('.custom-select');
const form = document.querySelector('#form');
const invoice_date = document.querySelector('#invoice_date');
let addItemBtn = document.querySelector(".add-item");
let isValid = true;

const data = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : [];

const today = new Date();
invoice_date.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

openForm.addEventListener('click', () => {
    formWrapper.classList.add('form-visible');
})

overlay.addEventListener('click', () => {
    formWrapper.classList.remove('form-visible');
})

select.forEach(select => {
    select.addEventListener('click', function () {
        const selected = this;
        selected.querySelector(".select-dropdown").classList.toggle('active');
        selected.querySelector(".select-value i").classList.toggle('active');
        const options = selected.querySelectorAll('.select-option');

        options.forEach(option => {
            option.addEventListener('click', function () {
                selected.querySelector(".select-value span").innerText = this.innerText;
                const dataDay = option.getAttribute('data-day');
                selected.querySelector(".select-value span").setAttribute('data-day', dataDay);
            })
        })
    })
})

// Add Item
addItemBtn.addEventListener("click", addItem);

function addItem() {
    let itemParent = document.querySelector(".item-datalist");
    let item = document.querySelector(".item-data").cloneNode(true);
    item.querySelector("#item").value = "New Item";
    item.querySelector("#qty").value = "0";
    item.querySelector("#price").value = "0";
    item.querySelector("#total").value = "0.00";
    itemParent.append(item);
    calculateAll();
    removeItem();
}

// Remove Item
function removeItem() {
    let deleteItemBtn = document.querySelectorAll(".delete");
    deleteItemBtn.forEach(del => {
        del.addEventListener("click", function () {
            console.log(document.querySelectorAll(".delete").length)
            if (document.querySelectorAll(".delete").length > 1) {
                console.log(del)
                del.closest(".item-data").remove();
            }
        })
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getInvoice();
    console.log(JSON.stringify(data, null, 2));
})

function getInvoice() {
    const sender_street_adress = document.querySelector('#sender_street_adress');
    const sender_city = document.querySelector('#sender_city');
    const sender_post_code = document.querySelector('#sender_post_code');
    const sender_country = document.querySelector('#sender_country');
    const userName = document.querySelector('#userName');
    const userEmail = document.querySelector('#userEmail');
    const client_adress = document.querySelector('#client_adress');
    const client_city = document.querySelector('#client_city');
    const client_post_code = document.querySelector('#client_post_code');
    const client_country = document.querySelector('#client_country');
    const invoice_date = document.querySelector('#invoice_date');
    const description = document.querySelector('#description');
    isValid = true;

    checkEmpty([
        sender_street_adress,
        sender_city,
        sender_post_code,
        sender_country,
        userName,
        client_adress,
        client_city,
        client_post_code,
        client_country,
        description
    ]);


    checkEmailInput(userEmail);

    if (isValid) {
        const result = getInvoiceValues([
            sender_street_adress,
            sender_city,
            sender_post_code,
            sender_country,
            userName,
            userEmail,
            client_adress,
            client_city,
            client_post_code,
            client_country,
            description,
            invoice_date,
        ])

        data.push(result);
        localStorage.setItem('data', JSON.stringify(data))
        formWrapper.classList.remove('form-visible');
    }


    getItemsTotal()

}

function checkEmpty(inputList) {
    inputList.forEach(input => {
        if (input.value.trim().length == 0) {
            input.previousElementSibling.children[0].classList.add('active');
            isValid = false;
        } else {
            input.previousElementSibling.children[0].classList.remove('active');
        }
    })
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function checkEmailInput(input) {
    {
        if (input.value.trim().length == 0) {
            input.previousElementSibling.children[0].classList.add('active');
            input.previousElementSibling.children[0].innerText = "can't be empty";
            isValid = false;

        } else if (!isEmail(input.value)) {
            input.previousElementSibling.children[0].classList.add('active');
            input.previousElementSibling.children[0].innerText = "Invalid email";
            isValid = false;

        } else {
            input.previousElementSibling.children[0].classList.remove('active');
            input.previousElementSibling.children[0].innerText = "can't be empty";
        }
    }
}

function getInvoiceValues(inputList) {
    const obj = {};
    const senderAddress = {};
    const clientAddress = {};
    const paymentTerms = document.querySelector('#payment_terms span').getAttribute('data-day');

    inputList.forEach(input => {
        if (input.id.includes('sender')) {
            senderAddress[input.id.replace('sender_', "")] = input.value;
            obj.senderAddress = senderAddress;
        } else if (input.id.includes('client')) {
            clientAddress[input.id.replace('client_', "")] = input.value;
            obj.clientAddress = clientAddress;
        } else {
            obj[input.id] = input.value;
            obj.status = "pending";
            obj.paymentTerms = Number(paymentTerms);
        }
    })

    const items = getItemValue();
    obj.items = items;
    const total = getItemsTotal();
    obj.total = total;

    return obj
}

function getItemValue() {
    const itemList = document.querySelectorAll('.item-data');
    const items = [];

    itemList.forEach(item => {
        const obj = {};

        const input = item.querySelectorAll('input');

        input.forEach(el => {
            obj[el.id] = el.value;
        })

        items.push(obj)
    })

    return items
}

function calculateAll() {
    const qty = document.querySelectorAll('#qty');
    const price = document.querySelectorAll('#price');

    calcTotal(qty, price);
    calcTotal(price, qty);

}

function calcTotal(a, b) {
    a.forEach(item => {
        item.addEventListener('keyup', () => {
            const x = item.value;
            const y = item.parentElement.parentElement.querySelector(`#${b[0].id}`).value;
            let total = item.parentElement.parentElement.querySelector('#total');
            total.value = +x * +y;
        })
    })
}

function getItemsTotal() {
    const items = getItemValue();

    const total = items.reduce((sum, item) => {
        return +sum + +item.total
    }, 0)

    return total;
}

calculateAll();