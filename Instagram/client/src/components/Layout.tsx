import Helmet from "react-helmet";
import { RightBar } from "./RightBar";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/auth";
import SplashScreen from "./SplashScreen";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
}

export const Layout = ({
  children,
  title,
  description,
  keywords,
  author,
}: LayoutProps) => {
  const { loadingSplashScreen, setLoadingSplashScreen } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      setLoadingSplashScreen(false);
    }, 7080);
  }, []);

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

      {loadingSplashScreen ? (
        <SplashScreen />
      ) : (
        <>
          <RightBar />
          <main className="bg-gray-background min-h-screen w-[75%] flex flex-col items-center pl-10">
            {children}
          </main>
        </>
      )}
    </div>
  );
};
