import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { resetPassword } from "../../Api/serverAPI";
import { HTTP_400_BAD_REQUEST } from "../../constants/httpStatusCodes";
import toast from "react-hot-toast";

import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router-dom";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [error, setError] = useState<string>("");
  const isInvalid = !newPassword;
  const { token } = useParams();
  const navigate: NavigateFunction = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = e.target.value;
    setConfirmPassword(enteredPassword);

    // Check if passwords match
    if (enteredPassword.length === 0) {
      // Clear the error message when the password is empty
      setPasswordsMatch(null);
    } else if (newPassword === enteredPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }

    // Check if password is entered
    setPasswordEntered(enteredPassword.length > 0);
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await resetPassword(newPassword, token!);
      toast.success(data.message, { position: "bottom-left" });
      navigate("/");
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === HTTP_400_BAD_REQUEST) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
    }
  };

  useEffect(() => {
    if (newPassword === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    document.title = "Reset Password - Instagram";
  }, []);

  const passwordsValidations = (
    <div className="flex items-center mb-1">
      {passwordEntered && (
        <>
          {passwordsMatch === true ? (
            <>
              <FaCheck style={{ color: "green" }} />
              <span className="text-green-primary ml-2">Passwords match</span>
            </>
          ) : passwordsMatch === false ? (
            <>
              <FaTimes style={{ color: "red" }} />
              <span className="text-red-primary ml-2">
                Passwords don't match
              </span>
            </>
          ) : null}
        </>
      )}
    </div>
  );

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen pr-2">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <h1 className="text-xl font-bold">Reset Password</h1>
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <input
            aria-label="Enter your new password"
            type="password"
            placeholder="Enter your new password"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setNewPassword(target.value)}
            value={newPassword}
          />
          <input
            aria-label="Confirm your new password"
            type="password"
            placeholder="Confirm your new password"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={handlePasswordChange}
            value={confirmPassword}
          />

          {passwordsValidations}
          <button
            onClick={handleResetPassword}
            disabled={isInvalid}
            type="button"
            className={`bg-blue-medium ml-1 text-white w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50 cursor-not-allowed"}`}
          >
            Reset Password
          </button>
          <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary mt-2">
            <p className="text-sm">
              Remember your password ? {` `}
              <Link to={"/"} className="font-bold text-blue-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
