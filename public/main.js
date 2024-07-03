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
    console.log(confirm_el);
    confirm_el.setAttribute("style", "display: flex");
}

function hideConfirm(className) {
    let confirm_el = document.getElementsByClassName(className)[0];
    confirm_el.setAttribute("style", "display: none");
}
let postID;
function showDeleteConfirm(postID) {
    document.getElementById("to-delete").value = postID;
    document.getElementsByClassName("delete-confirm")[0].style.display = "flex";;
    document.getElementById("overlay").style.display = "flex";
}

function hideDeleteConfirm(className) {
    let confirm_el = document.getElementsByClassName(className)[0];
    let overlay = document.getElementById("overlay");
    confirm_el.style.display = "none";
    overlay.style.display = "none";
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
    postEl.forEach(post => {
        post.addEventListener("click", (event) => {
            if (event.target.closest('.post') && !event.target.closest('.right')) {
                const postID = post.id;
                window.location.href = `/view-post?id=${postID}`;
            }
        });
    });
    
    let deleteIcns = document.querySelectorAll(".main .posts .post .right .fa-trash-can");
    document.getElementById("confirm-yes").addEventListener("click", async () => {
        const postID = document.getElementById("to-delete").value;
        if (postID) {
            try {
                const res = await fetch(`post/${postID}`, {
                    method : "DELETE",
                    headers : {
                        "Content-Type" : "application/json",
                    }
                });
                if (res.ok) {
                    const response = await res.json()
                    window.location.reload();
                }
                else {
                    const response = await res.json()
                    alert(response.message);
                }
            }
            catch (err) {
                alert('Error deleting post');
            }
            finally {
                hideDeleteConfirm("delete-confirm");
            }
        }
    })

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