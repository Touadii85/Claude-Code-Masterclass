// page de prévisualisation pour les nouveaux composants UI

import SkeletonCard from "@/components/SkeletonCard"
import LoginForm from "@/components/LoginForm"
import SignupForm from "@/components/SignupForm"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* les formulaires embarquent les composants Input, PasswordInput et Button */}
      <h3 className="mt-10">Login form</h3>
      <LoginForm />

      <h3 className="mt-10">Signup form</h3>
      <SignupForm />
    </div>
  )
}
