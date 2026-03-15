import { useState } from 'react'
import './App.css'
import SignupForm from './components/signupForm'
import BasicProfile from './components/BasicProfile'
import { NotificationProvider, NotificationContainer } from './components/NotificationProvider'

function App() {
  const [signupData, setSignupData] = useState(null)

  const handleSignupSuccess = (payload) => {
    setSignupData(payload)
  }

  const handleProfileComplete = () => {
    setSignupData(null)
  }

  return (
    <NotificationProvider>
      <NotificationContainer />
      {!signupData && <SignupForm onSignupSuccess={handleSignupSuccess} />}
      {signupData && <BasicProfile signupData={signupData} onCompleted={handleProfileComplete} />}
    </NotificationProvider>
  )
}

export default App
