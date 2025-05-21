export function ChipCard({ tag }: { tag: string }) {
  return (
    <div className="flex gap-[8px] border rounded-md p-[5px] text-[10px]">
      <p># {tag}</p>
    </div>
  );
}
