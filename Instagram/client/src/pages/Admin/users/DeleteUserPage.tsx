import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
import toast from "react-hot-toast";
import { deleteObject, listAll, ref } from "firebase/storage";

import AdminLayout from "../../../layouts/AdminLayout";
import {
  Navigate,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router";
import storage from "../../../config/firebase";
import { deleteUser, getUser } from "../../../Api/serverAPI";
import { HTTP_404_NOT_FOUND } from "../../../constants/httpStatusCodes";
import { User } from "../../../types";
import Spinner from "../../../components/Spinner";

type DeleteUserModalProps = {};

const DeleteUserPage: React.FC<DeleteUserModalProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({} as User);

  const { userId } = useParams();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const fetchUserById = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data: user } = await getUser(userId as string);
        setUser(user);

        setLoading(false);
      } catch (error: any) {
        if (error?.response?.status === HTTP_404_NOT_FOUND) {
          toast.error(error?.response?.data.detail, {
            position: "bottom-left",
          });
        }
        setLoading(false);
      }
    };
    fetchUserById();
  }, [userId]);

  const removeFiles = async () => {
    try {
      const storageRef = ref(storage, `${user?.username}/files`);
      const filesInFolder = await listAll(storageRef);

      const deletePromises = filesInFolder.items.map(async (fileRef) => {
        await deleteObject(fileRef);
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data } = await deleteUser(user._id);
      await removeFiles();
      navigate("/admin/users");
      toast.success(
        `User ${user.username} and its files\\posts and stories deleted successfully`
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      ) : (
        <>
          <h2>Are you sure you want to delete {user.username} ? </h2>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="20px"
            gap="10px"
          >
            <Button
              disabled={loading}
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={() => navigate("/admin/users")}
            >
              Discard
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </Box>
        </>
      )}
    </AdminLayout>
  );
};

export default DeleteUserPage;
