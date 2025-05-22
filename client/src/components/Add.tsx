import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Tag } from "./Tag";
import z from "zod";
import { Chip } from "./Chip";
export function Add({
  open,
  onSuccess,
}: {
  open: (x: boolean) => void;
  onSuccess: () => void;
}) {
  let [category, setCategory] = useState<string>("link");
  let [title, setTitle] = useState<string>("");
  let [link, setLink] = useState<string>("");
  let [description, setDescription] = useState<string>("");
  let [error, setError] = useState("");
  let [tags, setTags] = useState<string[]>([]);
  let [currentTag, setCurrentTag] = useState("");

  async function add() {
    if (
      category === "link" &&
      z.string().url().safeParse(link).success === false
    ) {
      setError("not a valid url");
      return;
    }
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}add`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          link,
          description,
          category,
          tags,
        }),
      });
      let response = await data.json();
      if (response.success) {
        toast.success("added successfully");
        onSuccess();
      }
    } catch (error) {
      toast.success("error occured while adding");
    } finally {
      open(false);
    }
  }

  return (
    <>
      <div className=" fixed bg-[#0f0f0f] inset-0 min-h-screen text-white flex  justify-center items-center overflow-y-scroll py-[5px]">
        <div className="flex flex-col bg-[#171717] border-[#262626] border-1 rounded-md p-[15px] px-[30px] w-[520px] ">
          <div className="flex justify-between">
            <span className="text-[15px] font-inter">New Link</span>
            <button
              onClick={() => {
                open(false);
              }}
              className="hover:rounded-full w-fit h-fit p-[2px] hover:bg-gray-400 hover:text-black"
            >
              <X size={15} />
            </button>
          </div>
          <div className="mt-[10px] gap-1 flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="enter title here"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
              className="w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] pl-[5px] bg-[#0f0f0f] "
            />
          </div>
          {category === "link" && (
            <div className="mt-[10px] gap-1 flex flex-col">
              <label htmlFor="link">link 🔗</label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => {
                  setLink(e.currentTarget.value);
                }}
                placeholder="enter link here"
                className="w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] pl-[5px] bg-[#0f0f0f] "
              />
              <div className="h-[20px] text-red-600">{error}</div>
            </div>
          )}
          <div className="mt-[10px] gap-1 flex flex-col">
            <label htmlFor="description">description</label>
            <textarea
              name=""
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
              placeholder="enter something about link"
              className="text-area w-full border border-gray-500 rounded-sm focus:outline-2 focus:outline-gray-400 py-[3px] pl-[5px] bg-[#0f0f0f] placeholder:bg-none min-h-[100px] max-h-[500px]"
            ></textarea>
          </div>
          <div className="mt-[10px] gap-1 flex justify-center ">
            {["link", "document"].map((name) => {
              return (
                <Tag
                  category={category}
                  setCategory={setCategory}
                  name={name}
                  key={name}
                />
              );
            })}
          </div>
          <div className="flex py-[10px] justify-center">
            <input
              type="text"
              onChange={(e) => {
                setCurrentTag(e.currentTarget.value);
              }}
              value={currentTag}
              className="border text-white"
            />
            <button
              onClick={() => {
                if (currentTag) {
                  setTags((prev) => {
                    return [...prev, currentTag];
                  });
                }
                setCurrentTag("");
              }}
              className="mx-[20px] border p-[5px] rounded cursor-pointer hover:bg-[#27272a]"
            >
              add Tag
            </button>
          </div>
          <div className="  flex flex-wrap gap-[10px] my-[10px]">
            {tags.map((ele, index) => {
              return (
                <Chip
                  remove={(x) => {
                    setTags((prev) => {
                      return prev.filter((ele) => ele !== x);
                    });
                  }}
                  tag={ele}
                />
              );
            })}
          </div>

          <div className="flex justify-center w-full mt-[10px]">
            <button
              className="bg-black p-[5px] border-gray-300 border rounded-md"
              onClick={() => {
                add();
              }}
            >
              add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
