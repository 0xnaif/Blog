document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("edit-form");
    form.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            if (e.submitter.id == "backButton") {
                window.history.back();
            }
            else {
                const title = document.getElementById("title").value;
                const content = document.getElementById("editor");
                const data = {
                    title : title,
                    content : content.innerHTML,
                };
                if (title.length == 0 || content.textContent.length == 0) {
                    document.getElementById("content").innerText = "Please complete all empty fields";
                    document.getElementById("response").style.display = "flex";
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                    }, 3000)
                }
                else {
                    const postID = document.querySelector(".main .post").id;
                    const response = await fetch(`/edit-post?id=${postID}`, {
                        method : "PUT",
                        headers : {
                            "Content-Type" : "application/json",
                        },
                        body : JSON.stringify(data),
                    });
                    if (response.ok) {
                        const res = await response.json();
                        document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#63E6BE");
                        document.getElementById("content").style.color = "#63E6BE";
                        document.querySelector("#response i").style.color = "#63E6BE";
                        document.getElementById("response").style.display = "flex";
                        document.getElementById("content").innerText = res.message;
                        setTimeout(() => {
                            document.getElementById("response").style.display = "none";
                            window.location.href = "/posts";
                        }, 3000);
                    }
                    else {
                        const res = await response.json();
                        document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#F00");
                        document.getElementById("content").style.color = "#F00";
                        document.querySelector("#response i").style.color = "#F00";
                        document.getElementById("response").style.display = "flex";
                        document.getElementById("content").innerText = res.message;
                        setTimeout(() => {
                            document.getElementById("response").style.display = "none";
                            window.location.href = "/posts";
                        }, 3000);
                    }
                }
            }
        }
        catch(err) {
            alert("Error editing post");
            window.location.href = "/signin";
        }
    })
});

function applyCommand(command) {
    document.execCommand(command, false, null);
    
}

const editor = document.getElementById("editor");
const editorContainer = document.getElementById("editorContainer");

editor.addEventListener("focus", () => {
    editorContainer.classList.add("focused");
});

editor.addEventListener("blur", () => {
    editorContainer.classList.remove("focused");
});

function changeFontSize(size) {
    document.execCommand("fontSize", false, size);
}