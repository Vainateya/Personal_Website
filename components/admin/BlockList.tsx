"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult
} from "@hello-pangea/dnd";
import type { BlockRecord } from "@/types/blocks";
import { BlockItem } from "@/components/admin/BlockItem";

type BlockListProps = {
  blocks: BlockRecord[];
  onEdit: (block: BlockRecord) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (blocks: BlockRecord[]) => void;
};

export function BlockList({
  blocks,
  onEdit,
  onDelete,
  onToggleVisibility,
  onReorder
}: BlockListProps) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const updated = [...blocks];
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    onReorder(updated);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                  >
                    <BlockItem
                      block={block}
                      onEdit={() => onEdit(block)}
                      onDelete={() => onDelete(block.id)}
                      onToggleVisibility={() => onToggleVisibility(block.id)}
                      dragHandleProps={draggableProvided.dragHandleProps ?? undefined}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
