async function userRouter(fastify, opts){


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

}

export default userRouter;