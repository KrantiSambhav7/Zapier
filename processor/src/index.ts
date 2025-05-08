import { PrismaClient } from "./generated/prisma";
const client = new PrismaClient();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function poll(){
    const producer = kafka.producer()
    await producer.connect();
    const consumer = kafka.consumer({ groupId: 'test-group' })
    while(1){
        const res = await client.zapRunOutBox.findMany({
            take: 10,
        })
        producer.send({
            topic: "zap-events",
            messages: res.map(r => ({
                value: r.zapRunId
            }) 
        )})
        await client.zapRunOutBox.deleteMany({
            where:{
                id: {
                    in: res.map(r => r.id)
                }
            }
        });
    }
}
poll();
