import { useState, useEffect } from "react";
import { User } from "../../types";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { getUserSuggestions } from "../../Api/serverAPI";
import SuggestedProfile from "./SuggestedProfile";
import Spinner from "../Spinner";

export const Suggestions = () => {
  const [profiles, setProfiles] = useState<User[]>([] as User[]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    async function suggestedProfiles() {
      const fetchUserSuggestions = async (): Promise<void> => {
        try {
          setLoading(true);
          const { data } = await getUserSuggestions();
          setProfiles(data);
          setLoading(false);
        } catch (error: any) {
          setAuth(null);
          localStorage.removeItem("auth");
          navigate("/");
          toast.error(error);
          setLoading(false);
        }
      };
      fetchUserSuggestions();
    }

    suggestedProfiles();
  }, []);

  return (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">
          {profiles.length === 0
            ? "No user suggestions found for you"
            : "Suggestions for you"}
        </p>
      </div>
      <div className="mt-4 grid gap-5">
        {loading ? (
          <Spinner />
        ) : (
          profiles.map((profile) => (
            <SuggestedProfile key={profile?._id} profile={profile} />
          ))
        )}
      </div>
    </div>
  );
};
