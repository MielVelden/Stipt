import { PieChart } from "~/components/ui/pie-chart"

interface AttendancePieChartProps {
  presentCount: number
  absentCount: number
  unknownCount: number
}

export function AttendancePieChart({ presentCount, absentCount, unknownCount }: AttendancePieChartProps) {
  return (
    <PieChart
      data={[
        { name: "Aanwezig", value: presentCount, color: "#22c55e" },
        { name: "Afwezig", value: absentCount, color: "#ef4444" },
        { name: "Niet geregistreerd", value: unknownCount, color: "#d1d5db" },
      ]}
    />
  )
}
