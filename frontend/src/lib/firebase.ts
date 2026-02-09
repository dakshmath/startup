import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBs1pkZ1xXdYct7BNkwoZCIHb_hAo4o0Wk",
  authDomain: "startup-c2bf4.firebaseapp.com",
  projectId: "startup-c2bf4",
  storageBucket: "startup-c2bf4.appspot.com",
  messagingSenderId: "448293587509",
  appId: "1:448293587509:web:8ce1c6470c6f09b45abf7c",
  measurementId: "G-9FWBJNEFFC"
}

// Initialize Firebase
let app: any
let auth: any
let googleProvider: any
let storage: any

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()

  googleProvider.addScope('email')
  googleProvider.addScope('profile')

  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export { auth, googleProvider, storage }

export const firebaseAuth = {
  signInWithGoogle: async () => {
    if (!auth) throw new Error('Firebase auth not initialized')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google')
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with email')
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized')
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up with email')
    }
  },

  signOut: async () => {
    if (!auth) throw new Error('Firebase auth not initialized')
    try {
      await signOut(auth)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    }
  },

  getCurrentUser: () => {
    return auth?.currentUser || null
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    if (!auth) {
      callback(null)
      return () => {}
    }
    return auth.onAuthStateChanged(callback)
  }
}