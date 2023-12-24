import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "../types";
import { searchUsers } from "../Api/serverAPI";
import Spinner from "./Spinner";
import UserBadge from "./Userbadge";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([] as User[]);

  const debouncedSearch = debounce(async (searchTerm: string) => {
    try {
      setLoading(true);
      const { data: users } = await searchUsers(searchTerm);
      setUsers(users);
      setLoading(false);
    } catch (error: any) {
      console.error("Error searching users:", error);
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  return (
    <div
      className={`fixed z-50 overflow-hidden transition-opacity ${
        isOpen
          ? "ease-out duration-300 opacity-100"
          : "ease-in duration-200 opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll-hidden">
            {/* Search Header */}
            <div className="p-4 border-b">
              <button className="float-right" onClick={onClose}>
                <FaTimes className="mt-2" />
              </button>
              <h2 className="text-2xl font-semibold text-start">Search</h2>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Search"
              />
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {searchTerm &&
                  users.map((user) => (
                    <UserBadge
                      username={user.username}
                      fullName={user.fullName}
                      profilePic={user.profilePic?.url}
                      userId={user?._id}
                    />
                  ))}
              </>
            )}

            {/* Additional content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDrawer;
