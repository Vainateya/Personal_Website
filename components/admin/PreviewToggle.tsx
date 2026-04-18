type PreviewToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function PreviewToggle({ enabled, onToggle }: PreviewToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 border border-border bg-ivory px-3 py-2 font-sans text-[10px] uppercase tracking-label text-warm-grey"
    >
      <span>Preview as visitor</span>
      <span
        className={`relative h-5 w-10 rounded-full border ${
          enabled ? "border-prussian bg-prussian" : "border-warm-grey bg-warm-grey"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-ivory ${
            enabled ? "right-0.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
