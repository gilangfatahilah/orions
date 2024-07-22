const Loader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex items-end pb-20 justify-center w-full gap-2 h-[27px]">
        <div className="cube w-3 h-3 animate-jump delay-0">
          <div className="w-full h-full rounded-full bg-primary animate-morph delay-0"></div>
        </div>
        <div className="cube w-3 h-3 animate-jump delay-300">
          <div className="w-full h-full rounded-full bg-primary animate-morph delay-300"></div>
        </div>
        <div className="cube w-3 h-3 animate-jump delay-700">
          <div className="w-full h-full rounded-full bg-primary animate-morph delay-700"></div>
        </div>
        <div className="cube w-3 h-3 animate-jump delay-1000">
          <div className="w-full h-full rounded-full bg-primary animate-morph delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
