import vine from '@vinejs/vine'

const email = vine.string().toLowerCase().trim().email()

export const loginValidator = vine.compile(
  vine.object({
    email,
    password: vine.string(),
    remember: vine.boolean().optional(),
    referrer: vine.string().optional(),
  }),
)
