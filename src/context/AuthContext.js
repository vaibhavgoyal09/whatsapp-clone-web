import React, { createContext, useContext, useEffect, useState } from 'react'
import auth from '../utils/FirebaseConfig'
import {
    signInWithPhoneNumber,
    onAuthStateChanged
} from 'firebase/auth'

const AuthContext = createContext({
  currentUser: null,
  signInWithPhoneNumber: () => Promise,
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user ? user : null)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    console.log('The user is', currentUser)
  }, [currentUser])

  function sendOTP(phoneNumber) {
      return signInWithPhoneNumber(auth, phoneNumber)
  }

  const value = {
    currentUser,
    sendOTP
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
