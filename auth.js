import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const saltRounds = 10;
const secretKey = crypto.randomBytes(64).toString('hex');

export async function signup(req, res, db) {
    try {
        const { email, password, confirmPassword } = req.body
        if (email == "" || password == "" || confirmPassword == "")
            return res.render("sign-up", {error: "Try again, incomplete fields"});
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || password.length < 8)
            return res.render("sign-up", {error: "Try again, incorrect email or password"});
    
        if (password != confirmPassword)
            return res.render("sign-up", {error: "Try again, confirm password doesn't match"});

        const result = await db.searchUser(email);
        if (result.rows.length > 0)
            return res.render("sign-up", {error: "User already exists"});

        else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("An error occurred during hashing: ", err);
                    return res.status(500).send("Internal server error");
                }        
                const data = ["Test", email, hash];
                const result = await db.addNewUser(data);
                const token = jwt.sign({id : result.id, email : email}, secretKey, {expiresIn : "1m"});
                res.cookie("jwtToken", token, {
                    maxAge : 60000,
                    httpOnly: true,
                    secure: false,
                });
                res.redirect("/");
            });
        }
        }
    catch (err) {
        console.error("An error occurred during sign up: ", err);
        res.status(500).send("Internal server error")
    }
}

export async function signin(req, res, db) {
    const { email, password } = req.body
    if (email == "" || password == "")
        return res.render("sign-in", {error: "Try again, incomplete fields"});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8)
        return res.render("sign-in", {error: "Try again, incorrect email or password"});


    const result = await db.searchUser(email);
    if (result.rows.length == 0)
        return res.render("sign-in", {error: "User not found"});

    else {
        const user = result.rows[0];
        const storedPassword = user.password;
        
        bcrypt.compare(password, storedPassword, (err, result) => {
            if (err || !result)
                return res.render("sign-in", {error: "Try again, incorrect email or password"});

            const token = jwt.sign({id : user.id, email : email}, secretKey, {expiresIn : "2m"});
            res.cookie("jwtToken", token, {
                maxAge : 120000,
                httpOnly: true,
                secure: false,
            });
            res.redirect("/");
        })
    }
}

function verify(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return { verified : true, decoded : decoded };
    }
    catch (err) {
        return { verified : false, decoded : null };
    }
}

export function verifyToken(req, res, next) {
    const token = req.cookies.jwtToken;
    if (token) {
        const { verified, decoded } = verify(token);
        if (verified) {
            req.decoded = decoded;
            return next();
        }
    }
    res.status(401).send("Unauthorized");
}