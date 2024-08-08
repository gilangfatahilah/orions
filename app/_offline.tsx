
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

export default function Component() {

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Icons.wifiOff className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Oops, you&apos;re offline!</h1>
        <p className="mt-4 text-muted-foreground">
          It looks like you&apos;ve lost your internet connection. Please check your network settings and try again.
        </p>
        <div className="mt-6">
          <Button
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}