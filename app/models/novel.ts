import { column } from '@adonisjs/lucid/orm'
import { type Attachment, attachment } from '@jrmc/adonis-attachment'
import type { DateTime } from 'luxon'
import SuperBaseModel from './super_base.js'

export default class Novel extends SuperBaseModel {
  static tableName = 'novels'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare shortDescription: string | null

  @column()
  declare longDescription: string | null

  @attachment({ preComputeUrl: true, folder: 'novels' })
  declare coverImage: Attachment | null

  @column()
  declare rating: number | null

  @column()
  declare personalReview: string | null

  @column()
  declare externalLink: string | null

  @column()
  declare numberOfChapters: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
