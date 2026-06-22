import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { cn } from "~/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-6" />
        ),
        info: (
          <InfoIcon className="size-6" />
        ),
        warning: (
          <TriangleAlertIcon className="size-6" />
        ),
        error: (
          <OctagonXIcon className="size-6" />
        ),
        loading: (
          <Loader2Icon className="size-6 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "oklch(0.962 0.044 163.17)",
          "--success-border": "oklch(0.696 0.17 162.48)",
          "--success-text": "oklch(0.596 0.145 163.23)",
          "--info-bg": "oklch(0.955 0.028 242.75)",
          "--info-border": "oklch(0.623 0.188 259.81)",
          "--info-text": "oklch(0.546 0.215 262.88)",
          "--warning-bg": "oklch(0.972 0.048 95.92)",
          "--warning-border": "oklch(0.768 0.164 70.08)",
          "--warning-text": "oklch(0.666 0.179 58.32)",
          "--error-bg": "oklch(0.966 0.022 17.19)",
          "--error-border": "oklch(0.637 0.237 25.33)",
          "--error-text": "oklch(0.577 0.245 27.33)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: cn(
            "cn-toast !rounded-lg !border-l-4 !px-4 !py-3 !shadow-sm",
            "!items-center !gap-3"
          ),
          title: "!text-sm !font-bold !text-neutral-950",
          description: "!text-xs !text-neutral-500",
          content: "!gap-1",
          icon: "!my-auto !size-6",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
