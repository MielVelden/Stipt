export const VALIDATION_MESSAGES = {
  required: "Dit veld is verplicht",
  event: {
    endDateAfterOrEqualStartDate: "Einddatum moet op of na startdatum zijn",
  },
  room: {
    maxNameLength: "Maximaal 120 karakters",
    capacityGreaterThanZero: "Capaciteit moet groter zijn dan 0",
    notFound: "Deze ruimte kan niet worden gevonden",
  },
  session: {
    selectType: "Selecteer een sessietype",
    selectRoom: "Selecteer een ruimte",
    capacityPositiveNumber: "Capaciteit moet een positief getal zijn",
    labelsUnique: "Labels moeten uniek zijn",
    endAfterStart: "De sessie moet eindigen na dat deze is begonnen",
    notFound: "Deze sessie kan niet worden gevonden",
  },
}
