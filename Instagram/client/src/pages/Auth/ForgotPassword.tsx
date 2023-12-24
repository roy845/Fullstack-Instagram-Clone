import { useState, useEffect } from "react";
import isEmail from "validator/lib/isEmail";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { forgotPassword } from "../../Api/serverAPI";
import { HTTP_404_NOT_FOUND } from "../../constants/httpStatusCodes";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import LockResetIcon from "@mui/icons-material/LockReset";

export const ForgotPassword = (): JSX.Element => {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const isInvalid: boolean = !isEmail(emailAddress) || !emailAddress;

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const { data } = await forgotPassword(emailAddress);
      setLoading(false);

      toast.success(data.message, { position: "bottom-left" });
      setEmailAddress("");
    } catch (error: any) {
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Forgot Password - Instagram";
  }, []);

  const emailValidation: JSX.Element = (
    <div className="mb-1">
      {emailAddress && isEmail(emailAddress) ? (
        <div className="flex items-center">
          <FaCheck style={{ color: "green" }} />
          <span className="text-green-primary ml-2">Valid Email</span>
        </div>
      ) : emailAddress && !isEmail(emailAddress) ? (
        <div className="flex items-center">
          <FaTimes style={{ color: "red" }} />
          <span className="text-red-primary ml-2">Invalid Email</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen pr-2">
      <div className="flex w-3/5">
        <img
          src="https://i.ibb.co/pXZcHyw/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="https://i.ibb.co/myQsJpX/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <input
            aria-label="Enter your email address"
            type="email"
            placeholder="Email address"
            className={`text-sm text-gray-base w-full py-5 px-4 h-2 border rounded mb-2 ${
              !isEmail(emailAddress) && emailAddress
                ? "border-red-primary"
                : isEmail(emailAddress) && emailAddress
                ? "border-green-primary "
                : "border-gray-primary"
            }`}
            // className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
          />
          {emailValidation}
          <button
            onClick={handleForgotPassword}
            disabled={isInvalid}
            type="button"
            className={`bg-blue-medium ml-1 text-white w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? (
              <Spinner sm />
            ) : (
              <>
                <LockResetIcon sx={{ mr: 1 }} />
                Reset Password
              </>
            )}
          </button>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Remember your password ? {` `}
            <Link to={"/"} className="font-bold text-blue-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
