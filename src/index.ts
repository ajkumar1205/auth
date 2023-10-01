import { Elysia, t } from "elysia";

import { DBMS } from "./db";
import { signUp, signInModel, signUpModel, signIn } from "./authentication";

// DATA DEFINITIONS, STRUCTURE, IMPORTANT STATES AND STRORES
const app = new Elysia().decorate("db", new DBMS());

// GENERAL END POINTS
app.get('/', () => ["/users", "/signup", "/signin"], { type : "application/json" });
app.get('/users', ({db}) => db.Users(), { type : "application/json" });

// AUTHENTICATION END POINTS
app.post('/signup', async ({ db , body }) => await signUp(db, body), { body: signUpModel });
app.post('/signin', async ({ db, body }) => await signIn(db, body), { body: signInModel });


// LISTENED PORT
app.listen(Bun.env.PORT as string);





console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
