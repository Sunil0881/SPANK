import { useState, useEffect, useRef } from "react";
import GirlFull from "../src/assets/GirlFull.png";
import ZoomGirl from "../src/assets/ZoomGirl.png";
import startbtn from "../src/assets/startbtn.png";
import ActionImage from "../src/assets/Spank.png";
import PlusoneImage from "../src/assets/One.png";
import RedImage from "../src/assets/Red.png"
import RedhandImage from "../src/assets/redhand.png"; // Import the level-up image
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import "./App.css";


function App() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showSpankImage, setShowSpankImage] = useState(false);
  const [showPlusoneImage, setShowPlusoneImage] = useState(false);
  const [showRedhandImage, setShowRedhandImage] = useState(false); // New state for level-up image
  const [showRedImage, setShowRedImage] = useState(false);
  const [lastActionCoordinates, setLastActionCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [newImagePosition, setNewImagePosition] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const levelRequirements = [2, 5, 10, 15];

  const { isConnected } = useAccount();

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  const handleClick = () => {
    if (isWalletConnected && imageRef.current) {
      setIsVisible(false);
    } else {
      setMessage("Please connect your wallet");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1000);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCoordinates({ x, y });
      checkActionArea(x, y);
    }
  };

  const checkActionArea = (x: number, y: number) => {
    const actionAreas = [{ id: "area1", x: 185, y: 271, width: 130, height: 80 }];
    actionAreas.forEach(area => {
      if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
        handleAction(area.id, x, y);
      }
    });
  };

  useEffect(() => {
    if (level - 1 < levelRequirements.length && score >= levelRequirements[level - 1]) {
      setLevel(prevLevel => {
        const nextLevel = prevLevel + 1;
        displayRedhandImage(); // Show level-up image after leveling up
        return nextLevel;
      });
    }
  }, [score]);

  const displayActionImage = () => {
    setShowSpankImage(true);
    setShowPlusoneImage(true);
    setShowRedImage(true);
    setTimeout(() => {
      setShowSpankImage(false);
      setShowPlusoneImage(false);
    }, 600);
  };

  const displayRedhandImage = () => {
    setTimeout(() => {
      setShowRedhandImage(true); // Show level-up image after action image
      setTimeout(() => setShowRedhandImage(false), 1000); // Hide after 1 second
    }, 600); // Delay to show level-up image after action image
  };

  const handleAction = (areaId: string, x: number, y: number) => {
    if (areaId === "area1") {
      setLastActionCoordinates({ x, y });
      displayActionImage();
      setNewImagePosition({ x: 250, y: 300 });
      setScore(prevScore => prevScore + 1);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => setIsFirstImage(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className="relative flex items-center justify-center h-screen bg-black">
      <div className="relative w-[1000px] h-[1000px] flex items-center justify-center">
        <img
          ref={imageRef}
          src={isFirstImage ? GirlFull : ZoomGirl}
          alt="MainImage"
          onClick={isFirstImage ? handleImageClick : handleImageClick}
          className={`${isFirstImage ? "object-cover w-full h-full" : "object-contain"}`}
          style={isFirstImage ? {} : { width: "515px", height: "515px" }}
        />
        {isVisible && (
          <div className="absolute inset-0 bg-black opacity-50 z-10 transition-opacity duration-700 ease-out" />
        )}
        {isVisible && (
          <img
            src={startbtn}
            alt="startbtn"
            onClick={handleClick}
            className="absolute w-20 h-20 object-cover z-20 cursor-pointer transition-opacity duration-700 ease-out"
          />
        )}
        {isFirstImage && (
          <div className="absolute bottom-7 z-20">
            <ConnectButton />
          </div>
        )}
        {showSpankImage && lastActionCoordinates && (
          <img
            src={ActionImage}
            alt="Action"
            className="absolute action-image"
            style={{ left: '235px', top: '260px', width: '90px', height: '90px' }}
          />
        )}
        {showPlusoneImage && newImagePosition && (
          <img
            src={PlusoneImage}
            alt="New Action"
            className="new-action-image"
            style={{ left: '123px', top: '168px', width: '30px', height: '80px' }}
          />
        )}
         {showRedImage && (
          <img
            src={RedImage}
            alt="red "
            className="absolute "
            style={{ left: '235px', top: '260px', width: '90px', height: '90px' }}
          />
        )}
        {showRedhandImage && (
          <img
            src={RedhandImage}
            alt="Level Up"
            className="absolute fade-in-levelup level-up-animation slowFadeInOut"
            style={{ left: '235px', top: '260px', width: '90px', height: '90px' }}
          />
        )}
        {!isFirstImage && (
          <div className="absolute text-black text-3xl z-20 fade-in" style={{ top: "148px", right: "35px" }}>
            {score}
          </div>
        )}
        {!isFirstImage && (
          <div className="absolute text-black text-2xl z-20 font-bold fade-in" style={{ top: "160px", left: "60px" }}>
            {level}
          </div>
        )}
        {showMessage && (
          <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 bg-white text-black p-1 rounded shadow-md z-20">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
