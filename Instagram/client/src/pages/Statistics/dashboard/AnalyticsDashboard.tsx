import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router";
import { TimeSpentInApp } from "../../../types";
import { useAuth } from "../../../context/auth";
import { getTimeSpentInApp } from "../../../Api/serverAPI";
import NoAnalyticsData from "../components/NoAnalyticsData";
import TimeSpentAnalytics from "../components/TimeSpentAnalytics";

const generateRandomColor = () => {
  let color = "#000000";
  return color;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "black",
    color: generateRandomColor(),
    border: `1px solid ${generateRandomColor()}`,
    "&.Mui-selected": {
      backgroundColor: generateRandomColor(),
      color: "black",
      "&:hover": {
        backgroundColor: generateRandomColor(),
      },
    },
  },
}));

type AnalyticsDashboardProps = {};

const AnalyticsDashboard = () => {
  const [timeSpent, setTimeSpent] = useState<TimeSpentInApp[]>(
    [] as TimeSpentInApp[]
  );
  const { auth, setAuth } = useAuth();
  const classes = useStyles();
  const { userId } = useParams();

  useEffect(() => {
    const fetchTimeSpent = async () => {
      try {
        const { data } = await getTimeSpentInApp(userId as string);
        console.log(data);
        // Convert timeSpent field to minutes and exclude _id and id fields
        const convertedData: TimeSpentInApp[] = data.timeSpentInApp.map(
          ({ timeSpent, ...rest }: { timeSpent: number }) => {
            const convertedTimeSpent = parseFloat(
              (timeSpent / 60000).toFixed(2)
            ); // Convert milliseconds to minutes
            return { ...rest, timeSpent: convertedTimeSpent };
          }
        );

        // Sort the data based on the date field in descending order
        const sortedData = convertedData.sort(
          (a: TimeSpentInApp, b: TimeSpentInApp) => {
            return Number(new Date(b.date)) - Number(new Date(a.date));
          }
        );

        setTimeSpent(sortedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTimeSpent();
  }, [userId]);

  return (
    <div className={classes.root}>
      {timeSpent?.length === 0 ? (
        <>
          <NoAnalyticsData />
        </>
      ) : (
        <>
          <h1
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              color: generateRandomColor(),
            }}
          >
            Time Spent In App (In Minutes)
          </h1>

          <TimeSpentAnalytics timeSpent={timeSpent} />
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
