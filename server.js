import db from "./db.js";
import { signup, signin, newPassword, verifyToken, verifyEmail, verifyPassword, changePassword, logout } from "./auth.js"
import epxress from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app = epxress();
const port = 3000;

app.use(epxress.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", verifyToken, (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => {
    res.render("sign-up");
});

app.post("/signup", (req, res) => {
    signup(req, res, db);
});

app.get("/signin", (req, res) => {
    res.render("sign-in");
});

app.post("/signin", (req, res) => {
    signin(req, res, db);
});

app.post("/logout", (req, res) => {
    try {
        logout(res);
        res.status(200).json({ message : "Logged out successfully" })
    }
    catch (err) {
        console.error("An error occurred during logout: ", err);
        res.status(500).json({ message : "Internal server error" });
    }
})

app.get("/forgot-password", (req, res) => {
    res.render("forgot_password");
})

app.post("/forgot-password", (req, res) => {
    const { email } = (req.body);
    if (email == "") {
        res.render("forgot_password", { code : false, error : "Try again, incomplete fields" })
    }
    else {
        if (!verifyEmail(email))
            res.render("forgot_password", { code : false, error: "Try again, incorrect field" });
        else {
            // check if email is exist
            // Send email code
            res.cookie("email", email, {
                httpOnly : true,
                secure : false,
            });
            res.render("forgot_password", { code : true })
        }
    }
});

app.post("/verify-password", verifyToken, (req, res) => {
    verifyPassword(req, res, db);
});

app.post("/verifyCode", (req, res) => {
    const { one, second, third, forth } = req.body;
    const code = `${one}${second}${third}${forth}`;
    if (!code) {
        res.render("forgot_password", { code : true, codeError : "Try again, incomplete fields" })
    }
    else {
       const flag = true;
       if (!flag) {
            res.render("forgot_password", { code : true, codeError : "Try again, incorrect fields" })
       }
       else {
            res.redirect("/new-password")
       }
    }
});

app.get("/new-password", (req, res) => {
    res.render("new_password");
});

app.post("/new-password", async (req, res) => {
    newPassword(req, res, db);
});

app.post("/change-password", verifyToken, (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        if (newPassword.length < 8) {
            return res.status(400).json({ errorCode : 0 });
        }
        if (newPassword != confirmPassword) {
            return res.status(400).json({ errorCode : 1 });
        }
        const email = req.decoded.email;
        changePassword(newPassword, email, db);
        res.status(200).json({ message : "Password changed successfully"});
    }
    catch (err) {
        console.error("An error occurred during changing password: ", err);
        res.status(500).json({ message : "Internal server error" });
    }
})

app.get("/user-info", verifyToken, (req, res) => {
    try {
        const email = req.decoded.email;
        res.status(200).json({ info : email });
    }
    catch (err) {
        console.error("An error occurred during fetching user info: \n", err);
        res.status(500).json({ message : "Internal server error" });
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/new-post", verifyToken, (req, res) => {
    res.render("new-post");
});

app.post("/new-post", verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.decoded.id
        const data = [title, content, userId];
        await db.addNewPost(data);
        res.status(200).json({ message : "New post added successfully" });
    }
    catch (err) {
        console.error("An error occurred during adding new post: ", err);
        res.status(500).send("Internal server error");
    }
});

app.post("/home", (req, res) => {
    res.redirect("/");
})

app.get("/posts", verifyToken, async (req, res) => {
    const userID = req.decoded.id;
    const posts = await db.getUserPosts([userID]);
    res.render("posts", { posts });
});

app.get("/view-post/", verifyToken, async (req, res) => {
    const postID = req.query.id;
    const post = await db.getPostInfo([postID]);
    res.render("post_view", { post });
});

app.delete("/post/:id", verifyToken, async (req, res) => {
    try {
        const postID = req.params.id;
        const result = await db.deletePost([postID]);
        if (result.rowCount > 0) {
            res.status(200).json({ message : "Post deleted successfully"});
        }
        else {
            res.status(404).json({ message : "Post not found"});
        }
    }
    catch (err) {
        console.error("An error occurred during deleting post:\n", err);
        res.status(500).json({ message : "Internal server error"});
    }
});

app.get("/edit-post/", verifyToken, async (req, res) => {
    try {
        const postID = req.query.id;
        const post = await db.getPostInfo([postID]);
        res.render("edit_post", { post });
    }
    catch (err) {
        console.error("An error occurred during viewing post:\n", err);
        res.status(500).json({ message : "Internal server error"});
    }
});

app.put("/edit-post", verifyToken, async (req, res) => {
    try {
        const postID = req.query.id;
        const { title, content } = req.body;
        const result = await db.editPost([title, content, postID]);
        if (result.rowCount > 0) {
            res.status(200).json({ message : "Post edited successfully"});
        }
        else {
            res.status(400).json({ message : "Post was not edited"});
        }
    }
    catch (err) {
        console.error("An error occurred during editing post:\n", err);
        res.status(500).json({ message : "Internal server error"});
    }
});

db.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    })
    .catch((err) => {
        console.error("Error occurring during DB connection: ", err);
    })