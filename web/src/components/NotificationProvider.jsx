import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([])

  const notify = useCallback((type, text, timeout = 4500) => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setMessages((prev) => [...prev, { id, type, text }])

    if (timeout > 0) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((message) => message.id !== id))
      }, timeout)
    }
  }, [])

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  const value = useMemo(() => ({ messages, notify, clear }), [messages, notify, clear])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used inside NotificationProvider')
  return ctx
}

export function NotificationContainer() {
  const { messages } = useNotification()

  if (!messages.length) return null

  return (
    <div className="notification-global-container">
      {messages.map((notice) => (
        <div key={notice.id} className={`notification-item ${notice.type}`}>
          {notice.text}
        </div>
      ))}
    </div>
  )
}
