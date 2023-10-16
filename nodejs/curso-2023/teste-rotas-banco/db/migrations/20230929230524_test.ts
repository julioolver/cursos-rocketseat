import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('test', (table) => {
        table.uuid('id').primary()
        table.string('title').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('test')
}

