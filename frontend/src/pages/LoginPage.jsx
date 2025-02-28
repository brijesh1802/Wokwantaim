import { useState } from 'react'
import { User, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import LoginForm from '../components/LoginForm'
import SocialAuthButtons from '../components/SocialAuthButtons'
import BacktoHome from '../components/BacktoHome'

function LoginPage() {
  const [userType, setUserType] = useState('candidate')
  

  return (
    <div className="container max-w-md px-4 py-12 mx-auto">
      <h1 className="mb-8 text-2xl font-semibold text-center">Login to Your Account</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
  <motion.button
    onClick={() => setUserType('candidate')}
    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all duration-300 ${
      userType === 'candidate'
        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`p-2 rounded-full ${userType === 'candidate' ? 'bg-orange-100' : 'bg-gray-100'}`}>
      <User className="w-6 h-6" />
    </div>
    <span className="font-semibold text-lg">Candidate</span>
  </motion.button>
  <motion.button
    onClick={() => setUserType('employer')}
    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all duration-300 ${
      userType === 'employer'
        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`p-2 rounded-full ${userType === 'employer' ? 'bg-orange-100' : 'bg-gray-100'}`}>
      <Building2 className="w-6 h-6" />
    </div>
    <span className="font-semibold text-lg">Employer</span>
  </motion.button>
      </div>

      <LoginForm userType={userType} />
      
      {userType === 'candidate' && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white/80 backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          <SocialAuthButtons  />
        </div>
      )}

      <BacktoHome/>
    </div>
  )
}

export default LoginPage

