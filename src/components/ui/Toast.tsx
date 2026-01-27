import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToast } from '../../hooks/useToast';

export function ToastContainer() {
    const { toasts, hideToast } = useToast()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map((toast: { id: string; message: string; variant: 'success' | 'error' | 'warning' | 'info' }) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    variant={toast.variant}
                    onClose={() => hideToast(toast.id)}
                />
            ))}
        </div>
    )
}

interface ToastProps {
    id: string
    message: string
    variant: 'success' | 'error' | 'warning' | 'info'
    onClose: () => void
}

function Toast({ message, variant, onClose }: ToastProps) {
    const variantStyles = {
        success: 'bg-success text-success-foreground border-success',
        error: 'bg-destructive text-destructive-foreground border-destructive',
        warning: 'bg-warning text-warning-foreground border-warning',
        info: 'bg-accent text-accent-foreground border-accent',
    }

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    }

    const Icon = icons[variant]

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg
        animate-in slide-in-from-right duration-300
        ${variantStyles[variant]}
      `}
            role="alert"
        >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
