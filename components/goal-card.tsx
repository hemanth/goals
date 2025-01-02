'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Goal, CATEGORIES } from '@/types/goals'
import { Trash2, Pencil, CheckCircle2, PartyPopper, Calendar } from 'lucide-react'
import { EditGoalDialog } from './edit-goal-dialog'
import { cn } from '@/lib/utils'

type GoalCardProps = {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (id: string) => void
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [progress, setProgress] = useState(goal.progress)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const category = CATEGORIES.find(c => c.value === goal.category)

  useEffect(() => {
    if (progress === 100 && !goal.isCompleted) {
      setShowCompletionMessage(true)
      const timer = setTimeout(() => {
        setShowCompletionMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [progress, goal.isCompleted])

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    if (newProgress === 100 && !goal.isCompleted) {
      onUpdate({ 
        ...goal, 
        progress: newProgress,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } else {
      onUpdate({ 
        ...goal, 
        progress: newProgress,
        isCompleted: false,
        completedAt: undefined,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden border-none bg-gradient-to-br from-card/50 to-card shadow-xl dark:shadow-primary/5",
        goal.isCompleted && "from-green-100/50 to-green-200/50 dark:from-green-900/20 dark:to-green-800/20"
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-transparent",
            goal.isCompleted 
              ? "to-green-500/5 dark:to-green-400/10"
              : "to-primary/5 dark:to-primary/10"
          )}
          style={{
            maskImage: 'radial-gradient(circle at top left, transparent 0%, black 100%)'
          }}
        />
        {showCompletionMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl flex items-center gap-2 animate-in zoom-in duration-300">
              <PartyPopper className="h-5 w-5 text-yellow-500" />
              <span className="text-base sm:text-lg font-medium">Goal Completed! 🎉</span>
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg sm:text-xl dark:text-white">{goal.title}</CardTitle>
                {goal.isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "bg-primary/10 text-primary hover:bg-primary/20",
                    goal.isCompleted && "bg-green-500/10 text-green-600 dark:text-green-400"
                  )}
                >
                  {category?.label || 'Other'}
                </Badge>
                {goal.completedAt && (
                  <Badge variant="outline" className="gap-1 text-green-600 dark:text-green-400">
                    <Calendar className="h-3 w-3" />
                    Completed {formatDate(goal.completedAt)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(goal.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-white/80 mb-4">{goal.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-white/80">Progress</span>
              <span className="text-sm font-medium text-muted-foreground dark:text-white/80">{progress}%</span>
            </div>
            <div className="relative">
              <div 
                className={cn(
                  "absolute inset-0 h-2 rounded-full",
                  goal.isCompleted 
                    ? "bg-green-500/20 dark:bg-green-400/20"
                    : "bg-primary/20"
                )}
                style={{ width: `${progress}%` }}
              />
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={5}
                className={cn(
                  "[&_[role=slider]]:shadow-lg",
                  goal.isCompleted && "[&_[role=slider]]:bg-green-500 dark:[&_[role=slider]]:bg-green-400"
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground dark:text-white/70">
          Last updated: {formatDate(goal.updatedAt)}
        </CardFooter>
      </Card>
      
      <EditGoalDialog
        goal={goal}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onUpdate}
      />
    </>
  )
}