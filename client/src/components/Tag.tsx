export function Tag({
  category,
  setCategory,
  name,
}: {
  category: string;
  setCategory: (x: string) => void;
  name: string;
}) {
  return (
    <button
      className={`${
        category === name ? "text-black bg-white" : "bg-black text-white"
      } px-[5px]  w-[100px] text-center border-gray-300 border-2 rounded-md`}
      onClick={() => {
        if (category === name) {
          setCategory("");
        } else {
          setCategory(name);
        }
      }}
      key={name}
    >
      {name}
    </button>
  );
}
