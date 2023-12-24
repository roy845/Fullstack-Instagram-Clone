import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
// import DeleteUserModal from "../../modals/deleteUserModal/DeleteUserModal";
import { useNavigate } from "react-router";
import { makeStyles } from "@mui/styles";
import { User } from "../../../types";
import { useAuth } from "../../../context/auth";
import { useUsers } from "../../../context/users";
import { defaultProfilePic } from "../../../constants/paths";
import NoUsersFound from "./NoUsersFound";
import UpdateUserModal from "../../../components/UpdateUserModal";

const useStyles = makeStyles({
  tableRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
  },
});

interface UsersTableProps {
  searchResults: User[];
  fetchAgain: boolean;
  analysis?: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  searchResults,
  fetchAgain,
  analysis,
  setFetchAgain,
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [selectedUser, setSelectedUser] = useState<User>({} as User);

  const { auth } = useAuth();
  const { activeUsers } = useUsers();
  const classes = useStyles();

  const navigate = useNavigate();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteModal = (user: User) => {
    navigate(`/admin/users/delete/${user?._id}`);
  };

  const handleNavigateEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const navigateToUserAnalytics = (userId: string) => {
    analysis && navigate(`/timeSpentAnalytics/${userId}`);
  };

  const rowsToDisplay: User[] = searchResults.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const rowsPerPageOptions: number[] = [5, 10, 15];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {searchResults.length === 0 ? (
        <NoUsersFound />
      ) : (
        <div>
          {searchResults.length > 0 && (
            <div>
              <strong>Total users found:</strong> {searchResults.length}
            </div>
          )}
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
                  {!analysis && (
                    <TableCell align="center">
                      <strong>Actions</strong>&nbsp;
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsToDisplay?.map((row: User) => (
                  <TableRow
                    onClick={() => navigateToUserAnalytics(row._id)}
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
                    {!analysis && (
                      <TableCell
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          style={{
                            marginRight: "10px",
                            backgroundColor: "purple",
                            color: "white",
                          }}
                          onClick={() => handleNavigateEditUser(row?._id)}
                          endIcon={<EditIcon />}
                        >
                          Edit
                        </Button>

                        {auth?.user?.isAdmin !== row.isAdmin && (
                          <Button
                            style={{ backgroundColor: "red", color: "white" }}
                            variant="contained"
                            onClick={() => handleOpenDeleteModal(row)}
                            endIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={searchResults.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
            />
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
