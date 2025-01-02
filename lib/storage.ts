import { Goal } from '@/types/goals'

const STORAGE_KEY = 'ny2025_goals'

export const storage = {
  getGoals: (): Goal[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveGoals: (goals: Goal[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  },

  addGoal: (goal: Goal): void => {
    const goals = storage.getGoals()
    storage.saveGoals([...goals, goal])
  },

  updateGoal: (updatedGoal: Goal): void => {
    const goals = storage.getGoals()
    const updated = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    )
    storage.saveGoals(updated)
  },

  deleteGoal: (id: string): void => {
    const goals = storage.getGoals()
    storage.saveGoals(goals.filter(goal => goal.id !== id))
  }
}

