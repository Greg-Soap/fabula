import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

const TABLE_ORDER = [
  'users',
  'auth_access_tokens',
  'remember_me_tokens',
  'sessions',
  'rate_limits',
  'series',
  'novels',
] as const

const TRUNCATE_ORDER = [...TABLE_ORDER].reverse()

/** Convert 32-char hex string to standard UUID format if needed */
function toUuid(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const hex = value.replace(/-/g, '')
  if (hex.length !== 32 || !/^[0-9a-fA-F]+$/.test(hex)) return value
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

export default class MigrateFromSqlite extends BaseCommand {
  static commandName = 'migrate:from_sqlite'
  static description =
    'Copy data from SQLite file into the current Postgres database (run after migration:run)'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({ description: 'Truncate target Postgres tables before copying' })
  declare truncate: boolean

  async run() {
    const sqlitePath = this.app.tmpPath('db.sqlite3')
    const { default: Database } = await import('better-sqlite3')

    this.logger.info(`Reading SQLite from ${sqlitePath}`)

    let sqlite: InstanceType<typeof Database>
    try {
      sqlite = new Database(sqlitePath, { readonly: true })
    } catch (_err) {
      this.logger.error(`Cannot open SQLite file at ${sqlitePath}. Ensure the file exists.`)
      process.exitCode = 1
      return
    }

    const db = await this.app.container.make('lucid.db')

    try {
      if (this.truncate) {
        this.logger.info('Truncating target tables...')
        const quoted = TRUNCATE_ORDER.map((t) => `"${t}"`).join(', ')
        await db.rawQuery(`TRUNCATE TABLE ${quoted} CASCADE`)
        this.logger.info('Truncate done.')
      }

      for (const tableName of TABLE_ORDER) {
        const tableExists = sqlite
          .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?")
          .get(tableName)
        if (!tableExists) {
          this.logger.info(`Skip ${tableName} (not in SQLite)`)
          continue
        }

        const rows = sqlite.prepare(`SELECT * FROM ${tableName}`).all() as Record<string, unknown>[]
        if (rows.length === 0) {
          this.logger.info(`${tableName}: 0 rows`)
          continue
        }

        // Normalize row values for Postgres (UUIDs, booleans)
        const normalized = rows.map((row) => {
          const out: Record<string, unknown> = {}
          for (const [key, value] of Object.entries(row)) {
            if (value === null || value === undefined) {
              out[key] = null
              continue
            }
            // UUID columns (id, user_id, tokenable_id)
            if (
              (key === 'id' ||
                key === 'user_id' ||
                key === 'tokenable_id' ||
                key.endsWith('_id')) &&
              typeof value === 'string'
            ) {
              out[key] = toUuid(value)
              continue
            }
            // Boolean (SQLite 0/1)
            if (key === 'is_current' && (value === 0 || value === 1)) {
              out[key] = value === 1
              continue
            }
            out[key] = value
          }
          return out
        })

        await db.table(tableName).insert(normalized)
        this.logger.info(`${tableName}: ${normalized.length} rows`)
      }

      this.logger.success('Migration from SQLite completed.')
    } finally {
      sqlite.close()
    }
  }
}
