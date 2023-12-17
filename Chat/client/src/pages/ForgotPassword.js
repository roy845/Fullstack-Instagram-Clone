import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import WhatsAppLogo from "../WhatsApp.svg.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../Api/serverAPI";
import { HTTP_400_BAD_REQUEST } from "../constants/httpStatusCodes";
import validator from "validator";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const isEmail = validator.isEmail(email);

  const submitHandler = async () => {
    if (!email) {
      toast({
        title: "Please Fill Email",
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
      const { data } = await forgotPassword(email);

      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

      setLoading(false);
      setEmail("");
    } catch (error) {
      if (error?.response?.status === HTTP_400_BAD_REQUEST) {
        toast({
          title: error?.response?.data?.message,
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
        <Stack spacing={2} mb={5}>
          <Text>
            1. Enter your registered email address in the field below.
          </Text>
          <Text>
            2. Click the <strong>"Send Reset Link"</strong> button to receive a
            password reset link.
          </Text>
          <Text>
            3. Check your email and follow the instructions to reset your
            password.
          </Text>
          <Text fontStyle="italic">
            Note: If you don't receive an email within a few minutes, please
            check your spam folder.
          </Text>
        </Stack>

        <VStack spacing="10px">
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Stack direction={"column"} width={"100%"}>
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
              <Link to="/">
                <Text fontWeight={600}>Remember your password ? Login</Text>
              </Link>
            </Stack>
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
            isDisabled={!isEmail || !email}
            backgroundColor="#46c556"
          >
            Send Reset Link
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
