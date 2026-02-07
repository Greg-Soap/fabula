import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'
import env from '#start/env'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),
    r2: services.s3({
      credentials: {
        accessKeyId: env.get('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: env.get('R2_SECRET_ACCESS_KEY') ?? '',
      },
      region: 'auto',
      bucket: env.get('R2_BUCKET') ?? '',
      endpoint: env.get('R2_ENDPOINT') ?? '',
      visibility: 'private',
      /** R2 does not support object-level ACLs; use config visibility only */
      supportsACL: false,
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
