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

export const createSeriesValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    trailerUrl: vine.string().trim().optional(),
    numberOfSeasons: optionalNumber(),
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
  }),
)
