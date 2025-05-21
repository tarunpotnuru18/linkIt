export default function Error() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-gray-950 ">
        <div className="text-gray-400 flex items-center gap-3.5 font-medium flex-col lg:flex-row ">
          <span className="text-white font-bold text-[32px] font-inter lg:border-r-[0.3px] lg:border-r-gray-700 px-[14px] ">
            404
          </span>
          page could not be found
        </div>
      </div>
    </>
  );
}
