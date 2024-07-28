import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import crypto from "crypto";
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';

const saltRounds = 10;
// const secretKey = crypto.randomBytes(64).toString('hex');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const secretKeyFilePath = path.resolve(__dirname, 'key.txt');
const secretKey = fs.readFileSync(secretKeyFilePath, 'utf-8');
export async function signup(req, res, db) {
    try {
        const { email, password, confirmPassword } = req.body
        if (email == "" || password == "" || confirmPassword == "")
            return res.render("sign-up", {error: "Try again, incomplete fields"});
    
        if (!verifyEmail(email) || password.length < 8)
            return res.render("sign-up", {error: "Try again, incorrect email or password"});
    
        if (password != confirmPassword)
            return res.render("sign-up", {error: "Try again, confirm password doesn't match"});

        const result = await db.searchUser([email]);
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
                const token = jwt.sign({id : result.id, email : email}, secretKey, {expiresIn : "30m"});
                res.cookie("jwtToken", token, {
                    maxAge : 1800000,
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

    if (!verifyEmail(email) || password.length < 8)
        return res.render("sign-in", {error: "Try again, incorrect email or password"});


    const result = await db.searchUser([email]);
    if (result.rows.length == 0)
        return res.render("sign-in", {error: "User not found"});

    else {
        const user = result.rows[0];
        const storedPassword = user.password;

        bcrypt.compare(password, storedPassword, (err, result) => {
            if (err || !result)
                return res.render("sign-in", {error: "Try again, incorrect email or password"});

            const token = jwt.sign({id : user.id, email : email}, secretKey, {expiresIn : "30m"});
            res.cookie("jwtToken", token, {
                maxAge : 1800000,
                httpOnly: true,
                secure: false,
            });
            res.redirect("/");
        })
    }
}

export function newPassword(req, res, db) {
    try {
        const { password, confirmPassword } = req.body;
        if (password == "" || confirmPassword == "") {
            res.render("new_password", { error : "Try again, incomplete fields"});
        }
        else if (password.length < 8) {
            res.render("new_password", { error: "Try again, password length must have at least 8 characters" });
        }
        else if (password != confirmPassword) {
            res.render("new_password", {error: "Try again, confirm password doesn't match"});
        }
        else {
            const email = req.cookies.email;
            changePassword(password, email, db);
            res.redirect("/signin");
        }
    }
    catch (err) {
        console.error("An error occurred during creating a new password: ", err);
        res.status(500).send("Internal server error")
    }
}

export function changePassword(password, email, db) {
    try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("An error occurred during hashing: ", err);
                return res.status(500).send("Internal server error");
            }
            await db.changePassword([hash, email]);
        });
    }
    catch (err) {
        throw err;
    }
}

export function verifyEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function verifyPassword(req, res, db) {
    try {
        const { inputPassword  } = req.body;
        const email = req.decoded.email;
        const result = await db.searchUser([email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(inputPassword, storedPassword, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ message : "Incorrect password"});
                }
                res.status(200).json({ message : "Correct password"});
            })
        }
        else {
            res.status(404).json({ message : "User not found"});
        }
    }
    catch (err) {
        console.error("An error occurred during verifying password");
        res.status(500).json({ message : "Internal server error"});
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
    res.status(401).redirect("/signin");
}