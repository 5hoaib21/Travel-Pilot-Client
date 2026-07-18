import Link from 'next/link'
import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-[--text-heading] mb-6 text-center">
        Create your account
      </h2>
      <SignUpForm />
      <p className="mt-6 text-sm text-center text-[--text-body]">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-600 font-medium hover:text-orange-700 dark:text-orange-400 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
