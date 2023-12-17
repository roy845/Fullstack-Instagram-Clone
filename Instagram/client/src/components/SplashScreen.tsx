import React from "react";

interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const containerStyle: React.CSSProperties = {
    height: "100vh", // Set height to 100% of the viewport height
    width: "100vw", // Set width to 100% of the viewport width
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensure the image covers the entire container
  };

  return (
    <div style={containerStyle}>
      <img
        src={"/splash-instagram.gif"}
        alt="Instagram splash screen"
        style={imageStyle}
      />
    </div>
  );
};

export default SplashScreen;
