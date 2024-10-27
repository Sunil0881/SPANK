import { useState, useEffect } from "react";
import GirlFull from "../src/assets/GirlFull.png";
import ZoomGirl from "../src/assets/ZoomGirl.png"; // Import the new image
import startbtn from "../src/assets/startbtn.png";
import Beach from "../src/assets/beach.png";

function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFirstImage, setIsFirstImage] = useState(true); // Track the main image

  const handleClick = () => {
    setIsVisible(false); // Start fade-out animation for overlay and button
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
    <div className="relative flex items-center justify-center h-screen bg-black">
      <div className="relative w-[1000px] h-[1000px] flex items-center justify-center">
        {/* Main Image that changes after the overlay disappears */}
        <img
  src={isFirstImage ? GirlFull : ZoomGirl}
  alt="MainImage"
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
  );
}

export default App;
