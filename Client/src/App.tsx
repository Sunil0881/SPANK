import { useState, useEffect, useRef } from "react";
import GirlFull from "../src/assets/GirlFull.png";
import ZoomGirl from "../src/assets/ZoomGirl.png"; // Import the new image
import startbtn from "../src/assets/startbtn.png";

import '@rainbow-me/rainbowkit/styles.css';

import {ConnectButton,getDefaultConfig,RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  polygonMumbai,
  sepolia,
  xdcTestnet,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [polygonMumbai,sepolia,xdcTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();


function App() {
  const imageRef = useRef<HTMLImageElement | null>(null); // Specify the type of the ref
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isFirstImage, setIsFirstImage] = useState(true); // Track the main image

  const handleClick = () => {
    setIsVisible(false); // Start fade-out animation for overlay and button
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current) { // Check if the ref is not null
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // X coordinate relative to the image
      const y = e.clientY - rect.top;  // Y coordinate relative to the image
      setCoordinates({ x, y });
      console.log("Coordinates:", { x, y }); // Log coordinates directly

      // Check which area was clicked and perform the corresponding action
      checkActionArea(x, y);
    }
  };

  const checkActionArea = (x: number, y: number) => {
    // Define action areas based on coordinates (for example)
    const actionAreas = [
      { id: "area1", x: 185, y: 271, width: 130, height: 80 }, // Example area
      // { id: "area2", x: 300, y: 200, width: 100, height: 100 }, // Another area
    ];

    actionAreas.forEach(area => {
      if (
        x >= area.x &&
        x <= area.x + area.width &&
        y >= area.y &&
        y <= area.y + area.height
      ) {
        // Trigger action based on the area clicked
        handleAction(area.id);
      }
    });
  };

  const handleAction = (areaId: string) => {
    switch (areaId) {
      case "area1":
        alert("Action for butt triggered!");
        break;
      case "area2":
        alert("Action for Area 2 triggered!");
        break;
      default:
        console.log("No action defined for this area.");
        break;
    }
  };

  useEffect(() => {
    if (!isVisible) {
      // Delay changing the main image until the fade-out animation is complete
      const timer = setTimeout(() => {
        setIsFirstImage(false); // Switch to the new image
      }, 700); // Match the fade-out duration (700ms)

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [isVisible]);

  return (
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider >
    <div className="relative flex items-center justify-center h-screen bg-black">
      <div className="relative w-[1000px] h-[1000px] flex items-center justify-center">
        {/* Main Image that changes after the overlay disappears */}
        <img
          ref={imageRef} // Attach the ref to the image
          src={isFirstImage ? GirlFull : ZoomGirl}
          alt="MainImage"
          onClick={handleImageClick}
          className={`${isFirstImage ? "object-cover w-full h-full" : "object-contain"}`}
          style={isFirstImage ? {} : { width: "515px", height: "515px" }}
        />

        {/* Black Overlay with Fade-Out Effect */}
        {isVisible && (
          <div
            className={`absolute inset-0 bg-black opacity-50 z-10 transition-opacity duration-700 ease-out ${
              !isVisible ? "opacity-0" : ""
            }`}
          />
        )}

        {/* Start Button with Fade-Out Effect */}
        {isVisible && (
          <img
            src={startbtn}
            alt="startbtn"
            onClick={handleClick}
            className={`absolute w-20 h-20 object-cover z-20 cursor-pointer transition-opacity duration-700 ease-out ${
              !isVisible ? "opacity-0" : ""
            }`}
          />
        )}
      </div>
    </div>
    </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
