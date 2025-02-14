import { useState } from "react";
import { Link } from "react-router-dom";
import UserTypeSelector from "../components/UserTypeSelector";
import SignupForm from "../components/SignupForm";
import SocialAuthButtons from "../components/SocialAuthButtons";

function SignupPage() {
  const [userType, setUserType] = useState("candidate");

  return (
    <div className="container max-w-2xl px-4 py-12 mx-auto relative">
      <h1 className="mb-8 text-3xl font-semibold text-center text-orange-600">
        Create An Account
      </h1>

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
              <span className="px-2 text-gray-500 bg-white">
                Or continue with
              </span>
            </div>
          </div>
          <SocialAuthButtons />
        </div>
      )}
      <div className="fixed bottom-6 right-6 p-4 bg-orange-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
        <Link to="/" className="flex items-center space-x-2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10l4 4m0 0l4-4m-4 4V3m7 7l4 4m0 0l4-4m-4 4V3"
          />

          <span>Go to Homepage</span>
        </Link>
      </div>

      {/* <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 bg-white shadow-lg border border-gray-300">
        <h2 className="text-lg font-semibold">Need Help?</h2>
        <p className="mt-2 text-sm text-gray-600">
          If you need any assistance, please contact our support team.
        </p>
      </div> */}
    </div>
  );
}

export default SignupPage;
