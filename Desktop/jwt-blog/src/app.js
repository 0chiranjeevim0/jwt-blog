const express = require("express");
const jwt = require("jsonwebtoken");



const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

app.get('/',(request,response) =>{
    response.json({message:"hello, world"});
})

//array to store user posts

const posts = [
    {name:"chiranjeevi",caption:"new york is awsome"},
    {name:"robert",caption:"it is sunny outside"}
]

app.post('/login',(request,response) =>{
    //generate token directly by passing user data from the body of the request
    //if need authendication can be implemented
    const userdata = {name:request.body.name,password:request.body.password};
    const token = generateToken(userdata);
    response.json({token:token});
})

app.get('/posts',verifyToken,(request,response) =>{
    jwt.verify(request.token,"my_secret_key",(error,userdata) =>{
        if(error){
            response.json({error:error.message});
        }else{
            response.json({posts:posts.filter((post) => post.name === userdata.name)})
        }
    })
})


//function to generate a access token

const generateToken = (data) =>{
    return jwt.sign(data,"my_secret_key");
}

//middleware function to verify jwt token
function verifyToken(request,response,next){
    const bearerHeader = request.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        request.token = token;
        next();

    }else{
        response.sendStatus(403);
    }
}
app.listen(PORT,(error) =>{
    if(!error){
        console.log(`SERVER STARTED IN PORT ${PORT}`)
    }
})


