import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";
import WhatsAppLogo from "../WhatsApp.svg.png";

function Homepage() {
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
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab
              _selected={{ bg: "#46c556", color: "white" }}
              _active={{ bg: "#46c556", color: "white" }}
              bg="white"
            >
              Login
            </Tab>
            <Tab
              _selected={{ bg: "#46c556", color: "white" }}
              _active={{ bg: "#46c556", color: "white" }}
              bg="white"
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
