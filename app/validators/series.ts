import vine from '@vinejs/vine'

const optionalNumber = () =>
  vine
    .any()
    .optional()
    .transform((v) => {
      if (v === '' || v === undefined || v === null) return undefined
      const n = Number(v)
      return Number.isNaN(n) ? undefined : n
    })

const optionalCoverImageUrl = () =>
  vine
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))

const optionalTmdbId = () =>
  vine
    .any()
    .optional()
    .transform((v) => {
      if (v === '' || v === undefined || v === null) return undefined
      const n = Number(v)
      return Number.isInteger(n) ? n : undefined
    })

const optionalThemeUrl = () =>
  vine
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))

export const createSeriesValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    trailerUrl: vine.string().trim().optional(),
    numberOfSeasons: optionalNumber(),
    coverImageUrl: optionalCoverImageUrl(),
    tmdbId: optionalTmdbId(),
    backdropUrl: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    themeUrl: optionalThemeUrl(),
    genre: vine.string().trim().maxLength(100).optional(),
    releaseYear: vine
      .any()
      .optional()
      .transform((v) => {
        if (v === '' || v === undefined || v === null) return undefined
        const n = Number(v)
        return Number.isInteger(n) && n >= 1900 && n <= 2100 ? n : undefined
      }),
  }),
)

export const updateSeriesValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    trailerUrl: vine.string().trim().optional(),
    numberOfSeasons: optionalNumber(),
    coverImageUrl: optionalCoverImageUrl(),
    tmdbId: optionalTmdbId(),
    backdropUrl: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    themeUrl: optionalThemeUrl(),
    genre: vine.string().trim().maxLength(100).optional(),
    releaseYear: vine
      .any()
      .optional()
      .transform((v) => {
        if (v === '' || v === undefined || v === null) return undefined
        const n = Number(v)
        return Number.isInteger(n) && n >= 1900 && n <= 2100 ? n : undefined
      }),
  }),
)
