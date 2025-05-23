import { useContext, useEffect, useState } from "react";
import { authContext } from "../store/context";
import { toast } from "sonner";
export function Share({ onClose }: { onClose: (x: boolean) => void }) {
  let { isSharing, setSharing } = useContext(authContext);

  let [url, setUrl] = useState("");

  async function handleClick(isSharing: boolean) {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}share`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          share: isSharing,
        }),
        method: "POST",
      });
      let data = await response.json();
      if (data.success) {
        setSharing(isSharing);
      } else {
        throw new Error("failed share operation");
      }
    } catch (error) {
      toast.error("error");
    }
  }
  async function handleShare() {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}share`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          share: true,
        }),
        method: "POST",
      });
      let data = await response.json();
      if (data.success) {
        setUrl("http://localhost:5173/share/" + data.shareId);
      } else {
        throw new Error("error while share");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  async function handleCopy() {

    if(isSharing){
      navigator.clipboard.writeText(url);
      toast.success("copied")
    }else{
      toast.message("start sharing to copy")
    }

  }

  useEffect(() => {
    if (isSharing) {
      handleShare();
    } else {
      setUrl("start sharing to get a url");
    }
  }, [isSharing]);

  return (
    <>
      <div className="h-screen bg-black w-screen fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col bg-[#171717] border-[#262626] border-1 rounded-md p-[15px] px-[30px] min-w-[520px]">
          <div className="my-[20px] flex justify-end">
            <button
              onClick={() => onClose(false)}
              className="border-gray-400 border w-[20px] h-[20px] p-[5px] box-content bg-white rounded-full text-black font-inter  "
            >
              X
            </button>
          </div>
          <div className="w-full flex gap-[20px]">
            {" "}
            <input
              type="text"
              readOnly
              value={url}
              className="bg-white rounded text-black px-[5px] py-[10px]  flex-1"
            />
            <button
              onClick={() => handleCopy()}
              className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter "
            >
              copy
            </button>
          </div>

          <div className="flex gap-[10px] my-[20px]">
            {" "}
            <button
              onClick={() => handleClick(true)}
              className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter "
            >
              share
            </button>
            <button
              onClick={() => {
                handleClick(false);
                setUrl("");
              }}
              className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter "
            >
              stop-share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
