import { Box, Button, TextField, Typography } from "@mui/material";
import { ArrowBackIos, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router";
import Spinner from "../../../components/Spinner";
import AdminLayout from "../../../layouts/AdminLayout";
import { User } from "../../../types";
import UsersTable from "../components/UsersTable";
import { searchAllUsers } from "../../../Api/serverAPI";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([] as User[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const navigate = useNavigate();

  const debouncedSearch = debounce(async (query) => {
    try {
      setLoading(true);
      const { data } = await searchAllUsers(query);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching users:", error);
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, fetchAgain]);

  return (
    <AdminLayout>
      <Typography fontWeight="bold" fontSize={28}>
        Users
      </Typography>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <TextField
          placeholder="Search users"
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: null,
            startAdornment: <Search color="action" />,
            disableUnderline: true,
          }}
        />
      </div>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <Spinner />
        </Box>
      ) : (
        <>
          <UsersTable
            searchResults={searchResults}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
          <Button
            sx={{ marginTop: "10px" }}
            variant="contained"
            startIcon={<ArrowBackIos />}
            onClick={() => navigate(-1)}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default Users;
