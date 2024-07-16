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
    let password_info = document.getElementsByClassName("password");
    let email_el = document.getElementsByClassName("email-choice")[0];
    let password_el = element;
    let logout_el = document.getElementsByClassName("log-out")[0];
    
    back_el.setAttribute("style", "display: flex");
    email_el.setAttribute("style", "display: none");
    password_el.setAttribute("style", "display: none");
    logout_el.setAttribute("style", "display: none");
    for (let passwordField of password_info) {
        passwordField.setAttribute("style", "display: flex");
    }
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
    document.getElementsByClassName(className)[0].style.display = 'none';
}

function showDeleteConfirm(postID) {
    document.getElementById("to-delete").value = postID;
    console.log(postID);
    document.getElementsByClassName("delete-confirm")[0].style.display = "flex";;
    document.getElementById("overlay").style.display = "flex";
}

function hideDeleteConfirm(className) {
    let confirm_el = document.getElementsByClassName(className)[0];
    let overlay = document.getElementById("overlay");
    confirm_el.style.display = "none";
    overlay.style.display = "none";
}

function hideShareConfirm(className) {
    document.getElementsByClassName(className)[0].style.display = 'none';
    document.getElementById("overlay").style.display = 'none';
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
                    const response = await res.json();
                    document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#63E6BE");
                    document.getElementById("content").style.color = "#63E6BE";
                    document.querySelector(".main #response i").style.color = "#63E6BE";
                    document.getElementById("response").style.display = "flex";
                    document.getElementById("content").innerText = response.message;
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                        window.location.reload();
                    }, 600);
                }
                else {
                    const response = await res.json(); 
                    document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#F00");
                    document.getElementById("content").style.color = "#F00";
                    document.querySelector(".main #response i").style.color = "#F00";
                    document.getElementById("response").style.display = "flex";
                    document.getElementById("content").innerText = response.message;
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                        window.location.reload();
                    }, 600);
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
            const postID =  editIcns[i].parentElement.parentElement.id;
            window.location.href = `./edit-post?id=${postID}`;
        })
    }

    let shareIcns = document.querySelectorAll(".main .posts .post .right .fa-share-nodes");
    for (let i = 0; i < shareIcns.length; i++) {
        shareIcns[i].addEventListener("click", () => {
            const title = shareIcns[i].dataset.title;
            const content = shareIcns[i].dataset.content;

            const formattedTitle = encodeURIComponent(`Title: ${title}`);
            const formattedContent = encodeURIComponent(`Content: ${content}`);
            const formattedText = `${formattedTitle}%0A${formattedContent}`;

            const twitterUrl = `https://twitter.com/intent/tweet?text=${formattedText}`;
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${formattedText}`;
            const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&summary=${formattedText}`;
            const telegramUrl = `https://t.me/share/url?text=${formattedText}`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${formattedText}`;
            const smsUrl = `sms:?body=${formattedText}`;

            document.getElementById("whatsapp").href = whatsappUrl;
            document.getElementById("copyLink").href = twitterUrl;
            document.getElementById("message").href = smsUrl;
            document.getElementById("telegram").href = telegramUrl;
            document.getElementById("twitter").href = twitterUrl;
            document.getElementById("linkedIn").href = linkedinUrl;

            document.getElementById("overlay").style.display = 'block';
            document.getElementById('shareForm').style.display = 'flex';

        });
    }
}

if (url.includes("view")) { 
    document.getElementById("backButton").addEventListener("click", () => {
        window.history.back();
    });

    let shareIcns = document.querySelectorAll(".main .fa-share-nodes");
    for (let i = 0; i < shareIcns.length; i++) {
        shareIcns[i].addEventListener("click", () => {
            const title = shareIcns[i].dataset.title;
            const content = shareIcns[i].dataset.content;
            
            const formattedTitle = encodeURIComponent(`Title: ${title}`);
            const formattedContent = encodeURIComponent(`Content: ${content}`);
            const formattedText = `${formattedTitle}%0A${formattedContent}`;

            const twitterUrl = `https://twitter.com/intent/tweet?text=${formattedText}`;
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?quote=${formattedText}`;
            const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&summary=${formattedText}`;
            const telegramUrl = `https://t.me/share/url?text=${formattedText}`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${formattedText}`;
            const smsUrl = `sms:?body=${formattedText}`;

            document.getElementById("whatsapp").href = whatsappUrl;
            document.getElementById("copyLink").href = twitterUrl;
            document.getElementById("message").href = smsUrl;
            document.getElementById("telegram").href = telegramUrl;
            document.getElementById("twitter").href = twitterUrl;
            document.getElementById("linkedIn").href = linkedinUrl;

            document.getElementById("overlay").style.display = 'block';
            document.getElementById('shareForm').style.display = 'flex';
        });
    }
}

function searchPost() {
    const searchValue = document.getElementById("searchPost").value.toLowerCase();
    const posts = document.getElementsByClassName("post");

    for (let post of posts) {
        const title = post.getElementsByClassName("title")[0].innerText.toLowerCase();
        if (title.includes(searchValue)) {
            post.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}