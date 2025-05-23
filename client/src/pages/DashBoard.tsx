import { useEffect, useState } from "react";
import { Add } from "../components/Add.tsx";
import { toast } from "sonner";
import { LinkCard } from "../components/LinkCard.tsx";
import { More } from "../components/More.tsx";
import { Edit } from "../components/Edit.tsx";
import { SideBar } from "../components/Sidebar.tsx";
import { Share } from "../components/Share.tsx";
import { DocCard } from "../components/DocCard.tsx";
import { useNavigate } from "react-router-dom";

export interface LinkStructure {
  description: string;
  link: string;
  tags: string[];
  title: string;
  _id: string;
  userID: { userName: string; _id: string };
  category: string;
}

export function Links() {
  let [isaddOpen, setAddOpen] = useState<boolean>(false);
  let [isEditOpen, setEditOpen] = useState<boolean>(false);
  let [linkData, setLinkData] = useState<any>({});
  let [filter, setFilter] = useState<string[]>([]);
  let [isMoreOpen, setMoreOpen] = useState(false);
  let [links, setLinks] = useState<LinkStructure[] | [""]>([]);
  let [loading, setLoading] = useState<boolean>(true);
  let [refresh, setRefresh] = useState<number>(1);
  let [shareOpen, setShareOpen] = useState<boolean>(false);
  let [tags, setTags] = useState<string[]>([]);
  let navigate = useNavigate();
  useEffect(() => {
    // console.log("filter is changed :", filter);
  }, [filter]);
  useEffect(() => {
    if (isEditOpen === true || isMoreOpen === true || isaddOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen, isMoreOpen, isaddOpen]);

  async function fetchLinks() {
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}show`, {
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      let response: { success: boolean; links: LinkStructure[] } =
        await data.json();

      if (response.success === true) {
        // console.log("response links", response.links);
        let allTags = response.links.flatMap((ele) => ele.tags);
        // console.log(allTags, "all tags");
        if (filter.length === 0) {
          setLinks(response.links);
        } else {
          let finalLinks = response.links.filter((linkItem: LinkStructure) => {
            return filter.includes(linkItem.category);
          });

          setLinks(finalLinks);
        }
      } else {
        throw new Error();
      }

      // console.log("links", response.links);
      setLoading(false);
    } catch (error) {
      toast.error("error while fetching links");
      setLoading(false);
    }
  }
  async function logOut() {
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}logout`, {
        method: "POST",
        credentials: "include",
      });
      let response = await data.json();
      if (response.success == true) {
        toast.success("log out successful");
        navigate("/signin");
      }
    } catch (error) {
      toast.error("error while logging out");
    }
  }
  useEffect(() => {
    fetchLinks();
  }, [refresh, filter]);
  function onSuccess() {
    setRefresh((prev) => prev + 1);
  }
  function handleAddClick(open: boolean) {
    setAddOpen(open);
  }
  function handleEdit(editData: any, open: boolean) {
    setLinkData(editData);
    setEditOpen(open);
  }
  function handleMore(moreData: any) {
    setLinkData(moreData);
    setMoreOpen(true);
  }

  return (
    <>
      <div className="relative max-w-screen min-h-screen  text-white bg-[#0f0f0f]    ">
        {loading ? (
          "loading..."
        ) : (
          <>
            <div className="flex">
              <SideBar setFilter={setFilter} filter={filter}></SideBar>
              <div className="flex-1 flex flex-col">
                <div className="w-full flex justify-between items-center p-[10px] lg:px-[30px]">
                  <div className=" flex justify-center font-medium ">
                    DASH BOARD
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setShareOpen(true);
                      }}
                      className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter font-medium"
                    >
                      share
                    </button>
                    <button
                      onClick={() => {
                        handleAddClick(true);
                      }}
                      className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter font-medium"
                    >
                      Add item
                    </button>
                    <button
                      onClick={() => {
                        logOut();
                      }}
                      className="border-gray-400 border p-[5px] bg-white rounded text-black font-inter font-medium"
                    >
                      logout
                    </button>
                  </div>
                </div>

                {links.length === 0 ? (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <div>there are no contents</div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 ">
                    <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3  gap-[10px]  p-[20px]   ">
                      {links.map((linkItem: any) => {
                        if (linkItem.category === "document") {
                          return (
                            <DocCard
                              category={linkItem.category}
                              description={linkItem.description}
                              title={linkItem.title}
                              tags={linkItem.tags}
                              name={linkItem.userId.userName}
                              key={linkItem._id}
                              linkId={linkItem._id}
                              setMoreOpen={handleMore}
                              setEditOpen={handleEdit}
                              onsuccess={onSuccess}
                            />
                          );
                        }
                        return (
                          <LinkCard
                            link={linkItem.link}
                            category={linkItem.category}
                            description={linkItem.description}
                            title={linkItem.title}
                            tags={linkItem.tags}
                            name={linkItem.userId.userName}
                            key={linkItem._id}
                            linkId={linkItem._id}
                            setMoreOpen={handleMore}
                            setEditOpen={handleEdit}
                            onsuccess={onSuccess}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isaddOpen && <Add open={setAddOpen} onSuccess={onSuccess} />}

        {isMoreOpen && (
          <More
            open={setMoreOpen}
            link={linkData.link}
            description={linkData.description}
            tag={linkData.tag}
            title={linkData.title}
            linkId={linkData.id}
            userName={linkData.userName}
            image={linkData.image}
            category={linkData.category}
          />
        )}
        {isEditOpen && (
          <Edit
            intialLink={linkData.link}
            intialDescription={linkData.description}
            intialCategory={linkData.category}
            intialTags={linkData.tags}
            intialTitle={linkData.title}
            onsuccess={onSuccess}
            open={setEditOpen}
            linkId={linkData.linkId}
          ></Edit>
        )}

        {shareOpen && <Share onClose={setShareOpen} />}
      </div>
    </>
  );
}
