import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserTypeSelector from '../components/UserTypeSelector'
import SignupForm from '../components/SignupForm'
import SocialAuthButtons from '../components/SocialAuthButtons'

function SignupPage() {
  const [userType, setUserType] = useState('candidate')

  return (
    <div className="container max-w-2xl px-4 py-12 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold text-center">Create An Account</h1>
      
      <UserTypeSelector selectedType={userType} onSelect={setUserType} />
      <SignupForm userType={userType} />
      
      <div className="mt-6 text-sm text-center">
        Already registered?{" "}
        <Link to="/login" className="text-orange-500 hover:underline">
          Sign in here
        </Link>
      </div>

      {userType === "candidate" && (
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>       
          <SocialAuthButtons />
      </div>
      )}

    </div>
  )
}

export default SignupPage

