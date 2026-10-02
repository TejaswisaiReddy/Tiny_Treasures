import { conditionDescriptions, conditionTone } from "@/lib/listing-presentation";

export function ListingCondition({ condition }: { condition: string }) {
  return <span title={conditionDescriptions[condition]} className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${conditionTone(condition)}`}>{condition || "Choose condition"}</span>;
}
