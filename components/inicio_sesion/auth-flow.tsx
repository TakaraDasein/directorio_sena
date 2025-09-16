"use client"

import { useState } from "react"
import { LoginRegister } from "./login-register"
import { ProfileSetup, type ProfileData } from "./profile-setup"
import { AdminPanel } from "./admin-panel"
import { ProfileView } from "./profile-view"

type FlowStep = "login" | "setup" | "admin" | "view"

interface UserData {
  name: string
  email: string
}

const AuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("login")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  const handleLoginSuccess = (user: UserData) => {
    setUserData(user)
    setCurrentStep("setup")
  }

  const handleProfileSetup = (profile: ProfileData) => {
    setProfileData(profile)
    setCurrentStep("admin")
  }

  const handleViewProfile = () => {
    setCurrentStep("view")
  }

  const handleBackToAdmin = () => {
    setCurrentStep("admin")
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "login":
        return <LoginRegister onSuccess={handleLoginSuccess} />
        
      case "setup":
        if (!userData) return null
        return (
          <ProfileSetup 
            userData={userData} 
            onComplete={handleProfileSetup} 
          />
        )
        
      case "admin":
        if (!userData || !profileData) return null
        return (
          <AdminPanel 
            userData={userData} 
            profileData={profileData}
            onViewProfile={handleViewProfile}
          />
        )
        
      case "view":
        if (!userData || !profileData) return null
        return (
          <ProfileView 
            userData={userData} 
            profileData={profileData}
            onBack={handleBackToAdmin}
          />
        )
        
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  )
}

export { AuthFlow }