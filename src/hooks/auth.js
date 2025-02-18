const validateToken = () =>{

    return new Promise((resolve, reject) =>{
        //token check logic
        resolve({userId:'123'});
        // reject(new Error("User Token is invalid"));
    });

}


export const authHandler = (request, reply, done) =>{
    console.log("Checking auth...");

    validateToken().then(() => {
        
        done();

    }).catch((err) => {

        reply.code(401).send({
            success: 'false'
        })
        // done(err);

    });

    
    
}



