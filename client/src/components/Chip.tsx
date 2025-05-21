export function Chip({
  remove,
  tag,
}: {
  remove: (x: string) => void;
  tag: string;
}) {
  return (
    <div className="flex gap-[8px] border rounded-md p-[5px] text-[10px]">
      <p>{tag}</p>

      <button
        onClick={() => remove(tag)}
        className="cursor-pointer hover:text-red-500"
      >
        X
      </button>
    </div>
  );
}
