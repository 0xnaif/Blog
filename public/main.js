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

function changeFocus() {
    console.log("We are here");
    let codeInputs = document.querySelectorAll(".main form .code input");

    for (let i = 0; i < codeInputs.length - 1; i++) {
        if (i === 0) {
            codeInputs[i + 1].focus();
        }
        codeInputs[i].addEventListener("input", () => {
            codeInputs[i + 1].focus();
        });
    }
}
const url = document.URL;

if (url.includes("posts")) {
    let postEl = document.querySelectorAll(".main .posts .post");
    for (let i =  0; i < postEl.length; i++) {
        postEl[i].addEventListener("click", (event) => {
            if (event.target.closest('.post') && !event.target.closest('.right'))
                window.location.href = "./view-post";
        })
    }
    
    let deleteIcns = document.querySelectorAll(".main .posts .post .right .fa-trash-can");
    for (let i =  0; i < deleteIcns.length; i++) {
        deleteIcns[i].addEventListener("click", () => {
            var postEl = deleteIcns[i].parentElement.parentElement;
            postEl.remove();
        })
    }

    let editIcns = document.querySelectorAll(".main .posts .post .right .fa-pen-to-square");
    for (let i =  0; i < editIcns.length; i++) {
        editIcns[i].addEventListener("click", () => {
            window.location.href = "./new-post";
        })
    }
}

if (url.includes("view")) {
    document.getElementById("backButton").addEventListener("click", () => {
        window.history.back();
    });
}