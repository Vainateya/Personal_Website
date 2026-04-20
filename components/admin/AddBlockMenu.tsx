"use client";

import { useState } from "react";
import { blockTypes, type BlockType } from "@/types/blocks";

type AddBlockMenuProps = {
  sections: readonly { key: string; label: string }[];
  onAdd: (type: BlockType, section: string) => void;
};

export function AddBlockMenu({ sections, onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("");

  // Reset the chosen section every time the menu closes, so reopening starts fresh.
  function toggleOpen() {
    setOpen((current) => {
      const next = !current;
      if (!next) setSelectedSection("");
      return next;
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="border-prussian bg-prussian px-4 py-2 font-sans text-[10px] uppercase tracking-label text-ivory"
      >
        Add block
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-10 mt-2 min-w-[240px] border border-border bg-ivory">
          {!selectedSection ? (
            <>
              <p className="border-b border-border px-4 py-2 font-sans text-[10px] uppercase tracking-label text-stone">
                Section
              </p>
              {sections.length ? (
                sections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setSelectedSection(section.key)}
                    className="block w-full border-b border-border px-4 py-3 text-left font-sans text-[11px] uppercase tracking-label text-warm-grey last:border-b-0 hover:bg-mist"
                  >
                    {section.label}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 font-sans text-[11px] text-warm-grey">
                  No sections configured for this page.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
                <p className="font-sans text-[10px] uppercase tracking-label text-stone">
                  Type &mdash; {selectedSection}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSection("")}
                  className="font-sans text-[10px] uppercase tracking-label text-warm-grey hover:text-ink"
                >
                  Back
                </button>
              </div>
              {blockTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onAdd(type, selectedSection);
                    setSelectedSection("");
                    setOpen(false);
                  }}
                  className="block w-full border-b border-border px-4 py-3 text-left font-sans text-[11px] uppercase tracking-label text-warm-grey last:border-b-0 hover:bg-mist"
                >
                  {type}
                </button>
              ))}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
