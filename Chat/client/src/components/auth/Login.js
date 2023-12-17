import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../Api/serverAPI";
import { useAuth } from "../../context/auth";
import validator from "validator";
import {
  HTTP_400_BAD_REQUEST,
  HTTP_401_UNAUTHORIZED,
} from "../../constants/httpStatusCodes";

const Login = () => {
  const [showPassword, setShowPassowrd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const isEmail = validator.isEmail(email);

  const { setAuth } = useAuth();

  const location = useLocation();

  let from = "/";
  if (location.state && location.state.from && location.state.from.pathname) {
    from = location.state.from.pathname;
  }

  const handleClick = () => {
    setShowPassowrd((prev) => !prev);
  };

  const submitHandler = async () => {
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }

    if (!isEmail) {
      toast({
        title: "Email must be an email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await login(email, password);

      toast({
        title: "User logged in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setAuth(data);
      navigate(from, { replace: true });
    } catch (error) {
      if (error?.response?.status === HTTP_400_BAD_REQUEST) {
        toast({
          title: error?.response?.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      if (error?.response?.status === HTTP_401_UNAUTHORIZED) {
        toast({
          title: error?.response?.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="loginEmail"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && isEmail ? (
          <Text color="green.500" fontSize="sm">
            Valid Email.
          </Text>
        ) : email && !isEmail ? (
          <Text color="red.500" fontSize="sm">
            *Invalid Email.
          </Text>
        ) : null}
      </FormControl>
      <FormControl id="loginPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Stack direction={"column"} width={"100%"}>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
            <Link to="/forgotpassword">
              <Text fontWeight={700}>Forgot password ?</Text>
            </Link>
          </Stack>

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        isDisabled={!isEmail || !password}
        backgroundColor="#46c556"
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="blue"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
