import { useEffect, useState } from "react";
import {
  findAllUsers,
  getNewUsers,
  getUsersStats,
} from "../../../Api/serverAPI";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { Button, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { User, UserStats } from "../../../types";
import AdminLayout from "../../../layouts/AdminLayout";
import Chart from "../components/Chart";
import UsersTable from "../components/UsersTable";
import NewUsersTable from "./NewUsersTable";

type UserStatisticsProps = {};

const UserStatistics = () => {
  const [userStats, setUserStats] = useState<UserStats[]>([] as UserStats[]);
  const [newUsers, setNewUsers] = useState<User[]>([] as User[]);
  const [allUsers, setAllUsers] = useState<User[]>([] as User[]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = allUsers?.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await findAllUsers();
        setAllUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        const { data } = await getUsersStats();
        console.log(data);
        setUserStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsersStats();
  }, []);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const { data } = await getNewUsers();
        setNewUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNewUsers();
  }, []);

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight="bold">
        Users statistics
      </Typography>

      <Chart
        title="New Users Per Month"
        data={userStats}
        dataKey="New User"
        grid
      />

      <Typography variant="h4" fontWeight="bold">
        Users analytics
      </Typography>
      <TextField
        type="text"
        placeholder="Search by username or an email"
        value={searchQuery}
        style={{ width: "320px" }}
        onChange={handleSearchInputChange}
        InputProps={{
          endAdornment: null,
          startAdornment: <Search color="action" />,
          disableUnderline: true,
        }}
      />
      <UsersTable
        searchResults={filteredUsers}
        analysis
        fetchAgain={false}
        setFetchAgain={() => {}}
      />
      <Typography variant="h4" fontWeight="bold" sx={{ mt: "10px" }}>
        New Users (5 recent)
      </Typography>
      <NewUsersTable newUsers={newUsers} />

      <Button
        sx={{ marginTop: "10px" }}
        variant="contained"
        startIcon={<ArrowBackIos />}
        onClick={() => navigate("/admin")}
      />
    </AdminLayout>
  );
};

export default UserStatistics;
