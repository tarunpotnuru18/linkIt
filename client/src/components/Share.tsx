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

  useEffect(() => {
    if (isSharing) {
      handleShare();
    }
  }, [isSharing]);

  return (
    <>
      <div className="h-screen bg-black w-screen fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col bg-[#171717] border-[#262626] border-1 rounded-md p-[15px] px-[30px] min-w-[520px]">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-red-200 rounded-md text-black"
          />
          <div className="flex justify-between">
            {" "}
            <button onClick={() => handleClick(true)}>sharecopy</button>
            <button
              onClick={() => {
                handleClick(false);
                setUrl("");
              }}
            >
              stopshare
            </button>
            <button onClick={() => onClose(false)}>close</button>
          </div>
        </div>
      </div>
    </>
  );
}

export function usefetch(options) {
  const [data, setData] = useState(null);
  useEffect(() => {
    console.log("usefetch,useeffect");
  }, [options]);
  return { data };
  
}

export function App() {
  const [url, seturl] = useState(null);
  const myoptions = { url };
  const { data } = usefetch({ url });
  console.log("app rendering");
  return (
    <>
      <div>app</div>
    </>
  );
}
