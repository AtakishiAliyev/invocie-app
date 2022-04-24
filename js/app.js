const btn = document.querySelector('.btn-main');
const form = document.querySelector('.form-wrapper');
const overlay = document.querySelector('.form-overlay');
const select = document.querySelectorAll('.custom-select');

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