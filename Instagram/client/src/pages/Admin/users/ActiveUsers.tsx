import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Badge, Button, TextField, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { ArrowBackIos, Search } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useUsers } from "../../../context/users";
import { useAuth } from "../../../context/auth";
import AdminLayout from "../../../layouts/AdminLayout";
import NoUsersFound from "../components/NoUsersFound";
import { User } from "../../../types";
import { defaultProfilePic } from "../../../constants/paths";

export default function ActiveUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { activeUsers: users } = useUsers();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const isUserActive = users.some((active) => active?._id === auth?.user?._id);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight="bold">
        Active Users
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <TextField
          type="text"
          placeholder="Search by username or an email"
          value={searchQuery}
          style={{ width: "320px" }}
          onChange={handleSearchInputChange}
          InputProps={{
            startAdornment: <Search color="action" />,
            disableUnderline: true,
          }}
        />

        {filteredUsers.length === 0 ? (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NoUsersFound />
          </div>
        ) : (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>
              <strong>Total users found:</strong> {filteredUsers.length}
            </div>

            <TableContainer component={Paper}>
              <Table className="table" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Username</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Email</strong>&nbsp;
                    </TableCell>
                    <TableCell align="center">
                      <strong>Is Admin</strong>&nbsp;
                    </TableCell>
                    <TableCell align="center">
                      <strong>Created At</strong>&nbsp;
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    ?.sort(
                      (a: User, b: User) =>
                        Number(new Date(b?.createdAt)) -
                        Number(new Date(a?.createdAt))
                    )
                    .map((row) => (
                      <TableRow key={row?._id} className="table-row">
                        <TableCell component="th" scope="row" align="center">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {isUserActive ? (
                              <>
                                <div
                                  style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    className="absolute top-0 left-0 w-4 h-4 bg-green-primary rounded-full"
                                    title="Online"
                                  />

                                  <img
                                    src={
                                      row?.profilePic?.url || defaultProfilePic
                                    }
                                    alt={row.username}
                                    width="32"
                                    height="32"
                                    style={{
                                      marginRight: "8px",
                                      borderRadius: "15px",
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    className="absolute top-0 left-0 w-4 h-4 bg-red-primary rounded-full"
                                    title="Offline"
                                  />

                                  <img
                                    src={
                                      row?.profilePic?.url || defaultProfilePic
                                    }
                                    alt={row.username}
                                    width="32"
                                    height="32"
                                    style={{
                                      marginRight: "8px",
                                      borderRadius: "15px",
                                    }}
                                  />
                                </div>
                              </>
                            )}

                            {row?.username}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {row?.emailAddress}
                        </TableCell>
                        <TableCell align="center">
                          {!row?.isAdmin ? (
                            <CloseIcon sx={{ color: "red" }} />
                          ) : (
                            <CheckIcon sx={{ color: "green" }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(row?.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              startIcon={<ArrowBackIos />}
              onClick={() => navigate("/admin")}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
