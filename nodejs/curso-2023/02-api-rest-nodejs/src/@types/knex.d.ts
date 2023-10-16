// eslint-disable-next-line
import { Knex } from 'knex'

// declare module é usado para você declarar a tipagem de forma global de uma lib/modulo, onde você pode declrar uma vazia, adicionar coisas a mais ou substituir.
declare module 'knex/types/tables' {
  export interface Tables {
    trasactions3: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
