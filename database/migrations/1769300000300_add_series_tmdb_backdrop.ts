import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'series'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tmdb_id').nullable().unsigned()
      table.text('backdrop_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tmdb_id')
      table.dropColumn('backdrop_url')
    })
  }
}
