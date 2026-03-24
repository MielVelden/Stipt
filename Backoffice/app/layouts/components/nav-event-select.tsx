import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { ArrowRight, Plus } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router"
import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import { useAppContext } from "~/contexts/app-context"
import type { Event } from "~/types"

export function NavEventSelect({ events }: { events: Event[] }) {
  const { selectedEventId, setSelectedEventId } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const match = location.pathname.match(/\/app\/event\/([^/]+)/)
    if (match) {
      const idFromUrl = match[1]
      if (idFromUrl !== selectedEventId) {
        setSelectedEventId(idFromUrl)
      }
    }
  }, [location.pathname, selectedEventId, setSelectedEventId])

  const handleEventChange = (id: string) => {
    setSelectedEventId(id)

    if (location.pathname.includes("/app/event/")) {
      const newPath = location.pathname.replace(
        /\/app\/event\/[^/]+/,
        `/app/event/${id}`
      )
      navigate(newPath)
    } else {
      navigate(`/app/event/${id}/`)
    }
  }

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>
          <Link to="/app/evenementen">Event</Link>
        </SidebarGroupLabel>
        <SidebarGroupAction asChild>
          <Link to="/app/evenementen">
            <ArrowRight />
            <span className="sr-only">Alle events</span>
          </Link>
        </SidebarGroupAction>
      </div>

      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <div className="dark">
            <SidebarMenuItem
              key="selected-event"
              className="group-data-[collapsible=icon]:hidden"
            >
              <div className="flex items-center gap-1">
                <Select
                  value={selectedEventId ?? undefined}
                  onValueChange={handleEventChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecteer een evenement" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {!events?.length && (
                        <SelectItem value="null" disabled>
                          Geen event beschikbaar
                        </SelectItem>
                      )}
                      {events?.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                          {event.isArchived && " (Gearchiveerd)"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" asChild>
                  <Link to="/app/evenementen/nieuw" className="top-0!">
                    <Plus /> <span className="sr-only">Nieuw evenement</span>
                  </Link>
                </Button>
              </div>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
