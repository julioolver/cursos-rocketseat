import { knex as knexConfig, Knex } from "knex"

export const config = {
    connection: {
        filename: './db/app.db',
    },
    client: 'sqlite',
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex: Knex = knexConfig(config)