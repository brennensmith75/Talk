import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AlertAuth() {
  console.log('AlertAuth')
  return (
    <Alert variant="destructive" className="self-center max-w-sm mt-5 ">
      <AlertTitle className="text-center text-red-400 ">Auth Error</AlertTitle>
      <AlertDescription className="text-red-400">
        Your session Invalid or expired session. Please log in again or, if you
        haven not done so yet, log in to continue.
      </AlertDescription>
    </Alert>
  )
}
