interface LinkDescription {
  link?: string;
  description: string;
  title: string;
  linkId: string;
  userName: string;
  tag: string;
  image: string;
  category: string;
  open: (x: boolean) => void;
}
import docImg from "../assets/doc-gradii.png";
import linkImg from "../assets/link-gradii.png";

export function More({
  open,
  tag,
  linkId,

  link,
  title,
  description,
  userName,
  image,
  category,
}: LinkDescription) {
  console.log({
    open,
    tag,
    linkId,
    title,
    description,
    userName,
    image,
  });
  return (
    <>
      <div className="fixed inset-0 min-h-screen min-w-screen flex  justify-center gap-5 bg-black overflow-y-auto">
        <div className="w-full px-[10px] py-[25px]  lg:max-w-[720px] ">
          <div className="w-full flex justify-end">
            <button
              onClick={() => open(false)}
              className="border-gray-400 border w-[20px] h-[20px] p-[5px] box-content bg-white rounded-full text-black font-inter  "
            >
              X
            </button>
          </div>
          <div className="w-full h-[200px] ">
            <img src={image} alt="" className="object-contain w-full h-full" />
          </div>
          <div>{`added by ${userName}`}</div>
          <div className="font-medium text-white"> {title}</div>
          {category == "link" && (
            <div className="w-full">
              <span className="mr-[5px]">url:</span>
              <p>{link}</p>
            </div>
          )}
          <div className="w-full">{description}</div>
        </div>
      </div>
    </>
  );
}
