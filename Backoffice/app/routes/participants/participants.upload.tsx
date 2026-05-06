import { useState } from "react"
import {
  isRouteErrorResponse,
  useRouteError,
  useParams,
  Link,
} from "react-router"
import * as xlsx from "xlsx"
import { Loader2, CheckCircle2, FileUpIcon } from "lucide-react"

import { PageHeader } from "~/layouts/components/page-header"
import { PageContainer } from "~/layouts/components/page-container"
import FetchError from "~/components/fetch-error"
import { useAppContext } from "~/contexts/app-context"
import apiClient from "~/lib/api-client"
import { getApiErrorDetail } from "~/lib/utils"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Field, FieldLabel } from "~/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import type { BulkCreateEventParticipantsRo } from "~/generated-types/bulk-create-event-participants-ro"
import { toast } from "sonner"

type UploadState =
  | "idle"
  | "reading"
  | "read"
  | "uploading"
  | "success"
  | "error"

export default function Page() {
  const { eventBaseUrl } = useAppContext()
  const { eventId } = useParams()

  const [file, setFile] = useState<File | null>(null)
  const [columnName, setColumnName] = useState("e-mailadres")

  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<BulkCreateEventParticipantsRo | null>(
    null
  )
  const [rowCount, setRowCount] = useState(0)

  async function handleUpload() {
    if (!file) return
    if (!eventId) {
      toast.error("Kan geen geselecteerd event vinden.")
      return
    }

    setUploadState("reading")
    setErrorMessage(null)
    setResult(null)

    try {
      const emails = await parseFile(file, columnName)
      setRowCount(emails.length)

      if (emails.length === 0) {
        throw new Error("Geen e-mailadressen gevonden in de opgegeven kolom.")
      }

      setUploadState("read")
      setUploadState("uploading")

      const response = await apiClient.post<BulkCreateEventParticipantsRo>(
        `/events/${eventId}/participants/bulk`,
        { emails }
      )

      setResult(response.data)
      setUploadState("success")
    } catch (error) {
      setUploadState("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : getApiErrorDetail(
              error,
              "Er is een fout opgetreden tijdens het verwerken."
            )
      )
    }
  }

  function parseFile(file: File, targetColumn: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = xlsx.read(data, { type: "array" })

          if (workbook.SheetNames.length === 0) {
            return reject(new Error("Het bestand bevat geen werkbladen."))
          }

          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const json =
            xlsx.utils.sheet_to_json<Record<string, unknown>>(worksheet)

          const normalizedTargetColumn = targetColumn.trim().toLowerCase()

          const emails = json
            .map((row) => {
              const matchingKey = Object.keys(row).find(
                (key) => key.trim().toLowerCase() === normalizedTargetColumn
              )

              if (matchingKey && typeof row[matchingKey] === "string") {
                return row[matchingKey]
              }
              return null
            })
            .filter((email): email is string => !!email)

          resolve(emails)
        } catch (err) {
          reject(
            new Error(
              "Kan het bestand niet verwerken. Controleer of het een geldig Excel of CSV bestand is."
            )
          )
        }
      }

      reader.onerror = () => reject(new Error("Kan het bestand niet lezen."))
      reader.readAsArrayBuffer(file)
    })
  }

  return (
    <>
      <PageHeader title="Upload deelnemers" />
      <PageContainer>
        <div className="max-w-2xl">
          <h2>Bulk import via Excel of CSV</h2>
          <p className="mb-4 text-muted-foreground">
            Upload een .xlsx, .xls of .csv bestand. Zorg ervoor dat de
            e-mailadressen in een kolom staan met een duidelijke kolomnaam.
          </p>

          <div className="space-y-6">
            {(uploadState === "idle" || uploadState === "error") && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="file">Bestand</FieldLabel>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="columnName">
                    Kolomnaam e-mailadressen
                  </FieldLabel>
                  <Input
                    id="columnName"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="Bijv. e-mailadres, email, e-mail"
                  />
                </Field>
              </div>
            )}

            {uploadState !== "idle" && uploadState !== "error" && (
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  {uploadState === "reading" ? (
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  ) : (
                    <CheckCircle2 className="size-5 text-green-500" />
                  )}
                  <span
                    className={
                      uploadState === "reading" ? "text-muted-foreground" : ""
                    }
                  >
                    Bestand uitlezen...
                  </span>
                </div>

                {(uploadState === "read" ||
                  uploadState === "uploading" ||
                  uploadState === "success" ||
                  rowCount > 0) && (
                  <div className="flex items-center gap-3">
                    {uploadState === "read" ||
                    uploadState === "uploading" ||
                    uploadState === "success" ? (
                      <CheckCircle2 className="size-5 text-green-500" />
                    ) : (
                      <CheckCircle2 className="size-5 text-muted-foreground" />
                    )}
                    <span>
                      Bestand uitgelezen: <strong>{rowCount}</strong> rijen met
                      e-mailadressen gevonden.
                    </span>
                  </div>
                )}

                {(uploadState === "uploading" || uploadState === "success") && (
                  <div className="flex items-center gap-3">
                    {uploadState === "uploading" ? (
                      <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="size-5 text-green-500" />
                    )}
                    <span
                      className={
                        uploadState === "uploading"
                          ? "text-muted-foreground"
                          : ""
                      }
                    >
                      Deelnemers verwerken in de database...
                    </span>
                  </div>
                )}

                {uploadState === "success" && result && (
                  <div className="mt-4 rounded-md bg-green-500/15 p-4 text-green-800 dark:text-green-300">
                    <p className="mb-2 font-semibold">Import voltooid!</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>
                        <strong>{result.successfullyAdded}</strong> nieuwe
                        deelnemers toegevoegd.
                      </li>
                      <li>
                        <strong>{result.duplicatesInFile}</strong> {result.duplicatesInFile === 1 ? "duplicaat" : "duplicaten"} in het bestand genegeerd.
                      </li>
                      <li>
                        <strong>{result.duplicatesInDatabase}</strong> {result.duplicatesInDatabase === 1 ? "duplicaat" : "duplicaten"}
                        {" "}stonden al in het systeem en zijn overgeslagen.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            {uploadState === "error" && errorMessage && (
              <div className="mt-4 rounded-md bg-destructive/15 p-4 text-destructive">
                <p className="font-semibold">Fout bij importeren</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              disabled={
                uploadState === "reading" || uploadState === "uploading"
              }
              asChild
            >
              <Link to={`${eventBaseUrl}/deelnemers`}>
                {uploadState === "success"
                  ? "Terug naar overzicht"
                  : "Annuleren"}
              </Link>
            </Button>

            {uploadState !== "success" && (
              <Button
                onClick={handleUpload}
                disabled={
                  !file ||
                  !columnName ||
                  uploadState === "reading" ||
                  uploadState === "uploading"
                }
              >
                {uploadState === "reading" || uploadState === "uploading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    <FileUpIcon />
                    Uploaden
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <FetchError isRouteError={isRouteErrorResponse(error)} />
}
