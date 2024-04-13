    import db from "./db.js";
    import {signup, signin, verifyToken} from "./auth.js"
    import epxress from "express";
    import bodyParser from "body-parser";
    import cookieParser from "cookie-parser";
    const app = epxress();
    const port = 3000;

    app.use(epxress.static("public"));
    app.use(bodyParser.urlencoded({extended : true}));
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
    
    app.get("/about", (req, res) => {
        res.render("about");
    });

    app.get("/new-post", verifyToken, (req, res) => {
        res.render("new-post");
    });

    app.post("/new-post", verifyToken, (req, res) => {
        try {
            if (req.body.post === "Post") {
                const title = req.body.title;
                const content =  req.body.content;

                if (title === "" || content === "") {
                    const state = "Please complete all empty fields"
                    return res.render("new-post", {state : state, type : "error"});
                }
                const state = "New post added successfully"
                const userId = req.decoded.id;
                console.log("User id: ", userId);
                console.log("Title: ", title);
                console.log("Content: ", content);
                // await db.addNewPost([title, content, userId]);
                res.render("new-post", {state : state, type : "success"});
                setTimeout(() => {
                    if (!res.headersSent)
                        res.redirect("/");
                }, 2000);
            }
            else {
                res.redirect("/");
            }
        }
        catch (err) {
            console.error("An error occurred during adding new post: ", err);
            res.status(500).send("Internal server error")
        }
    });

    app.post("/home", (req, res) => {
        res.redirect("/");
    })

    app.get("/posts", verifyToken, (req, res) => {
        res.render("posts");
    });

    app.get("/view-post", verifyToken, (req, res) => {
        res.render("post_view");
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