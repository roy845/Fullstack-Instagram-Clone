import { useState } from "react";
import { TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { User } from "../../../types";
import { makeStyles } from "@mui/styles";
import { defaultProfilePic } from "../../../constants/paths";
import NoUsersFound from "../components/NoUsersFound";
import { useUsers } from "../../../context/users";

const useStyles = makeStyles({
  tableRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
  },
});

interface NewUsersTableProps {
  newUsers: User[];
}

const NewUsersTable: React.FC<NewUsersTableProps> = ({ newUsers }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const classes = useStyles();
  const { activeUsers } = useUsers();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredNewUsers = newUsers.filter(
    (user: User) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
      </div>

      {filteredNewUsers.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NoUsersFound />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <strong>Total users found:</strong> {filteredNewUsers.length}
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
                {filteredNewUsers?.map((row: User) => (
                  <TableRow
                    key={row._id}
                    className={`table-row ${classes.tableRow}`}
                  >
                    <TableCell component="th" scope="row" align="center">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {activeUsers.some(
                          (active) => active?._id === row._id
                        ) ? (
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
                                src={row?.profilePic?.url || defaultProfilePic}
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
                                src={row?.profilePic?.url || defaultProfilePic}
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
                    <TableCell align="center">{row?.emailAddress}</TableCell>
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
        </div>
      )}
    </div>
  );
};

export default NewUsersTable;
