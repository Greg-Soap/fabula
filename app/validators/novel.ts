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

export const createNovelValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(255),
    shortDescription: vine.string().trim().maxLength(500).optional(),
    longDescription: vine.string().trim().optional(),
    rating: optionalNumber(),
    personalReview: vine.string().trim().optional(),
    externalLink: vine.string().trim().optional(),
    numberOfChapters: optionalNumber(),
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
  }),
)
