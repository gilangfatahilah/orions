import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signOut } from "@/auth"

interface DialogSignOut {
  isOpen: boolean,
  onClose: () => void,
}

export function DialogSignOut({isOpen, onClose}: Readonly<DialogSignOut>) {

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you want to sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will redirect you to the sign in page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={async () => {
            await signOut()
            onClose();
          }}>
            <AlertDialogAction>
              <button type="submit">Continue</button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
