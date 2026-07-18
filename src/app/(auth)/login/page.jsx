import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
        Welcome back
      </h2>
      <LoginForm />
      <p className="mt-6 text-sm text-center text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary-600 font-medium hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </div>
  )
}
