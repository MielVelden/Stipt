import { useMemo } from "react"
import { Cell, Pie, PieChart as RechartsPieChart, Tooltip } from "recharts"

export interface PieChartEntry {
  name: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartEntry[]
  size?: number
}

export function PieChart({ data, size = 160 }: PieChartProps) {
  const radius = Math.floor(size / 2) - 10
  const cx = Math.floor(size / 2) - 5
  const cy = Math.floor(size / 2) - 5

  const hasValues = data.some((d) => d.value > 0)

  const displayData = useMemo(
    () => (hasValues ? data : [{ name: "", value: 1, color: "#d1d5db" }]),
    [data, hasValues]
  )

  return (
    <div className="flex items-center gap-6">
      <RechartsPieChart width={size} height={size}>
        <Pie
          data={displayData}
          cx={cx}
          cy={cy}
          innerRadius={0}
          outerRadius={radius}
          dataKey="value"
          strokeWidth={2}
          animationBegin={0}
          animationDuration={500}
          animationEasing="ease-out"
        >
          {displayData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        {hasValues && (
          <Tooltip
            formatter={(value, name) => [`${value}`, name]}
            contentStyle={{ fontSize: "0.75rem" }}
          />
        )}
      </RechartsPieChart>
      <div className="space-y-2 text-sm">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
