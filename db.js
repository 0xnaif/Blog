import pg from "pg";

class DB {
    #db;

    constructor() {
        this.#db = new pg.Client({
            user : "",
            host : "",
            database : "",
            password : "",
            port : 5432,
        });
    }

    async connect() {
        try {
            await this.#db.connect();
        }
        catch (err) {
            console.log(`An error occured during DB connection: ${err}`);
            throw err;
        }
    }

    async close() {
        try {
            await this.#db.end();
        }
        catch (err) {
            console.log(`An error occured during DB closing: ${err}`);
        }
    }
}

const db = new DB();
export default db;