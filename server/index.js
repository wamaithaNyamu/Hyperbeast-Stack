import express from "express";
import 'dotenv/config'
import colors from "colors";
import {graphqlHTTP} from "express-graphql";
import {schema} from "./schema/schema.js"
import {connectDB} from "../config/db.js"

const PORT = process.env.PORT || 5000;


const app = express();

//connect mongo
await connectDB();



app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development"
}));

app.listen(PORT, console.log(`Server running on ${PORT}`));