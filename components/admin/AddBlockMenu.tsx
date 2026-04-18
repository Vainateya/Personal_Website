"use client";

import { useState } from "react";
import { blockTypes, type BlockType } from "@/types/blocks";

type AddBlockMenuProps = {
  onAdd: (type: BlockType) => void;
};

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="border-prussian bg-prussian px-4 py-2 font-sans text-[10px] uppercase tracking-label text-ivory"
      >
        Add block
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-10 mt-2 min-w-[180px] border border-border bg-ivory">
          {blockTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="block w-full border-b border-border px-4 py-3 text-left font-sans text-[11px] uppercase tracking-label text-warm-grey last:border-b-0 hover:bg-mist"
            >
              {type}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
