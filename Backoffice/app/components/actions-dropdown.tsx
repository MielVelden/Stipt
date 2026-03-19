import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { EllipsisVerticalIcon } from "lucide-react"
import { Link } from "react-router"
import { Button } from "./ui/button"

type actionDropdown = {
  label: string
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  linkTo?: string
}

export function ActionsDropdown({ actions }: { actions: actionDropdown[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 cursor-pointer text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <EllipsisVerticalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        {actions.map((action, index) => (
          <div key={`${action.label}-${index}`}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant={action.variant}
              asChild={!!action.linkTo}
            >
              {action.linkTo ? (
                <Link to={action.linkTo}>
                  {action.icon && <span className="ml-2">{action.icon}</span>}
                  {action.label}
                </Link>
              ) : (
                <>
                  {action.icon && <span className="ml-2">{action.icon}</span>}
                  {action.label}
                </>
              )}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
