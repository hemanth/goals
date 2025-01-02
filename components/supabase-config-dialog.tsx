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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

export function SupabaseConfigDialog() {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedUrl = localStorage.getItem('supabase_url')
    const storedKey = localStorage.getItem('supabase_key')
    if (storedUrl) setUrl(storedUrl)
    if (storedKey) setKey(storedKey)
  }, [])

  const handleSave = () => {
    if (!url || !key) {
      toast({
        title: "Missing Credentials",
        description: "Please provide both URL and API key.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem('supabase_url', url)
    localStorage.setItem('supabase_key', key)

    toast({
      title: "Configuration Saved",
      description: "Your Supabase credentials have been saved.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem] dark:text-white" />
          <span className="sr-only">Supabase settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supabase Configuration</DialogTitle>
          <DialogDescription>
            Enter your Supabase project credentials to enable cloud sync.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Project URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="key">API Key</Label>
            <Input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="your-anon-key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

