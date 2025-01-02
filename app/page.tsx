'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AddGoalDialog } from '../components/add-goal-dialog'
import { GoalCard } from '../components/goal-card'
import { CommandPalette } from '../components/command-palette'
import { Footer } from '../components/footer'
import { ThemeProvider } from '../components/theme-provider'
import { ThemeToggle } from '../components/theme-toggle'
import { SupabaseConfigDialog } from '../components/supabase-config-dialog'
import { Goal } from '../types/goals'
import { storage } from '../lib/storage'
import { supabaseStorage } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Download, Upload, FileDown } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

// Sample goals for a 37-year-old engineering manager in Bay Area
const sampleGoals: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Complete Executive Leadership Program",
    description: "Enroll and complete a leadership program to enhance management skills and strategic thinking for leading larger engineering teams.",
    category: "career",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Implement Quarterly Family Adventures",
    description: "Plan and execute one unique family adventure each quarter (e.g., camping in Yosemite, road trip to Oregon, Disneyland, skiing in Tahoe).",
    category: "relationships",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Achieve 15% Body Fat",
    description: "Focus on strength training 3x/week, maintain regular cardio, and follow a balanced nutrition plan while managing work stress.",
    category: "health",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Max Out 401(k) and Mega Backdoor Roth",
    description: "Optimize retirement savings by maximizing 401(k) contributions and utilizing mega backdoor Roth IRA conversion strategies.",
    category: "financial",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Learn System Design Patterns",
    description: "Study and implement modern distributed systems patterns to better architect solutions for scale.",
    category: "personal",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Establish College Savings Plans",
    description: "Set up and maintain 529 plans for all three kids with regular monthly contributions.",
    category: "financial",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Weekly Date Nights",
    description: "Schedule and maintain regular date nights with spouse to maintain strong relationship despite busy schedule.",
    category: "relationships",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Meditation and Mindfulness Practice",
    description: "Develop a consistent meditation practice (20 mins daily) to manage work stress and improve focus.",
    category: "health",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Build Engineering Team Documentation",
    description: "Create comprehensive documentation for team processes, architecture decisions, and onboarding procedures.",
    category: "career",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Read 12 Leadership Books",
    description: "Read one leadership or management book per month to continue growing as a leader.",
    category: "personal",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Optimize Stock Portfolio",
    description: "Review and rebalance investment portfolio quarterly, focusing on long-term growth and risk management.",
    category: "financial",
    progress: 0,
    isCompleted: false
  },
  {
    title: "Implement Team Mentorship Program",
    description: "Create and launch a structured mentorship program within the engineering organization.",
    category: "career",
    progress: 0,
    isCompleted: false
  }
]

export default function Page() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    // Load goals from localStorage on mount or initialize with sample goals
    const localGoals = storage.getGoals()
    if (localGoals.length === 0) {
      // Initialize with sample goals
      const initialGoals = sampleGoals.map(goal => ({
        ...goal,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      setGoals(initialGoals)
      storage.saveGoals(initialGoals)
    } else {
      setGoals(localGoals)
    }
    setIsLoading(false)
  }, [])

  const handleAddGoal = (newGoal: { title: string; description: string; category: string }) => {
    const goal: Goal = {
      id: uuidv4(),
      ...newGoal,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCompleted: false,
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    storage.saveGoals(updatedGoals)

    toast({
      title: "Goal Added",
      description: "Your new goal has been saved locally.",
    })
  }

  const handleUpdateGoal = (updatedGoal: Goal) => {
    const updated = goals.map(goal =>
      goal.id === updatedGoal.id
        ? { ...updatedGoal, updatedAt: new Date().toISOString() }
        : goal
    )
    setGoals(updated)
    storage.saveGoals(updated)
  }

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(goal => goal.id !== id)
    setGoals(updated)
    storage.saveGoals(updated)
    
    toast({
      title: "Goal Deleted",
      description: "The goal has been removed.",
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(goals, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `goals-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Goals Exported",
      description: "Your goals have been exported as JSON.",
    })
  }

  const handleSaveToSupabase = async () => {
    if (!supabaseStorage.isConfigured()) {
      toast({
        title: "Supabase Not Configured",
        description: "Please add your Supabase credentials to enable cloud storage.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    let success = true

    for (const goal of goals) {
      const saved = await supabaseStorage.saveGoal(goal)
      if (!saved) {
        success = false
        break
      }
    }

    setIsLoading(false)
    
    toast({
      title: success ? "Goals Saved to Cloud" : "Error Saving Goals",
      description: success 
        ? "Your goals have been successfully backed up to Supabase."
        : "There was an error saving your goals to the cloud.",
      variant: success ? "default" : "destructive",
    })
  }

  const handleLoadFromSupabase = async () => {
    if (!supabaseStorage.isConfigured()) {
      toast({
        title: "Supabase Not Configured",
        description: "Please add your Supabase credentials to enable cloud storage.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const cloudGoals = await supabaseStorage.getGoals()
    setIsLoading(false)

    if (cloudGoals.length > 0) {
      setGoals(cloudGoals)
      storage.saveGoals(cloudGoals)
      toast({
        title: "Goals Loaded from Cloud",
        description: "Your goals have been restored from Supabase.",
      })
    } else {
      toast({
        title: "No Goals Found",
        description: "No goals were found in your cloud storage.",
        variant: "destructive",
      })
    }
  }

  const handleScrollToGoal = (goalId: string) => {
    const element = document.getElementById(goalId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      element.classList.add('ring-2', 'ring-primary')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary')
      }, 2000)
    }
  }

  const filteredGoals = goals.filter(goal => {
    return categoryFilter === 'all' || goal.category === categoryFilter
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold text-lg sm:text-xl dark:text-white">
                  2025 Vision
                </span>
              </a>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <CommandPalette
                  goals={goals}
                  onSelectGoal={handleScrollToGoal}
                  onCategoryChange={setCategoryFilter}
                />
              </div>
              <div className="flex items-center gap-2">
                <SupabaseConfigDialog />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto py-6 sm:py-8 px-4">
            <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
              <div className="space-y-2 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter dark:text-white">
                  Shape Your Future
                </h1>
                <p className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl text-muted-foreground dark:text-white/80">
                  Transform your aspirations into achievements. Set, track, and conquer your 2025 goals.
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
                <AddGoalDialog onSave={handleAddGoal} />
                <Button 
                  variant="secondary" 
                  onClick={handleExport}
                  className="dark:bg-white dark:text-black dark:hover:bg-white/90 w-full sm:w-auto"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Goals
                </Button>
                {supabaseStorage.isConfigured() && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveToSupabase}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Save to Cloud
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleLoadFromSupabase}
                      className="w-full sm:w-auto"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Load from Cloud
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => (
                <div 
                  key={goal.id} 
                  id={goal.id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <GoalCard
                    goal={goal}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                  />
                </div>
              ))}
            </div>

            {filteredGoals.length === 0 && (
              <div className="text-center text-muted-foreground dark:text-white/80 mt-8">
                {goals.length === 0 
                  ? "No goals yet. Click \"Add New Goal\" to get started!"
                  : "No goals match your search criteria."}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
