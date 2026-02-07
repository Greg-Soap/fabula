import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

import type { DateTime } from 'luxon'
import type Session from '#models/session'
import type User from '#models/user'

type ExtractModelType<T> = Omit<
  {
    [K in keyof T as T[K] extends Function ? never : K]: T[K] extends {
      compute: () => infer R
    }
      ? R extends DateTime
        ? string
        : R
      : T[K] extends DateTime | null
        ? string
        : T[K] extends BelongsTo<infer U>
          ? ExtractModelType<InstanceType<U>>
          : T[K] extends HasOne<infer U>
            ? ExtractModelType<InstanceType<U>>
            : T[K] extends HasMany<infer U>
              ? ExtractModelType<InstanceType<U>>[]
              : T[K] extends ManyToMany<infer U>
                ? ExtractModelType<InstanceType<U>>[]
                : T[K]
  },
  | '$trx'
  | '$attributes'
  | '$preloaded'
  | '$relations'
  | '$dirty'
  | '$original'
  | '$extras'
  | '$columns'
  | '$sideloaded'
  | '$primaryKeyValue'
  | '$isPersisted'
  | '$isNew'
  | '$isLocal'
  | '$isDirty'
  | '$isDeleted'
  | '$options'
>

export type RawSession = ExtractModelType<Session>
export type RawUser = ExtractModelType<User>
