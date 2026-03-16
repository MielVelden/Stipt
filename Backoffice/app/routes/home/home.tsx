import { Button } from "~/components/ui/button"
import { Link } from "react-router"

export default function Home() {
  return (
    <div className="p-12 text-center">
      <h1 className="font-medium">iO Event Connect!</h1>
      <Button className="mt-2" asChild>
        <Link to="/app">Naar de applicatie</Link>
      </Button>
    </div>
  )
}
