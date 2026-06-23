import * as React from 'react'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
}

export function DialogTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className="text-lg font-semibold leading-none tracking-tight">{children}</h2>
}

export function DialogDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className="text-sm text-muted-foreground">{children}</p>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-2 mt-4">{children}</div>
}

export function DialogTrigger({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>
}