interface LinkDescription {
  link: string;
  description: string;
  title: string;
  linkId: string;
  
  tag: string;
  open: (x: boolean) => void;
}

export function More({ open,tag,linkId,title,description }: LinkDescription) {
  return (
    <>
      <div className="fixed inset-0 min-h-screen min-w-screen flex items-center justify-center gap-5 bg-black">
        i am more
        <button
          onClick={() => {
            open(false);
          }}
        >
          close
        </button>
        <div>
           {description}
        </div>
      </div>
    </>
  );
}
