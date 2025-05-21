import { ReactNode, useEffect, useState, createContext } from "react";


interface prop {
  children: ReactNode;
}
interface IauthContext {
  isAuthenticated: boolean;
  userName: string;
  isSharing: boolean;
  setAuthenticated: (x: boolean) => void;
  setUserName: (x: string) => void;
  setSharing: (x: boolean) => void;
}
export const authContext = createContext<IauthContext>({
  isAuthenticated: false,
  userName: "",
  setAuthenticated: () => {},
  setUserName: () => {},
  isSharing: false,
  setSharing: () => {},
});

export function GlobalState({ children }: prop) {
  let [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  let [userName, setUserName] = useState<string>("");
  let [loading, setLoading] = useState(true);
  let [isSharing, setSharing] = useState(false);
  async function checkAuth() {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}authValid`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      let data: { success: boolean; userName: string; isSharing: boolean } =
        await response.json();
      console.log(data);
      if (data.success === false) {
        throw new Error("user is not authenticated");
      } else {
        setAuthenticated(true);
        setUserName(data.userName);
        setSharing(data.isSharing);
      }
    } catch (error: any) {
      console.log("error from checkauth", error.message);
    }
  }
  useEffect(() => {
    checkAuth().then(() => {
      setLoading(false);
    });
  }, []);

  return loading ? (
    <div className="w-screen h-screen bg-black"></div>
  ) : (
    <>
      <authContext.Provider
        value={{
          isAuthenticated,
          userName,
          setAuthenticated,
          setUserName,
          isSharing,
          setSharing,
        }}
      >
        {children}
      </authContext.Provider>
    </>
  );
}
