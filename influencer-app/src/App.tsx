import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./shared/components/MainLayout";
import "./App.css";
import InfluencerRoutes from "./routes/InfluencerRoutes";
import { fetchInfluencers } from "./features/influencers/slice/Influencer.slice";
import { BASE_URL } from "./shared/api/apiConfig";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: async () => {
      //health check for establishing communication
      try {
        fetch(`${BASE_URL}/health`);
        // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
      } catch (error) {}
      return Promise.resolve();
    },
    children: [
      {
        path: "list",
        element: <InfluencerRoutes />,
        loader: async () => {
          store.dispatch(fetchInfluencers());
          return Promise.resolve();
        },
        children: [
          {
            path: "create",
            element: null,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
