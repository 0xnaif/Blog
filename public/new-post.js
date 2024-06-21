const resElement = document.getElementById("response");
const state = resElement.dataset.state;
const type = resElement.dataset.type;

document.addEventListener("DOMContentLoaded", () => {
    if (state) {
        showPopUp(type);
    }
});

function showPopUp(type) {
    if (type === "success") {
        resElement.style.setProperty('--beforeBackgroundColor', "#63E6BE");
        
        setTimeout(() => {
            window.location.href = "/";
        }, 600);
    }
    
    else if (type === "error") {
        resElement.style.setProperty('--beforeBackgroundColor', '#F00'); 
        setTimeout(() => {
            resElement.style.display = "none";
        }, 600);
    }
}