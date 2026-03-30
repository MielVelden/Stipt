import * as z from "zod"
import type { CreateRoomDto } from "~/generated-types/create-room-dto"
import type { RoomRo } from "~/generated-types/room-ro"
import type { UpdateRoomDto } from "~/generated-types/update-room-dto"

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

export function mapRoomToEditFormValues(room: RoomRo): RoomEditFormValues {
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity.toString(),
  }
}

export function mapFormValuesToRoomPayload(
  values: RoomBaseFormValues
): CreateRoomDto | UpdateRoomDto {
  return {
    name: values.name,
    capacity: Number(values.capacity),
  }
}

export type RoomBaseFormValues = z.infer<typeof roomBaseObjectSchema>
export type RoomCreateFormValues = z.infer<typeof roomCreateSchema>
export type RoomEditFormValues = z.infer<typeof roomEditSchema>
export type RoomFormValues = RoomCreateFormValues | RoomEditFormValues
