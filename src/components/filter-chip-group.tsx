type FilterChipGroupProps = {
  legend: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  wide?: boolean;
};

export function FilterChipGroup({ legend, options, selected, onToggle, wide = false }: FilterChipGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-base font-medium leading-[19px]">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            aria-pressed={selected.includes(option)}
            onClick={() => onToggle(option)}
            className={`min-h-[38px] rounded-full border py-2 text-sm leading-[18px] transition-colors ${wide ? "px-5" : "px-4"} ${selected.includes(option) ? "border-brand bg-brand text-white shadow-sm" : "border-filter-border bg-white text-brand hover:bg-fuchsia-50"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
