import { useEffect, useState } from "react";

import axios from "axios";
import { useAuth } from "../context/auth";
import { API_URLS } from "../Api/serverAPI";

const TimeSpent = () => {
  const [startTime, setStartTime] = useState(Date.now());

  const { auth } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      localStorage.setItem("timeSpent", (currentTime - startTime).toString());
    }, 1000);

    return () => {
      clearInterval(interval);

      saveTimeSpent();
    };
  }, [startTime]);

  const saveTimeSpent = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const { data } = await axios.put(
        `${API_URLS.updateTimeSpentInApp}${auth?.user?._id}`,
        {
          date: currentDate,
          timeSpent: localStorage.getItem("timeSpent"),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return <div></div>;
};

export default TimeSpent;
