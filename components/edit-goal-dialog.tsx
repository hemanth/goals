'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, Goal } from '@/types/goals'

type EditGoalDialogProps = {
  goal: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (goal: Goal) => void
}

export function EditGoalDialog({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) {
  const [title, setTitle] = useState(goal.title)
  const [description, setDescription] = useState(goal.description)
  const [category, setCategory] = useState(goal.category)

  useEffect(() => {
    setTitle(goal.title)
    setDescription(goal.description)
    setCategory(goal.category)
  }, [goal])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      ...goal,
      title,
      description,
      category,
      updatedAt: new Date().toISOString()
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-white">Edit Goal</DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-white/70">
            Make changes to your goal here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className="text-foreground dark:text-white">Goal Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your goal"
              className="dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-category" className="text-foreground dark:text-white">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="edit-category" className="dark:text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="dark:text-white">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="text-foreground dark:text-white">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about your goal"
              className="dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}