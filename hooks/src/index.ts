import express from "express"
const app = express();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Here we have to have a password to see that not a random user will hit this endpoint 
app.post("/hooks/catch/:userId/:zapId" , async(req , res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    //store trigger in a db
    //then push it in a queue
    //we have to make such a system such that when the webhook is hit then we need to put the entry for that event in both the database and the queue at the same time and if any one of it will fail then we need to cancel the other one too. So it is like the transactions but for 2 systems.
    
    //We will put the trigger in 2 tables in the DB in a transaction and if any one of them fails them we cannot process that trigger
    await prisma.$transaction(async tx => {
        const run = await prisma.zapRuns.create({
            data:{
                zapId: zapId,
    
            }
        })
        await prisma.zapRunOutbox.create({
            data:{
                zapRunId: run.id
            }
        })
    })
})


app.listen(3000)
