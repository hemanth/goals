// import { Github, Twitter } from 'lucide-react'
// import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-center gap-4 py-6 sm:py-10 md:h-24 md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground dark:text-white/80">
          Built with ❤️ h3manth.com
        </p>
        {/* <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Twitter className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </footer>
  )
}