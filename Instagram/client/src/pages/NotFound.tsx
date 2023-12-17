import React from "react";
import { Layout } from "../components/Layout";

const NotFound: React.FC = () => {
  return (
    <Layout title="Not found">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-gray-600">
            The page you are looking for does not exist.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
