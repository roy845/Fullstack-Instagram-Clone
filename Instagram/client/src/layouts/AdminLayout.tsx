import React, { useEffect } from "react";
import PersistentDrawerLeft from "../pages/Admin/components/Drawer";
import { Helmet } from "react-helmet";

type AdminLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  description,
  keywords,
  author,
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>
      <main style={{ minHeight: "80vh" }}>
        <PersistentDrawerLeft />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
