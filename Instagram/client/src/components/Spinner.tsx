const Spinner = ({ sm }: { sm?: boolean }) => {
  const spinnerSize = sm ? "h-6 w-6" : "h-16 w-16";

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${spinnerSize} border-t-4 border-blue-500 border-solid`}
      ></div>
    </div>
  );
};

export default Spinner;
