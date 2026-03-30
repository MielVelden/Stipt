import * as z from "zod"
import type { CreateRoomDto } from "~/generated-types/create-room-dto"
import type { RoomRo } from "~/generated-types/room-ro"
import type { UpdateRoomDto } from "~/generated-types/update-room-dto"
import { VALIDATION_MESSAGES } from "~/lib/validation-messages"

const roomBaseObjectSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .max(120, VALIDATION_MESSAGES.room.maxNameLength),
  capacity: z
    .string()
    .min(1, VALIDATION_MESSAGES.required)
    .refine((val) => Number(val) > 0, {
      message: VALIDATION_MESSAGES.room.capacityGreaterThanZero,
    }),
})

export const roomCreateSchema = roomBaseObjectSchema

export const roomEditSchema = roomBaseObjectSchema.extend({
  id: z.string().min(1, VALIDATION_MESSAGES.room.notFound),
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
