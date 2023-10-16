import fastify from "fastify";
import { knex } from "./database";

const app = fastify()

app.get('/test', async (req, res) => {
    const tables = await knex('sqlite_schema').select('*')
   return res.send(tables)
})

app.listen({
    port: 3333
}).then(() => {
    console.log('server na porta 3333')
})