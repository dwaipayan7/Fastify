const validateToken = () =>{

    return new Promise((resolve, reject) =>{
        //token check logic
        // resolve();
        reject(new Error("User Token is invalid"));
    });

}


export const authHandler = (request, reply, done) =>{
    console.log("Checking auth...");

    validateToken().then(() => {
        
        done();

    }).catch((err) => {

        reply.code(401);
        done(err);

    });

    
    
}



