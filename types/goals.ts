export type Goal = {
  id: string
  title: string
  description: string
  category: string
  progress: number
  createdAt: string
  updatedAt: string
  isCompleted: boolean
  completedAt?: string
}

export type GoalCategory = {
  value: string
  label: string
}

export const CATEGORIES: GoalCategory[] = [
  { value: 'health', label: 'Health & Fitness' },
  { value: 'career', label: 'Career & Work' },
  { value: 'personal', label: 'Personal Development' },
  { value: 'financial', label: 'Financial' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'other', label: 'Other' }
]