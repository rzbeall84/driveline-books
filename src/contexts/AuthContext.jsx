import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [currentBusiness, setCurrentBusiness] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          await loadUserBusinesses(session.user.id)
        } else {
          setBusinesses([])
          setCurrentBusiness(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserBusinesses = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('business_users')
        .select(`
          business_id,
          role,
          businesses (
            id,
            name,
            legal_name,
            industry,
            currency
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error

      const userBusinesses = data.map(item => ({
        ...item.businesses,
        role: item.role
      }))

      setBusinesses(userBusinesses)
      
      // Set first business as current if none selected
      if (userBusinesses.length > 0 && !currentBusiness) {
        setCurrentBusiness(userBusinesses[0])
      }
    } catch (error) {
      console.error('Error loading businesses:', error)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setBusinesses([])
      setCurrentBusiness(null)
    }
    return { error }
  }

  const switchBusiness = (business) => {
    setCurrentBusiness(business)
  }

  const value = {
    user,
    loading,
    businesses,
    currentBusiness,
    signIn,
    signUp,
    signOut,
    switchBusiness,
    loadUserBusinesses
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
