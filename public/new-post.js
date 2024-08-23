document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-post");
    form.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            if (e.submitter.id == "backButton") {
                window.history.back();
            }
            else {
                const title = document.getElementById("title").value;
                const content = document.getElementById("postContent").value;
                if (title.length == 0 || content.length == 0) {
                    document.getElementById("content").innerText = "Please complete all empty fields";
                    document.getElementById("response").style.display = "flex";
                    setTimeout(() => {
                        document.getElementById("response").style.display = "none";
                    }, 3000)
                }
                else {
                    const response = await fetch("/new-post", {
                        method : "POST", 
                        headers : {
                            "Content-Type" : "application/json",
                        },
                        body : JSON.stringify({ title : title, content : content }),
                    });
                    if (response.ok) {
                        const res = await response.json();
                        document.getElementById("response").style.setProperty('--beforeBackgroundColor', "#63E6BE");
                        document.getElementById("content").style.color = "#63E6BE";
                        document.querySelector("#response i").style.color = "#63E6BE";
                        document.getElementById("content").innerText = res.message;
                        document.getElementById("response").style.display = "flex";
                        setTimeout(() => {
                            document.getElementById("response").style.display = "none";
                            window.location.href = "/posts";
                        }, 3000)
                    }
                    else {
                        window.location.href = "/signin";
                    }
                }
            }
        }
        catch (err) {
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
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText.length > 0) {
        console.log("inside");
        const span = document.createElement('span');
        span.style.fontSize = size;
        document.getElementById("editor").style.fontSize = size;
        span.textContent = selectedText;

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
    }
}