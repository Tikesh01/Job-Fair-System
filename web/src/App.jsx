import './App.css'
import { NotificationProvider } from './contexts/NotificationContext'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './components/Notification.css'

function App() {

  return (
    <NotificationProvider>
      <Navbar />
      <Signup />
      <Footer />
    </NotificationProvider>
  )
}

export default App
