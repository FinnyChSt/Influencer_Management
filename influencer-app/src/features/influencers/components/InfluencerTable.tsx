import { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchInfluencers } from "../slice/Influencer.slice";
import TableLoadingSkeleton from "./TableLoadingSkeleton";
import SearchBar from "./SearchBar";
import { SocialMediaTypes } from "../../../shared/types/models";

function InfluencerTable() {
  const influencers = useAppSelector((state) =>
    state.influencers.influencers.map((influencer) => ({
      ...influencer,
      instagram:
        influencer.socialMedia?.find(
          (sm) => sm.type === SocialMediaTypes.Instagram
        )?.username || "-",
      tiktok:
        influencer.socialMedia?.find(
          (sm) => sm.type === SocialMediaTypes.TikTok
        )?.username || "-",
    }))
  );
  const isLoading = useAppSelector((state) => state.influencers.isLoading);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const handleSearch = (firstName: string, lastName: string) => {
    if (firstName || lastName) {
      dispatch(fetchInfluencers({ firstName, lastName }));
    } else {
      dispatch(fetchInfluencers());
    }
  };

  useEffect(() => {
    dispatch(fetchInfluencers());
  }, [dispatch]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      {isLoading || navigation.state === "loading" ? (
        <TableLoadingSkeleton />
      ) : (
        <div className={`relative overflow-hidden shadow-md rounded-lg`}>
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
              {influencers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-5 border border-neutral-200 text-center p-4"
                  >
                    No influencers found
                  </td>
                </tr>
              ) : (
                influencers.map((influencer, index) => (
                  <tr key={index} className="py-5">
                    <td className="py-5 border border-neutral-200 text-center p-4">
                      {influencer.firstName}
                    </td>
                    <td className="py-5 border border-neutral-200 text-center p-4">
                      {influencer.lastName}
                    </td>
                    <td className="py-5 border border-neutral-200 text-center p-4">
                      {influencer.tiktok}
                    </td>
                    <td className="py-5 border border-neutral-200 text-center p-4">
                      {influencer.instagram}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default InfluencerTable;
