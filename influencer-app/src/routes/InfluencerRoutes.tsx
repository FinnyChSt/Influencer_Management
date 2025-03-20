import { useLocation, useNavigate } from "react-router-dom";
import InfluencerTable from "../features/influencers/components/InfluencerTable";
import InfluencerForm from "../features/influencers/components/InfluencerForm";
import { useEffect } from "react";
import { setModalOpen } from "../features/influencers/slice/Influencer.slice";
import { useAppDispatch } from "../store/hooks";

function InfluencerRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isCreateRoute = location.pathname.includes("/create");

  useEffect(() => {
    dispatch(setModalOpen(isCreateRoute));
  }, [isCreateRoute, dispatch]);

  useEffect(() => {
    const handleModalClose = () => {
      if (isCreateRoute) {
        navigate("/list");
      }
    };
    window.addEventListener("modalClosed", handleModalClose);
    return () => {
      window.removeEventListener("modalClosed", handleModalClose);
    };
  }, [isCreateRoute, navigate]);

  return (
    <>
      <div className={isCreateRoute ? "content-blurred" : ""}>
        <InfluencerTable />
      </div>
      <InfluencerForm />
    </>
  );
}

export default InfluencerRoutes;
