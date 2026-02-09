import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('series', (table) => {
      table.text('theme_url').nullable()
    })
    this.schema.alterTable('novels', (table) => {
      table.text('theme_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable('series', (table) => {
      table.dropColumn('theme_url')
    })
    this.schema.alterTable('novels', (table) => {
      table.dropColumn('theme_url')
    })
  }
}
