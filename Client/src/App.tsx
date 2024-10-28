import { useState, useEffect, useRef } from "react";
import ButtonPage from "../src/assets/ButtonPage.png";
import ZoomGirl from "../src/assets/ZoomGirl.png";
import playbtn from "../src/assets/playbtn.png";
import ActionImage from "../src/assets/Spank.png";
import PlusoneImage from "../src/assets/One.png";
import RedImage from "../src/assets/Red.png"
import loadingImage from "../src/assets/splashscreen.png"; 
import RedhandImage from "../src/assets/redhand.png"; // Import the level-up image
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomButton from "./Components/CustomButton";
import { useAccount } from 'wagmi';
import {dev, local} from "./Constant";
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
  const [code, setCode] = useState(null);
  const [level, setLevel] = useState(1);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined);
  const [loading, setLoading] = useState(true); // Allows undefined or addresses of type 0x${string}
  const [progress, setProgress] = useState(0); 
  const levelRequirements = [5,10,100,200,300,400,500];

    const { isConnected } = useAccount();
    const account = useAccount();
    const fetchedaddress = account.address;

  useEffect(() => {
    const duration = 3000; // Total loading duration in milliseconds
    const interval = 100;  // Interval in milliseconds for progress update
    const increment = 100 / (duration / interval); // Progress increment per interval
  
    const loadingTimeout = setInterval(() => {
      setProgress((prev) => (prev + increment >= 100 ? 100 : prev + increment));
    }, interval);
  
    // Clear timeout after the total duration to stop loading
    const finishLoading = setTimeout(() => {
      setLoading(false);
      setProgress(100); // Ensure progress is exactly 100% at the end
    }, duration);
  
    return () => {
      clearTimeout(finishLoading);
      clearInterval(loadingTimeout);
    };
  }, []);
  

 
  useEffect(() => {
   
    if (isConnected) {
      setIsWalletConnected(true);
      setAddress(fetchedaddress);
    } else {
      setIsWalletConnected(false);
      setAddress(undefined);
    }
  }, [isConnected]);

  // Fetch user data when the wallet is connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(`${local}/api/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setUserData(data);
          setScore(data.score ?? 0); // Fallback to 0 if score is missing
          setLevel(data.level ?? 1);
          setCode(data.referralCode ?? 1); // Fallback to 1 if level is missing
          console.log(data);
        } catch (error: any) {
          setError(error.message);
        }
      }
    };

    fetchUserData();
  }, [isConnected, address]);

  // Update user data every 5 seconds if connected
  useEffect(() => {
    let intervalId:any;

    if (isConnected && address) {
      intervalId = setInterval(() => {
        updateUserData();
      }, 5000); // Run every 5 seconds
    }

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [isConnected, address, score, level]);

  // Update user data function
  const updateUserData = async () => {
    if (isConnected && address) {
      const data = { address, score, level };
      console.log('Updating Data to DB');
      try {
        const response = await fetch(`${local}/api/user/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update user data');
        }

        console.log('User data updated successfully');
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };


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
      setShowRedImage(false);
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

  let progressElement = document.querySelector('.progress') as HTMLElement | null;
let width = 0;

function animateProgress() {
  if (progressElement) { // Check if progressElement is not null
    if (width < 100) {
      width += 25; // Adjust speed if needed
      progressElement.style.width = width + '%';
      requestAnimationFrame(animateProgress);
    }
  }
}

animateProgress();


const handleReferClick = async () => {
  try {
      const response = await fetch('/api/getReferralCode');
      const data = await response.json();
      if (data.referralCode) {
          // Generate the shareable link with referral code
          const referralUrl = `https://x.com/Sunil_0881/status/1850892353780748624?referral=${data.referralCode}`;
          setShareLink(referralUrl);

          // Optionally, copy the link to clipboard or open it in a new tab
          navigator.clipboard.writeText(referralUrl);
          alert('Referral link copied to clipboard!');
      }
  } catch (error) {
      console.error('Error fetching referral code:', error);
  }
};
  
 

  return (
    <div className="relative flex items-center justify-center h-screen bg-black ">
    
      <div className="relative w-[1000px] h-[1000px] flex items-center justify-center">
      {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-50">
            <img
              src={loadingImage}
              loading="lazy"
              alt="Loading"
              style={{ width: "514px", height: "250px" }}
              className="absolute"
            />
                    <div className="loader-container">
          <div className="loading-bar absolute mt-44">
            <div className="progress"></div>
          </div>
          <div className="loading-text ">LOADING...</div>
        </div>

          </div>
        )}

        <img
          ref={imageRef}
          src={isFirstImage ? ButtonPage : ZoomGirl}
          loading="lazy"
          alt="MainImage"
          onClick={isFirstImage ? handleImageClick : handleImageClick}
          className={`${isFirstImage ? "object-cover w-full h-full" : "object-contain"}`}
          style={isFirstImage ? {width: "514px", height: "250px"} : { width: "515px", height: "515px" }}
        />
       
        {isVisible && (
          <img
            src={playbtn}
            loading="lazy"
            alt="playbtn"
            onClick={handleClick}
            className="absolute w-12 h-20 object-cover z-20 cursor-pointer bottom-7 transition-opacity duration-700 ease-out right-48"
          />
        )}
        {isFirstImage && (
          <div className="absolute top-2 z-20">
            {/* <ConnectButton /> */}
            <CustomButton />
          </div>
        )}
        {showSpankImage && lastActionCoordinates && (
          <img
            src={ActionImage}
            loading="lazy"
            alt="Action"
            className="absolute action-image"
            style={{ left: '235px', top: '260px', width: '90px', height: '90px' }}
          />
        )}
       
       {showPlusoneImage && newImagePosition && (
  <img
    src={PlusoneImage}
    loading="lazy"
    alt="New Action"
    className={`new-action-image ${showPlusoneImage ? "show" : "hide"}`}
    style={{
      position: 'absolute', // Ensure the image is positioned absolutely
      left:"123px", // Use x coordinate from newImagePosition
      top: "168px", // Use y coordinate from newImagePosition
      width: '30px', // Set desired width
      height: '80px', // Set desired height
    }}
  />
)}
         {showRedImage && (
          <img
            src={RedImage}
            loading="lazy"
            alt="red "
            className="absolute "
            style={{ left: '235px', top: '260px', width: '90px', height: '90px' }}
          />
        )}
        {showRedhandImage && (
         
          <img
            src={RedhandImage}
            loading="lazy"
            alt="Level Up"
            className="absolute w-fit fade-in-levelup level-up-animation slowFadeInOut "
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

        <button onClick={handleReferClick} className="refer-button">
            Refer
        </button>

      </div>
    </div>
  );
}

export default App;
