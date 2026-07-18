import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-6 text-center">
        Welcome back
      </h2>
      <LoginForm />
      <p className="mt-6 text-sm text-center text-[--text-body]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-orange-600 font-medium hover:text-orange-700 dark:text-orange-400 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  )
}
