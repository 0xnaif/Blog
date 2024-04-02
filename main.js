function showUserProf() {
    let userInfo_el = document.getElementsByClassName("info")[0];
    let overlay = document.getElementById("overlay");
    
    overlay.setAttribute("style", "display: block");
    userInfo_el.setAttribute("style", "display: flex");
}

function showEmail(element) {
    let back_el = document.getElementsByClassName("back")[0];
    let email_info = document.getElementsByClassName("email")[0];
    let email_el = element;
    let password_el = document.getElementsByClassName("password-choice")[0];
    let logout_el = document.getElementsByClassName("log-out")[0];
    
    back_el.setAttribute("style", "display: flex");
    email_el.setAttribute("style", "display: none");
    password_el.setAttribute("style", "display: none");
    logout_el.setAttribute("style", "display: none");
    email_info.setAttribute("style", "display: flex");
}

function showPassword(element) {
    let back_el = document.getElementsByClassName("back")[0];
    let password_info = document.getElementsByClassName("password")[0];
    let email_el = document.getElementsByClassName("email-choice")[0];
    let password_el = element;
    let logout_el = document.getElementsByClassName("log-out")[0];
    
    back_el.setAttribute("style", "display: flex");
    email_el.setAttribute("style", "display: none");
    password_el.setAttribute("style", "display: none");
    logout_el.setAttribute("style", "display: none");
    password_info.setAttribute("style", "display: flex");
}

function back() {
    let back_el = document.getElementsByClassName("back")[0];
    let email_info = document.getElementsByClassName("email")[0];
    let password_info = document.getElementsByClassName("password")[0];
    let email_el = document.getElementsByClassName("email-choice")[0];
    let password_el = document.getElementsByClassName("password-choice")[0];
    let logout_el = document.getElementsByClassName("log-out")[0];
    
    email_info.setAttribute("style", "display: none");
    password_info.setAttribute("style", "display: none");
    back_el.setAttribute("style", "display: none");
    email_el.setAttribute("style", "display: flex");
    password_el.setAttribute("style", "display: flex");
    logout_el.setAttribute("style", "display: flex");
}

function togglePasswordVisibility() {
    let passowrdField = document.getElementById("password");
    let passwordIcon = document.querySelector(".toggle-password");

    if (passowrdField.type === "password") {
        passowrdField.type = "text";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
    }
    else {
        passowrdField.type = "password";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
    }
}

function hideUserProf() {
    let userInfo_el = document.getElementsByClassName("info")[0];
    let overlay = document.getElementById("overlay");
    let back_el = document.getElementsByClassName("back")[0];
    let email_info = document.getElementsByClassName("email")[0];
    let email_el = document.getElementsByClassName("email-choice")[0];
    let password_el = document.getElementsByClassName("password-choice")[0];
    let logout_el = document.getElementsByClassName("log-out")[0];
    
    userInfo_el.setAttribute("style", "display: none");
    overlay.setAttribute("style", "display: none");
    email_info.setAttribute("style", "display: none");
    back_el.setAttribute("style", "display: none");
    email_el.setAttribute("style", "display: flex");
    password_el.setAttribute("style", "display: flex");
    logout_el.setAttribute("style", "display: flex");
}

function showConfirm(className) {
    let confirm_el = document.getElementsByClassName(className)[0];
    confirm_el.setAttribute("style", "display: flex");
}

function hideConfirm(className) {
    let confirm_el = document.getElementsByClassName(className)[0];
    confirm_el.setAttribute("style", "display: none");
}

const url = document.URL;

if (url.includes("posts")) {
    let deleteIcns = document.querySelectorAll(".main .posts i");
    for (let i =  0; i < deleteIcns.length; i++) {
        deleteIcns[i].addEventListener("click", () => {
            var postEl = deleteIcns[i].parentElement;
            postEl.remove();
        })
    }
}