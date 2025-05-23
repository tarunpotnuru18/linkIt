import { toast } from "sonner";
import { Trash2, Link } from "lucide-react";
import { useEffect, useState } from "react";
import linkImg from "../assets/link-gradii.png";

import { ChipCard } from "./ChipCard";
interface LinkCardProps {
  title: string;
  link: string;
  description: string;
  category: string;
  tags: string[];
  name?: string;
  linkId: string;
  shareMode?: boolean;
  setMoreOpen: (x: any, b: boolean) => void;
  setEditOpen: (x: any, b: boolean) => void;
  onsuccess: () => void;
}
export function LinkCard({
  title,
  link,
  description,
  tags,
  category,
  name,
  shareMode,
  linkId,
  setMoreOpen,
  setEditOpen,
  onsuccess,
}: LinkCardProps) {
  let [loading, setloading] = useState(true);
  let [newDescription, setNewDescription] = useState("");
  let [newTitle, setNewTitle] = useState("");
  let [newImage, setNewImage] = useState(linkImg);

  async function deleteLink(id: string) {
    console.log("i am executed", id);
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}delete/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      let response = await data.json();
      if (response.success) {
        onsuccess();
        toast.success("successfull");
      }
    } catch (error) {
      toast.error("error occured while deleting");
    }
  }

  async function linkPreview(url: string) {
    try {
      let data = await fetch(
        `${import.meta.env.VITE_API_URL}linkData?url=${link}`,
        {
          credentials: "include",
          headers: {
            "content-type": "application.json",
          },
        }
      );
      let response = await data.json();
      // console.log(response);
      title = response.title;
      setNewTitle(response.title);
      setNewImage(response.image);
    } catch (error) {
      toast.error("there is an error");
    }
  }

  useEffect(() => {
    linkPreview(link);
  }, []);
 
  // console.log(link,newImage)
  return (
    <>
      <div className=" border-[#3d444d] border-[2px] rounded-md px-[10px] py-[10px] gap-4 flex flex-col items-center justify-around overflow-hidden">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className=" md:w-1/3 w-full h-32 ">
            <img
              src={newImage ? newImage : linkImg}
              alt=""
              className="rounded-md w-full h-full object-contain "
            />
          </div>

          <div className="flex flex-col flex-1 md:w-2/3  ">
            <div className=" flex justify-between">
              <div className="line-clamp-1 text-wrap mr-[5px] text-lg font-bold ">
                {title}
              </div>

              {!shareMode && (
                <button
                  onClick={() => {
                    deleteLink(linkId);
                  }}
                  className=" text-white rounded-full p-[2px] hover:bg-white hover:text-black w-[20px] h-[20px] box-border "
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className=" text-gray-300 line-clamp-2">
              <p> {description}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-[8px]">
          {tags.map((ele, index) => {
            return <ChipCard tag={ele} key={index} />;
          })}
        </div>

        <div className="w-full flex gap-4  ">
          <button
            onClick={() => {
              setMoreOpen(
                {
                  link,
                  tags,
                  description,
                  title,
                  linkId,
                  category,
                userName:name,
                  image: newImage,
                },
                true
              );
            }}
            className="inline-block rounded bg-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-600 cursor-pointer"
          >
            More
          </button>
          {!shareMode && (
            <button
              onClick={() => {
                setEditOpen(
                  { link, tags, description, title, linkId, category },
                  true
                );
              }}
              className="inline-block rounded bg-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-600 cursor-pointer"
            >
              Edit
            </button>
          )}

          <a
            href={link}
            target="_blank"
            className="inline-block rounded bg-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-600 cursor-pointer"
          >
            Visit Link
          </a>
        </div>
      </div>
    </>
  );
}

{
  /* 
  
  <button
            onClick={() => {
              deleteLink(linkId);
            }}
            className=" text-white"
          >
            <Trash2 />
          </button>
  
 j

<button
onClick={() => {
  setEditOpen({ link, tag, description, title, linkId }, true);
}}
>
Edit
</button> */
}
