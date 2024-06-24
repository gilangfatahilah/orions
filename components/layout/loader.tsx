const Loader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full animate-pulse bg-primary" />
        <div className="w-3 h-3 rounded-full animate-pulse bg-primary" />
        <div className="w-3 h-3 rounded-full animate-pulse bg-primary" />
      </div>
    </div>
  );
};

export default Loader;
