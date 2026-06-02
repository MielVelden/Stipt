import { useSearchParams } from "react-router"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"

export default function InviteRoute() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Ongeldige uitnodiging</CardTitle>
                        <CardDescription>
                            We konden geen uitnodigingscode vinden in de URL. Controleer de
                            link in je e-mail.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const appLink = `exp://192.168.2.36:8081/--/?token=${token}` // TODO: Replace with actual app link

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Je bent uitgenodigd voor een event!
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                        Klik op de knop hieronder om het evenement in de app te bekijken en
                        te accepteren.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button className="w-full py-6" asChild>
                        <a href={appLink}>Accepteren in de app</a>
                    </Button>

                    <div className="space-y-4 border-t pt-6">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Heb je de app nog niet geïnstalleerd?
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Download de Event Connect app en gebruik de onderstaande code om
                                je uitnodiging te accepteren.
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4">
                            <span className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Jouw uitnodigingscode
                            </span>
                            <span className="font-mono text-xl font-bold tracking-wider text-gray-800 select-all">
                                {token}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
