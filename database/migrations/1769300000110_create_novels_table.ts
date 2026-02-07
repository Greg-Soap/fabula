import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'novels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('title').notNullable()
      table.string('slug').notNullable().unique().index()
      table.text('short_description').nullable()
      table.text('long_description').nullable()
      table.json('cover_image').nullable()
      table.decimal('rating', 3, 2).nullable()
      table.text('personal_review').nullable()
      table.text('external_link').nullable()
      table.integer('number_of_chapters').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
