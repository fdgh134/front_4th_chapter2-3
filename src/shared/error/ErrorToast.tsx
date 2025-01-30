import { X } from "lucide-react";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "../ui";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose}: ErrorToastProps) => (
  <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md">
    <AlertTitle className="flex items-center justify-between">
      오류 발생
      <button onClick={onClose} className="text-sm">
        <X className="h-4 w-4" />
      </button>
    </AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);