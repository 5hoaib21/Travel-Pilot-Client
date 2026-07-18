import Link from 'next/link'
import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
        Create your account
      </h2>
      <SignUpForm />
      <p className="mt-6 text-sm text-center text-neutral-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
