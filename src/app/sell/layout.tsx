import { ListingDraftProvider } from "@/components/listing-draft-provider";

// This layout preserves the form while moving between /sell and its photo steps.
export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <ListingDraftProvider>{children}</ListingDraftProvider>;
}
