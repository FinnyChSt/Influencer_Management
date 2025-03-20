function TableLoadingSkeleton() {
  return (
    <div className="relative overflow-hidden shadow-md rounded-lg">
      <table className="table-auto w-full text-left">
        <thead className="bg-[#EBFF08] text-[#000000]">
          <tr>
            <td className="py-1 border border-neutral-200 text-center font-bold p-4">
              First Name
            </td>
            <td className="py-1 border border-neutral-200 text-center font-bold p-4">
              Last Name
            </td>
            <td className="py-1 border border-neutral-200 text-center font-bold p-4">
              Tiktok
            </td>
            <td className="py-1 border border-neutral-200 text-center font-bold p-4">
              Instagram
            </td>
          </tr>
        </thead>
        <tbody className="bg-[#424242] text-white">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="py-5">
              <td className="py-5 border border-neutral-200 text-center p-4">
                <div className="animate-pulse bg-neutral-200 h-4 rounded-md mx-auto w-3/4"></div>
              </td>
              <td className="py-5 border border-neutral-200 text-center p-4">
                <div className="animate-pulse bg-neutral-200 h-4 rounded-md mx-auto w-3/4"></div>
              </td>
              <td className="py-5 border border-neutral-200 text-center p-4">
                <div className="animate-pulse bg-neutral-200 h-4 rounded-md mx-auto w-3/4"></div>
              </td>
              <td className="py-5 border border-neutral-200 text-center p-4">
                <div className="animate-pulse bg-neutral-200 h-4 rounded-md mx-auto w-3/4"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableLoadingSkeleton;
