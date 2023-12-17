import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import WhatsAppLogo from "../WhatsApp.svg.png";
import { resetPassword } from "../Api/serverAPI";

const ResetPassword = () => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPassword, setShowPassowrd] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShowPassowrd((prev) => !prev);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    setPasswordsMatch(e.target.value === password);
  };

  const submitHandler = async () => {
    if (!passwordsMatch) {
      toast({
        title: "Password don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await resetPassword(token, password);
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const borderColor =
    !passwordsMatch && password
      ? "red.500"
      : password
      ? "green.500"
      : "gray.500";

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        textAlign="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Flex alignItems="center" justifyContent="center" spacing={3}>
          <Text fontSize="4xl" fontFamily="Work sans">
            WhatsApp
          </Text>
          <img
            src={WhatsAppLogo}
            width="32px"
            height="32px"
            alt="WhatsApp Logo"
          />
        </Flex>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <VStack spacing="10px">
          <Stack direction={"column"} width={"100%"}>
            <FormControl id="resetPassword" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  borderColor={borderColor}
                />

                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="confirmResetPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter confirm password"
                  borderColor={borderColor}
                />

                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!passwordsMatch && password ? (
                <Text color="red.500" fontSize="sm">
                  Passwords do not match.
                </Text>
              ) : password ? (
                <Text color="green.500" fontSize="sm">
                  Passwords match.
                </Text>
              ) : null}
            </FormControl>
          </Stack>

          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
            isDisabled={!passwordsMatch}
            backgroundColor={!passwordsMatch ? "gray.500" : "#46c556"}
          >
            Reset password
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ResetPassword;
