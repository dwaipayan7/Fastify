import { config } from "dotenv";
import Fastify from 'fastify';
config()
import userRouter from './src/routes/user.js';


const fastify = new Fastify({
    logger: true,
});

fastify.register(userRouter);


fastify.get("/", async (request, reply) => {
    return { message: "Dwaipayan Biswas" };
});


const start = async() =>{

    const PORT = process.env.PORT || 4000;

    try {
        await fastify.listen({port:PORT})
        console.log(`Server listening on port ${PORT}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit();
    }
}

start();




