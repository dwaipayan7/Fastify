import { config } from "dotenv";
import Fastify from 'fastify';
config()
import userRouter from './src/routes/user.js';
import fastifyMongodb from "@fastify/mongodb";


const fastify = new Fastify({
    logger: true,
});

fastify.register(userRouter);

fastify.register(fastifyMongodb, {
    forceClose: true,
    url: process.env.DB_URL,
}).after((err) => {
    if (err) {
        fastify.log.error('MongoDB connection failed:', err);
    } else {
        fastify.log.info('MongoDB connected successfully');
    }
});


fastify.get("/", async (request, reply) => {
    return {message: "Dwaipayan Biswas"};
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




