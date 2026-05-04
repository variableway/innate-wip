import { Metadata } from "next"
import { CheatsheetsPageClient } from "@/components/cheatsheets/cheatsheets-page-client"
import {
  getAllCheatsheets,
  getUniqueCategories,
  getCheatsheetCount,
} from "@/lib/cheatsheets/data"

export const metadata: Metadata = {
  title: "Cheatsheets | Innate",
  description: "Quick reference guides for developer tools and frameworks.",
}

export default async function CheatsheetsPage() {
  const cheatsheets = await getAllCheatsheets()
  const categories = await getUniqueCategories()
  const total = await getCheatsheetCount()

  return (
    <CheatsheetsPageClient
      cheatsheets={cheatsheets}
      categories={categories}
      total={total}
    />
  )
}
