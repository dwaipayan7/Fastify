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
            200:{
                type:'object',
                properties:{
                    id: {type: 'string'},
                }
            }
        }
    }


    fastify.post("/api/users", {schema: createUserSchema} ,(request, reply) => {

        //validate request
        return {
            message: 'User Created',
            id: 'dfsajfkdsjfaksf'
        }

    });

}

export default userRouter;