import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const { GET, POST, PATCH, DELETE } = toNextJsHandler(auth)

export { GET, POST, PATCH, DELETE }
