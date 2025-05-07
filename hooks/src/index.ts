import express from "express"
const app = express();

// Here we have to have a password to see that not a random user will hit this endpoint 
app.post("/hooks/catch/:userId/:zapId" , (req , res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    //store trigger in a db
    //then push it in a queue
})