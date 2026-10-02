"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { emptyListing, type ListingDraft, type ListingPhoto } from "@/lib/listing";
import { sampleBatch, type BatchListing } from "@/lib/batch-listing";

type ListingDraftContextValue = {
  draft: ListingDraft;
  setDraft: Dispatch<SetStateAction<ListingDraft>>;
  photos: ListingPhoto[];
  setPhotos: Dispatch<SetStateAction<ListingPhoto[]>>;
  batch: BatchListing[];
  setBatch: Dispatch<SetStateAction<BatchListing[]>>;
};
const ListingDraftContext = createContext<ListingDraftContextValue | null>(null);

export function ListingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ListingDraft>(emptyListing);
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [batch, setBatch] = useState<BatchListing[]>(sampleBatch);
  return <ListingDraftContext.Provider value={{ draft, setDraft, photos, setPhotos, batch, setBatch }}>{children}</ListingDraftContext.Provider>;
}

export function useListingDraft() {
  const value = useContext(ListingDraftContext);
  if (!value) throw new Error("useListingDraft must be used inside ListingDraftProvider");
  return value;
}
