import axios from "axios";
import { Influencer, InfluencerListSearch } from "../../../shared/types/models";
import { BASE_URL, Endpoint } from "../../../shared/api/apiConfig";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getInfluencerList(params?: InfluencerListSearch) {
  try {
    const response = await apiClient.get<Influencer[]>(
      `/${Endpoint.influencer}`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching influencer list:", error);
    return [];
  }
}

export async function createInfluencer(influencer: Influencer) {
  try {
    const response = await apiClient.post(
      `/${Endpoint.influencer}`,
      influencer
    );

    if (response.status != 201) {
      throw new Error("influencer not created");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating influencer:", error);
    throw error;
  }
}
