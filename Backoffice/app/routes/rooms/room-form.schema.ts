import * as z from "zod"
import type { CreateRoom, Room, UpdateRoom } from "~/types"

const roomBaseObjectSchema = z.object({
  name: z
    .string()
    .min(1, "Dit veld is verplicht")
    .max(120, "Maximaal 120 karakters"),
  capacity: z
    .string()
    .min(1, "Dit veld is verplicht")
    .refine((val) => Number(val) > 0, {
      message: "Capaciteit moet groter zijn dan 0",
    }),
})

export const roomCreateSchema = roomBaseObjectSchema

export const roomEditSchema = roomBaseObjectSchema.extend({
  id: z.string().min(1, "Deze ruimte kan niet worden gevonden"),
})

export const roomCreateDefaultValues: RoomCreateFormValues = {
  name: "",
  capacity: "",
}

export function mapRoomToEditFormValues(room: Room): RoomEditFormValues {
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity.toString(),
  }
}

export function mapFormValuesToRoomPayload(
  values: RoomBaseFormValues
): CreateRoom | UpdateRoom {
  return {
    name: values.name,
    capacity: Number(values.capacity),
  }
}

export type RoomBaseFormValues = z.infer<typeof roomBaseObjectSchema>
export type RoomCreateFormValues = z.infer<typeof roomCreateSchema>
export type RoomEditFormValues = z.infer<typeof roomEditSchema>
export type RoomFormValues = RoomCreateFormValues | RoomEditFormValues
