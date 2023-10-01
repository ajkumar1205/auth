import Database from "bun:sqlite";

export class User {
    username: string;
    email: string;
    password: string;
    fname: string;
    lname: string;

    constructor(username: string, email: string, password: string, fname: string, lname: string){
        this.username = username;
        this.email = email;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
    }
}

export class DBMS {
    private db: Database;

    constructor(){
        this.db = new Database("db.sqlite");

        this.db.run(`CREATE TABLE IF NOT EXISTS users( 
                    username TEXT PRIMARY KEY,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL,
                    fname TEXT NOT NULL,
                    lname TEXT NOT NULL
                    );`);

        console.log("Database Created", this.db.filename);
    }

    async addUser(user: User): Promise<boolean>{
        const pw = await Bun.password.hash(user.password);
        try {
            this.db.run("INSERT INTO users(username, email, password, fname, lname) VALUES(?, ?, ?, ?, ?);",
            [user.username, user.email, pw, user.fname, user.lname]
            );
        }catch (_){
            console.log("User already exists");
            return false;
        }
        return true;
    }

    Users(): Array<User>{
        const query = this.db.query("SELECT * FROM users;");
        const list = query.all();
        var userList: Array<User> = []
        list.forEach((u) => {
            userList.push(u as User);
        });
        return userList;
    }

    getUser(username: string): User | null{
        const query = this.db.query("SELECT * FROM users WHERE username = ?;");
        const user = query.all(username);
        if(user.length<1) return null;
        return user[0] as User;
    }

    deleteUser(username: string): void{
        this.db.run("DELETE FROM users WHERE username = ?", [username]);
    }

    delete(): void{
        this.db.run("DELETE FROM users;");
    }
}
