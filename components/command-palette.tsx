'use client'

import * as React from 'react'
import { Search, Filter } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { CATEGORIES, Goal } from '@/types/goals'

type CommandPaletteProps = {
  goals: Goal[]
  onSelectGoal: (goalId: string) => void
  onCategoryChange: (category: string) => void
}

export function CommandPalette({ goals, onSelectGoal, onCategoryChange }: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex items-center">
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline-flex">Search goals...</span>
          <span className="inline-flex sm:hidden">Search...</span>
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search goals or filter by category..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Goals">
            {goals.map((goal) => (
              <CommandItem
                key={goal.id}
                onSelect={() => {
                  onSelectGoal(goal.id)
                  setOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span>{goal.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Filter by Category">
            <CommandItem onSelect={() => {
              onCategoryChange('all')
              setOpen(false)
            }}>
              <Filter className="mr-2 h-4 w-4" />
              All Categories
            </CommandItem>
            {CATEGORIES.map((category) => (
              <CommandItem
                key={category.value}
                onSelect={() => {
                  onCategoryChange(category.value)
                  setOpen(false)
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

