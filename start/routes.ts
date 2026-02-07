/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from './kernel.js'
import { throttle } from './limiter.js'

const AuthController = () => import('#controllers/auth_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const SeriesController = () => import('#controllers/series_controller')
const NovelsController = () => import('#controllers/novels_controller')

router.on('/').renderInertia('home')
router.on('/home').renderInertia('home')

// Guest routes
router
  .group(() => {
    router.on('/login').renderInertia('login')
  })
  .use(middleware.guest())

// Public catalog
router.get('/series', [SeriesController, 'index'])
router.get('/series/:slug', [SeriesController, 'show'])
router.get('/novels', [NovelsController, 'index'])
router.get('/novels/:slug', [NovelsController, 'show'])

// Authenticated routes
router
  .group(() => {
    router.get('/logout', [AuthController, 'logout'])
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard.index')

    router
      .get('/dashboard/series', [SeriesController, 'dashboardIndex'])
      .as('dashboard.series.index')
    router
      .get('/dashboard/series/create', [SeriesController, 'create'])
      .as('dashboard.series.create')
    router.post('/dashboard/series', [SeriesController, 'store']).as('dashboard.series.store')
    router
      .post('/dashboard/series/fetch-info', [SeriesController, 'fetchInfo'])
      .as('dashboard.series.fetchInfo')
    router.get('/dashboard/series/:id/edit', [SeriesController, 'edit']).as('dashboard.series.edit')
    router.put('/dashboard/series/:id', [SeriesController, 'update']).as('dashboard.series.update')
    router
      .delete('/dashboard/series/:id', [SeriesController, 'destroy'])
      .as('dashboard.series.destroy')

    router
      .get('/dashboard/novels', [NovelsController, 'dashboardIndex'])
      .as('dashboard.novels.index')
    router
      .get('/dashboard/novels/create', [NovelsController, 'create'])
      .as('dashboard.novels.create')
    router.post('/dashboard/novels', [NovelsController, 'store']).as('dashboard.novels.store')
    router
      .post('/dashboard/novels/fetch-info', [NovelsController, 'fetchInfo'])
      .as('dashboard.novels.fetchInfo')
    router.get('/dashboard/novels/:id/edit', [NovelsController, 'edit']).as('dashboard.novels.edit')
    router.put('/dashboard/novels/:id', [NovelsController, 'update']).as('dashboard.novels.update')
    router
      .delete('/dashboard/novels/:id', [NovelsController, 'destroy'])
      .as('dashboard.novels.destroy')
  })
  .use([middleware.auth()])

// Auth API
router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('api/v1/auth')
  .use(throttle)

router.get('/health', [HealthChecksController])

transmit.registerRoutes()
