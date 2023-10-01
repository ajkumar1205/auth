import { t } from "elysia";

import { DBMS, User } from "./db";


async function signUp(db: DBMS, body: any): Promise<Object>{
    const created = await db.addUser(new User(body.username.toLowerCase(), body.email, body.password, body.fname, body.lname));
    return created ? {"message": "User Created Successfully!"} : {"message": "User Already Exists!"};
}

const signUpModel = t.Object({
    username : t.String(),
    email : t.String(),
    password : t.String(),
    fname : t.String(),
    lname : t.String()
});

const signInModel = t.Object({
    username: t.String(),
    password: t.String()
});

async function signIn(db: DBMS, body: any){
    const pw = body.password.trim();
    const un = body.username.trim();
    const user = db.getUser(body.username);
    if(!user) return {"message" : "User Does not exists"};
    const verified = await Bun.password.verify(body.password, user.password);
    return verified ? user : {"message": "Please enter a valid password!"};
};


export { signIn, signUp, signUpModel, signInModel };