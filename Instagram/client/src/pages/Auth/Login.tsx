import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { login } from "../../Api/serverAPI";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { HTTP_403_FORBIDDEN } from "../../constants/httpStatusCodes";
import Spinner from "../../components/Spinner";

export const Login = () => {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { auth, setAuth, setLoadingSplashScreen } = useAuth();

  const isInvalid = !isEmail(emailAddress) || !password || !emailAddress;

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const formDataObject: FormData = new FormData();
    formDataObject.append("username", emailAddress);
    formDataObject.append("password", password);
    try {
      setLoading(true);
      const { data } = await login(formDataObject);
      setLoading(false);
      toast.success(data.message, { position: "bottom-left" });

      setAuth({
        ...auth,
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      });

      const authData = {
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      setLoadingSplashScreen(true);
    } catch (error: any) {
      if (error?.response?.status === HTTP_403_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Login - Instagram";
  }, []);

  const emailValidation = (
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

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formDataObject: FormData = new FormData();
      formDataObject.append("username", emailAddress);
      formDataObject.append("password", password);
      try {
        setLoading(true);
        const { data } = await login(formDataObject);
        setLoading(false);
        toast.success(data.message, { position: "bottom-left" });

        setAuth({
          ...auth,
          access_token: data.access_token,
          token_type: data.token_type,
          user: data.user,
        });

        const authData = {
          access_token: data.access_token,
          token_type: data.token_type,
          user: data.user,
        };

        localStorage.setItem("auth", JSON.stringify(authData));
      } catch (error: any) {
        if (error?.response?.status === HTTP_403_FORBIDDEN) {
          toast.error(error?.response?.data?.detail, {
            position: "bottom-left",
          });
        }
        setLoading(false);
      }
    }
  };
  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen pr-2">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <h1 className="text-xl font-bold">Login</h1>
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
            aria-label="Enter your email address"
            type="email"
            disabled={loading}
            placeholder="Email address"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
          />
          {emailValidation}
          <input
            aria-label="Enter your password"
            type="password"
            disabled={loading}
            placeholder="Password"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />
          <button
            disabled={isInvalid}
            type="button"
            className={`bg-blue-medium text-white ml-1 w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50 cursor-not-allowed"}`}
            onClick={handleLogin}
            onKeyDown={handleKeyPress}
          >
            {loading ? <Spinner sm /> : "Login"}
          </button>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account ?{" "}
            <Link to={"/signup"} className="font-bold text-blue-medium">
              Sign up
            </Link>
          </p>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary mt-2">
          <p className="text-sm">
            Forgot your password ? {` `}
            <Link to={"/forgotpassword"} className="font-bold text-blue-medium">
              Forgot password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
