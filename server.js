    import epxress from "express";
    import bodyParser from "body-parser";
    const app = epxress();
    const port = 3000;

    app.use(epxress.static("public"));
    app.use(bodyParser.urlencoded({extended : true}));
    app.set("view engine", "ejs");

    app.get("/", (req, res) => {
        res.render("home");
    });

    app.get("/signup", (req, res) => {
        res.render("sign-up");
    });

    app.get("/signin", (req, res) => {
        res.render("sign-in");
    });

    app.get("/about", (req, res) => {
        res.render("about");
    });

    app.get("/new-post", (req, res) => {
        res.render("new-post");
    });

    app.post("/home", (req, res) => {
        res.redirect("/");
    })

    app.get("/posts", (req, res) => {
        res.render("posts");
    });

    app.get("view-post", (req, res) => {
        res.render("post_view");
    }); 

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
    });