import { X } from "lucide-react";
// import { Tag } from "../components/Tag";
import { Chip } from "./Chip";
interface editProps {
  intialLink: string;
  intialTitle: string;
  intialCategory: string;
  intialTags: string[];
  intialDescription: string;
  linkId: string;
  onsuccess: () => void;
  open: (x: boolean) => void;
}
import { useState } from "react";
import { toast } from "sonner";
export function Edit({
  intialLink,
  intialTitle,
  intialTags,
  intialDescription,
  onsuccess,
  linkId,
  open,
  intialCategory,
}: editProps) {
  console.log(
    "from edit",
    intialLink,
    intialTitle,
    intialTags,
    intialDescription,
    onsuccess,
    linkId,
    open,
    intialCategory
  );
  let [category, setCategory] = useState<string>(intialCategory);
  let [title, setTitle] = useState<string>(intialTitle);
  let [link, setLink] = useState<string>(intialLink);
  let [description, setDescription] = useState<string>(intialDescription);
  let [tags, setTags] = useState<string[]>(intialTags);
  let [currentTag, setCurrentTag] = useState("");

  async function edit() {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}update/${linkId}`,
        {
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            category,
            title,
            link,
            description,
            tags,
          }),
        }
      );
      console.log(response);
      let data = await response.json();

      if (data.success) {
        toast.success("edit successfuly");
        onsuccess();
      } else {
        throw new Error("error while updating ");
      }
    } catch (error) {
      console.log(error);
      toast.error("error while updating");
    } finally {
      open(false);
    }
  }

  return (
    <>
      <div className=" fixed bg-[#0f0f0f] inset-0 min-h-screen text-white flex  justify-center items-center">
        <div className="flex flex-col bg-[#171717] border-[#262626] border-1 rounded-md p-[15px] px-[30px] min-w-[520px]">
          <div className="flex justify-between">
            <span className="text-[15px] font-inter">Edit</span>
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
          {category==="link" && (
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
          {/* <div className="mt-[10px] gap-1 flex justify-center ">
            {["x", "youtube", "instagram"].map((name) => {
              return (
                <Tag
                  category={category}
                  setCategory={setCategory}
                  name={name}
                  key={name}
                />
              );
            })}
          </div> */}
          <div className="flex flex-col">
            <div className="flex py-[10px]">
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
            <div className="flex flex-wrap gap-[10px] my-[10px]">
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
          </div>
          <div className="flex justify-center w-full mt-[10px]">
            <button
              className="bg-black p-[5px] border-gray-300 border rounded-md"
              onClick={() => {
                console.log("edit");
                edit();
              }}
            >
              update
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
