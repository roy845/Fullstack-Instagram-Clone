import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import { register } from "../../Api/serverAPI";
import toast from "react-hot-toast";
import { RegisterFormData } from "../../types";
import { HTTP_409_FORBIDDEN } from "../../constants/httpStatusCodes";
import Spinner from "../../components/Spinner";

export const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordEntered, setPasswordEntered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isInvalid =
    !isEmail(emailAddress) ||
    !password ||
    !emailAddress ||
    !fullName ||
    !username ||
    !passwordsMatch;

  const handleSignUp = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      const formData: RegisterFormData = {
        username,
        fullName,
        emailAddress,
        password,
      };
      const { data } = await register(formData);
      toast.success(data.message, { position: "bottom-left" });
      setLoading(false);
      resetForm();
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status === HTTP_409_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);

      // Check if passwords match
      if (value.length === 0) {
        // Clear the error message when the password is empty
        setPasswordsMatch(null);
      } else if (password === value) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }

      // Check if password is entered
      setPasswordEntered(value.length > 0);
    }
  };

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setEmailAddress("");
    setPassword("");
  };

  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    document.title = "Sign Up - Instagram";
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

  const passwordsMatchValidation = (
    <div className="mb-1">
      {passwordsMatch === false && passwordEntered ? (
        <div className="flex items-center">
          <FaTimes style={{ color: "red" }} />
          <span className="text-red-primary ml-2">Passwords don't match</span>
        </div>
      ) : passwordEntered ? (
        <div className="flex items-center">
          <FaCheck style={{ color: "green" }} />
          <span className="text-green-primary ml-2">Passwords match</span>
        </div>
      ) : null}
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
        <h1 className="text-xl font-bold">Sign Up</h1>
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
            aria-label="Enter your username"
            type="text"
            placeholder="Username"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
          />
          <input
            aria-label="Enter your full name"
            type="text"
            placeholder="Full name"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setFullName(target.value)}
            value={fullName}
          />
          <input
            aria-label="Enter your email address"
            type="email"
            placeholder="Email address"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
          />
          {emailValidation}
          <input
            aria-label="Enter your password"
            type="password"
            placeholder="Password"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />
          <input
            aria-label="Confirm your password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="text-sm text-gray-base w-full py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={handleChange}
            value={confirmPassword}
          />
          {passwordsMatchValidation}
          <button
            onClick={handleSignUp}
            disabled={isInvalid}
            type="button"
            className={`bg-blue-medium ml-1 text-white w-full rounded h-8 font-bold
            ${isInvalid && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? <Spinner sm /> : "Sign up"}
          </button>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account ?{" "}
            <Link to={"/"} className="font-bold text-blue-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
