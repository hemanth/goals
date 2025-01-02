'use client'

import { createClient } from '@supabase/supabase-js'
import { Goal } from '@/types/goals'

export const getSupabaseClient = () => {
  const url = localStorage.getItem('supabase_url')
  const key = localStorage.getItem('supabase_key')
  
  return url && key ? createClient(url, key) : null
}

export const supabaseStorage = {
  isConfigured: () => {
    return !!getSupabaseClient()
  },

  getGoals: async (): Promise<Goal[]> => {
    const supabase = getSupabaseClient()
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching goals:', error)
      return []
    }
    
    return data || []
  },

  saveGoal: async (goal: Goal): Promise<boolean> => {
    const supabase = getSupabaseClient()
    if (!supabase) return false
    
    const { error } = await supabase
      .from('goals')
      .upsert(goal)
    
    if (error) {
      console.error('Error saving goal:', error)
      return false
    }
    
    return true
  },

  deleteGoal: async (id: string): Promise<boolean> => {
    const supabase = getSupabaseClient()
    if (!supabase) return false
    
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting goal:', error)
      return false
    }
    
    return true
  }
}

