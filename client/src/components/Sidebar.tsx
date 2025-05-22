import { useState } from "react";
import { FileText, Link, Link2, PanelRightClose } from "lucide-react";
export function SideBar({
  setFilter,
  filter,
}: {
  setFilter: (x: any) => void;
  filter: string[];
}) {
  let [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`min-h-screen flex flex-col  w-[70px] border-r-[#8f8e8e91] border-r-[0.7px] pt-[10px] px-[5px] ${
          open && "w-[150px]"
        } overflow-hidden transition-all`}
      >
        <div>
          <button
            className={`w-full flex justify-center hover:bg-[#27272A]  rounded py-[10px] `}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? "close" : <PanelRightClose size={20} />}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center py-[25px]  gap-[8px]  ">
          <button
            className={`w-full  text-white flex flex-col gap-[5px]${
              !open && "justify-center"
            }   items-center cursor-pointer py-[16px] px-[5px]   rounded ${
              filter.includes("link") && "bg-amber-200"
            }`}
            onClick={() => {
              setFilter((prev: any) => {
                if (prev.includes("link")) {
                  return prev.filter((item: any) => item !== "link");
                }
                return [...prev, "link"];
              });
            }}
          >
            <Link />
            <span className="ml-[5px]">{open && "links"}</span>
          </button>
          <button
            className={`w-full  text-white flex flex-col gap-[5px]${
              !open && "justify-center"
            }   items-center cursor-pointer py-[16px] px-[5px]   rounded  ${
              filter.includes("document") && "bg-amber-200"
            } `}
            onClick={() => {
              setFilter((prev: any) => {
                if (prev.includes("document")) {
                  return prev.filter((item: any) => item !== "document");
                }
                return [...prev, "document"];
              });
            }}
          >
            <FileText />
            <span className="ml-[5px]">{open && "documents"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
