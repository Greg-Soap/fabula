import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('series', (table) => {
      table.text('short_description').nullable().alter()
      table.text('trailer_url').nullable().alter()
    })
    this.schema.alterTable('novels', (table) => {
      table.text('short_description').nullable().alter()
      table.text('external_link').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable('series', (table) => {
      table.string('short_description').nullable().alter()
      table.string('trailer_url').nullable().alter()
    })
    this.schema.alterTable('novels', (table) => {
      table.string('short_description').nullable().alter()
      table.string('external_link').nullable().alter()
    })
  }
}
