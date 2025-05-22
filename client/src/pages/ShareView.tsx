import { useEffect, useState } from "react";
import { Add } from "../components/Add.tsx";
import { toast } from "sonner";
import { LinkCard } from "../components/LinkCard.tsx";
import { More } from "../components/More.tsx";
import { Edit } from "../components/Edit.tsx";
import { SideBar } from "../components/Sidebar.tsx";
import { Share } from "../components/Share.tsx";
import { DocCard } from "../components/DocCard.tsx";
import { useParams } from "react-router-dom";
export interface LinkStructure {
  description: string;
  link: string;
  tags: string[];
  title: string;
  _id: string;

  category: string;
}

export function ShareView() {
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
  let { shareId } = useParams();
  console.log(shareId);
  let [userName, setUserName] = useState("");

  async function fetchLinks() {
    try {
      console.log("I AM CALLED");
      let data = await fetch(
        `${import.meta.env.VITE_API_URL}getShare/${shareId}`
      );

      let response: {
        success: boolean;
        links: LinkStructure[];
        userName?: string;
      } = await data.json();

      if (response.success === true) {
        console.log("response links", response.links);
        let allTags = response.links.flatMap((ele) => ele.tags);
        console.log(allTags, "all tags");
        if (response.userName) {
          setUserName(response.userName);
        }
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

      console.log("links", response.links);
      setLoading(false);
    } catch (error) {
      toast.error("error while fetching links");
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchLinks();
  }, [refresh, filter, shareId]);
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
                    SHARE DASH-BOARD
                  </div>
                </div>

                {links.length === 0 ? (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      {userName && (
                        <div>{`you are viewing link store of ${userName} `}</div>
                      )}
                      <div>there are no contents</div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 ">
                    {userName && (
                        <div>{`you are viewing link store of ${userName} `}</div>
                      )}
                    <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3  gap-[10px]  p-[20px]   ">
                      {links?.map((linkItem: any) => {
                        console.log(links);
                        if (linkItem.category === "document") {
                          return (
                            <DocCard
                              category={linkItem.category}
                              description={linkItem.description}
                              title={linkItem.title}
                              tags={linkItem.tags}
                           
                              key={linkItem._id}
                              linkId={linkItem._id}
                              setMoreOpen={handleMore}
                              setEditOpen={handleEdit}
                              onsuccess={onSuccess}
                              shareMode
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
                            key={linkItem._id}
                            linkId={linkItem._id}
                            setMoreOpen={handleMore}
                            setEditOpen={handleEdit}
                            onsuccess={onSuccess}
                            shareMode
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

        {isMoreOpen && (
          <More
            open={setMoreOpen}
            link={linkData.link}
            description={linkData.description}
            tag={linkData.tag}
            title={linkData.title}
            linkId={linkData.id}
          />
        )}
      </div>
    </>
  );
}
