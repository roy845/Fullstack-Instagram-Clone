import { useEffect } from "react";
import { Timeline } from "../components/Timeline";
import { Sidebar } from "../components/sideBar/Sidebar";
import { useCheckToken } from "../hooks/useCheckToken";
import { Layout } from "../components/Layout";

type Props = {};

const Home = (props: Props) => {
  useCheckToken();

  useEffect(() => {
    document.title = "Instagram";
  }, []);

  return (
    <Layout title="Instagram">
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <Sidebar />
        <Timeline />
      </div>
    </Layout>
  );
};

export default Home;
