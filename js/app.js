const btn = document.querySelector('.btn-main');
const form = document.querySelector('.form-wrapper');
const overlay = document.querySelector('.form-overlay');
const select = document.querySelectorAll('.custom-select');
let addItemBtn=document.querySelector(".add-item");

btn.addEventListener('click', () => {
    form.classList.add('form-visible');
})

overlay.addEventListener('click', () => {
    form.classList.remove('form-visible');
})

select.forEach(select => {
    select.addEventListener('click', function() {
        const selected = this;
        selected.querySelector(".select-dropdown").classList.toggle('active');
        selected.querySelector(".select-value i").classList.toggle('active');
        const options = selected.querySelectorAll('.select-option');
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                selected.querySelector(".select-value span").innerText = this.innerText;
            })
        })
    })
})

// Add Item
addItemBtn.addEventListener("click",addItem);

function addItem(){
    let itemParent=document.querySelector(".item-datalist");
    let item=document.querySelector(".item-data").cloneNode(true);
    item.querySelector("#item").value="New Item";
    item.querySelector("#qty").value="0";
    item.querySelector("#price").value="0";
    item.querySelector("#total").value="0.00";
    itemParent.append(item);
    removeItem();
}

// Remove Item
function removeItem(){
    let deleteItemBtn=document.querySelectorAll(".delete");
    deleteItemBtn.forEach(del=>{
    del.addEventListener("click",function(){
        console.log(document.querySelectorAll(".delete").length)
        if(document.querySelectorAll(".delete").length>1){
        console.log(del)
        del.closest(".item-data").remove();
        }
    })
    })
}