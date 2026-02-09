import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('series', (table) => {
      table.string('genre', 100).nullable()
      table.integer('release_year').nullable()
    })
    this.schema.alterTable('novels', (table) => {
      table.string('genre', 100).nullable()
      table.integer('release_year').nullable()
    })
  }

  async down() {
    this.schema.alterTable('series', (table) => {
      table.dropColumn('genre')
      table.dropColumn('release_year')
    })
    this.schema.alterTable('novels', (table) => {
      table.dropColumn('genre')
      table.dropColumn('release_year')
    })
  }
}
