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
