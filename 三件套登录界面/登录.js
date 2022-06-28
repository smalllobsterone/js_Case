let login_title = document.querySelector('.login-title');
let register_title = document.querySelector('.register-title');
let login = document.querySelector('.login');
let register = document.querySelector('.register');

login_title.addEventListener('click', () => {
    //判断是否收起，收起才可点击
    if (login.classList.contains('slide-up')) {
        register.classList.add('slide-up');
        login.classList.remove('slide-up');
    }
})
register_title.addEventListener('click', () => {
    if (register.classList.contains('slide-up')) {
        login.classList.add('slide-up');
        register.classList.remove('slide-up');
    }
})