import { authHandler } from "../hooks/auth.js";
import fastifyMultipart from "@fastify/multipart";
import {pipeline} from 'node:stream/promises'
import fs from 'node:fs';


async function userRouter(fastify, opts){

    fastify.register(fastifyMultipart
        
        , {
        limits: {
            fieldNameSize: 100, // Max field name size in bytes
            fieldSize: 100,     // Max field value size in bytes
            fields: 10,         // Max number of non-file fields
            fileSize: 1000000,  // For multipart forms, the max file size in bytes
            files: 1,           // Max number of file fields
            headerPairs: 2000,  // Max number of header key=>value pairs
            parts: 1000         // For multipart forms, the max number of parts (fields + files)
          }
    }

);


    const createUserSchema ={
        body:{
            type: "object",
            required: ["name", "email", "password"],
            properties:{
                name: {type: "string"},
                email: {type: "string"},
                password: {type: "string"},
            }
        },

        response:{
            201:{
                type:'object',
                properties:{
                    id: {type: 'string'},
                }
            }
        }
    }


    fastify.post("/api/users", {schema: createUserSchema} ,async (request, reply) => {
        const {name, email, password} = request.body;

        const userCollection = fastify.mongo.db.collection('users');

        const result = await userCollection.insertOne({
            name,
            email,
            password  //bcrypt.hashSync(password, 10),
        });

        // console.log("Result: ", result);

        const insertedId = result.insertedId;

        fastify.log.info(`User Created: ${insertedId}`);


        // console.log(request.body);
        reply.code(201);

        //validate request
        return {
    
            id: insertedId,
        }

    });


    fastify.get("/api/users", async (request, reply) => {

        const userCollection = fastify.mongo.db.collection('users');

        const users = await userCollection.find().toArray();

        fastify.log.info("User List Returned");

        return users;

    });


    
    fastify.get("/api/users/query", async (request, reply) => {

        const {q} = request.query;
        console.log('query', request.query);
        

        const userCollection = fastify.mongo.db.collection('users');

        let query = {};

        if (q) {
            query = {
                name: { $regex: q, $options: 'i' } // for case insensitive search
            }
        }
        

        const users = await userCollection.find(query).toArray();

        fastify.log.info("User List Returned");

        return users;

    });

    //

    fastify.get("/api/users/:id", {preHandler: authHandler} ,async (request, reply) => {
        // const id = request.params.id;

        console.log('from user handler...', request.userId);
        

       const id = new fastify.mongo.ObjectId(request.params.id);

       const userCollection = fastify.mongo.db.collection('users');

       const users = await userCollection.findOne({ _id: id });

       return users;

    });


    fastify.post("/api/upload", async(request, reply) =>{

        const data = await request.file();

        // console.log(data);

        await pipeline(data.file, fs.createWriteStream(`static/${data.filename}`))
        

        reply.send();

    });

}

export default userRouter;