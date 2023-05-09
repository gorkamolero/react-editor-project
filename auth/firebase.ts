import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDBBu7ILCkyB0iQK_VGN76bG8zS2xzzBIo',
  authDomain: 'twitter-thread-builder.firebaseapp.com',
  projectId: 'twitter-thread-builder',
  storageBucket: 'twitter-thread-builder.appspot.com',
  messagingSenderId: '370408263573',
  appId: '1:370408263573:web:a201ae2b4b6d3f3147b09c'
}

const app = initializeApp(firebaseConfig)

export const authentication = getAuth(app)
