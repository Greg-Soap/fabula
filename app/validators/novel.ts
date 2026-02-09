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

export const createNovelValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    externalLink: vine.string().trim().optional(),
    numberOfChapters: optionalNumber(),
    coverImageUrl: optionalCoverImageUrl(),
    themeUrl: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
  }),
)

export const updateNovelValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    externalLink: vine.string().trim().optional(),
    numberOfChapters: optionalNumber(),
    coverImageUrl: optionalCoverImageUrl(),
    themeUrl: vine
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
  }),
)
