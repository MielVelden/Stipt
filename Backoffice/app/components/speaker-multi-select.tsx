import { useState } from "react"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import type { SpeakerRo } from "~/generated-types/speaker-ro"

type Props = {
  speakers: SpeakerRo[]
  value: string[] | undefined
  onChange: (value: string[]) => void
}

export function SpeakerMultiSelect({ speakers, value = [], onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = speakers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id]
    onChange(next)
  }

  const selected = speakers.filter((s) => value.includes(s.id))

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full max-w-xs justify-between font-normal"
          >
            {value.length > 0 ? `${value.length} spreker(s) gekozen` : "Kies sprekers..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <Input
            placeholder="Zoek spreker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 h-8"
          />
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-2 text-center text-sm text-muted-foreground">
                Geen resultaten
              </p>
            ) : (
              filtered.map((speaker) => (
                <label
                  key={speaker.id}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent"
                >
                  <Checkbox
                    checked={value.includes(speaker.id)}
                    onCheckedChange={() => toggle(speaker.id)}
                  />
                  <span className="text-sm">
                    {speaker.name}
                    {speaker.title && (
                      <span className="ml-1 text-muted-foreground">
                        — {speaker.title}
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((speaker) => (
            <Badge key={speaker.id} variant="secondary" className="py-1 pr-1 pl-2">
              {speaker.name}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 cursor-pointer rounded-full"
                onClick={() => onChange(value.filter((v) => v !== speaker.id))}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
