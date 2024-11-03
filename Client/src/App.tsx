import { useState, useEffect, useRef } from "react";
import ButtonPage from "../src/assets/ButtonPage.png";
import ZoomGirl from "../src/assets/ZoomGirl.png";
import playbtn from "../src/assets/playbtn.png";
import ActionImage from "../src/assets/Spank.png";
import PlusoneImage from "../src/assets/One.png";
import RedImage from "../src/assets/Red.png"
import loadingImage from "../src/assets/splashscreen.png"; 
import Refbtn from "../src/assets/refbtn.png";
import RedhandImage from "../src/assets/redhand.png"; 
import walletlogo from "../src/assets/walletbtn.png";
import disconnectwlt from "../src/assets/disconnectwlt.png";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomButton from "./Components/CustomButton";
import { useAccount } from 'wagmi';
import {dev, local} from "./Constant";
import { ethers } from "ethers";
import "./App.css";


function App() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isFirstImage, setIsFirstImage] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showSpankImage, setShowSpankImage] = useState(false);
   const [urlparms, setUrlparms] = useState("");
  const [showPlusoneImage, setShowPlusoneImage] = useState(false);
  const [showRedhandImage, setShowRedhandImage] = useState(false); 
  const [showRedImage, setShowRedImage] = useState(false);
  const [lastActionCoordinates, setLastActionCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [newImagePosition, setNewImagePosition] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [code, setCode] = useState(null);
  const [level, setLevel] = useState(1);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined);
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(true); 
  const [progress, setProgress] = useState(0); 
  
  const levelRequirements = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000];

    const { isConnected } = useAccount();  
    const account = useAccount();
    const fetchedaddress = account.address;

  useEffect(() => {
    const duration = 3000; 
    const interval = 100; 
    const increment = 100 / (duration / interval); 
  
    const loadingTimeout = setInterval(() => {
      setProgress((prev) => (prev + increment >= 100 ? 100 : prev + increment));
    }, interval);
  
    
    const finishLoading = setTimeout(() => {
      setLoading(false);
      setProgress(100); 
    }, duration);
  
    return () => {
      clearTimeout(finishLoading);
      clearInterval(loadingTimeout);
    };
  }, []);
  
//   const checkIfWalletIsConnected = async () => {
//     if (window.ethereum) {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const accounts = await provider.listAccounts();
//             const signer = provider.getSigner();

//             console.log("Signer:", signer);

//             // If there are any accounts, set the wallet as connected
//             if (accounts.length > 0) {
//                 const connectedAccount = accounts[0];
//                 setAddress(connectedAccount);
               
//                 setIsWalletConnected(true);

//                 console.log("Connected Account:", connectedAccount);
//                 console.log("Wallet is connected:", true);
//             } else {
              
//                 setIsWalletConnected(false);

//                 console.log("No account connected.");
//                 console.log("Wallet is connected:", false);
//             }
//         } catch (error) {
//             console.error("Error checking wallet connection:", error);
//         }
//     } else {
//         console.log("MetaMask is not installed");
//     }
// };


// const connectWallet = async () => {
//   if (window.ethereum) {
//       try {
//           const provider = new ethers.providers.Web3Provider(window.ethereum);
//           const accounts = await provider.send("eth_requestAccounts", []);
//           const signer = provider.getSigner();
//           console.log("signer",signer);
//           if (accounts.length > 0) {
//             setAddress(accounts[0]);
//             console.log(accounts[0]);
             
//               setIsWalletConnected(true);
//           }
//       } catch (error) {
//           console.error('Error connecting to wallet:', error);
//       }
//   } else {
//       alert('Please install MetaMask to use this feature.');
//   }
// };
 

// const disconnectWallet = () => {
//   setAddress(null); // Clear the address state
//   setIsConnected(false); // Update connection state
//   setIsWalletConnected(false); // Update wallet connection state
//   console.log("Wallet disconnected");
// };


useEffect(() => {
   
  if (isConnected) {
    setIsWalletConnected(true);
    setAddress(fetchedaddress);
  } else {
    setIsWalletConnected(false);
    setAddress(undefined);
    setShowRef(false);
  }

}, [isConnected]);

//   useEffect(() => {
//     checkIfWalletIsConnected();
    
// }, []);


useEffect(() => {
  const currentUrl = window.location.href;
  const equalSignIndex = currentUrl.indexOf('=');

  if (equalSignIndex !== -1) {
    const valueAfterEqual = currentUrl.substring(equalSignIndex + 1);
    console.log("Value after '=':", valueAfterEqual);
    setUrlparms(valueAfterEqual); 
  } else {
    console.log("No '=' found in the URL.");
  }
}, []); 


useEffect(() => {
  console.log("Updated urlparms in useEffect:", urlparms);
}, [urlparms]);


useEffect(() => {
  const fetchUserData = async () => {
 
    if (isConnected && address ) { 
      try {
        console.log("Using referralCode:", urlparms);
        const referralCode = urlparms;

        const response = await fetch(`${dev}/api/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, referralCode }), 
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        setUserData(data);
        setScore(data.score ?? 0); 
        setLevel(data.level ?? 1); 
        setCode(data.referralCode ?? 'varala da'); 
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  fetchUserData();
}, [isConnected, address, urlparms]); 


  
  useEffect(() => {
    let intervalId:any;

    if (isConnected && address) {
      intervalId = setInterval(() => {
        updateUserData();
      }, 3000); 
    }

  
    return () => clearInterval(intervalId); 

  }, [isConnected, address, score, level]);

  useEffect(() => {
    if (score >= 15) {
        setShowRef(true);
        console.log("showRef=", true); // Logging after setting showRef
    }
}, [score]);


  const updateUserData = async () => {
    if (isConnected && address) {
      const data = { address, score, level };
      console.log('Updating Data to DB');
      try {
        const response = await fetch(`${dev}/api/user/update`, {
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
      console.log("coords",x,y);
      setCoordinates({ x, y });
      checkActionArea(x, y);
    }
  };

  const checkActionArea = (x: number, y: number) => {
    const actionAreas = [{ id: "area1", x: 153, y: 322, width: 223, height: 105 }];
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
        displayRedhandImage(); 
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
      setShowRedhandImage(true); 
      setTimeout(() => setShowRedhandImage(false), 1000); 
    }, 600); 
  };

  const handleAction = (areaId: string, x: number, y: number) => {
    if (areaId === "area1") {
      setLastActionCoordinates({ x, y });
      displayActionImage();
      setNewImagePosition({ x: 250, y: 300 });
      setScore(prevScore => prevScore + 1);
      if (score >= 15) {
        setShowRef(true);
        console.log("showref=",showRef);
    }
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
  if (progressElement) { 
    if (width < 100) {
      width += 25;
      progressElement.style.width = width + '%';
      requestAnimationFrame(animateProgress);
    }
  }
}

animateProgress();

const handleReferClick = async () => {
  try {
    
    const referralUrl = `https://x.com/Sunil_0881/status/1850935854539383234?referral=${code}`;
                       
    
    
    shareReferralLink(referralUrl);
    
  } catch (error) {
    console.error('Error fetching referral code:', error);
  }
};

const shareReferralLink = (shareLink) => {
  
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareLink)}`;

  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`;


  if (navigator.share) {
    navigator.share({
      title: 'Check out this referral link!',
      url: shareLink,
    }).then(() => {
      console.log('Referral link shared successfully');
    }).catch((error) => {
      console.error('Error sharing:', error);
      
      window.open(whatsappUrl, '_blank');
    });
  } else {
    
    const userChoice = window.confirm('Share on WhatsApp? Click OK to share on WhatsApp, Cancel to open in a new tab.');
    if (userChoice) {
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(facebookUrl, '_blank'); 
    }
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
              style={{ width: "514px", height: "515px" }}
              className="absolute"
            />
                    <div className="loader-container">
          <div className="loading-bar absolute mt-60">
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
          style={isFirstImage ? {width: "514px", height: "515px"} : { width: "515px", height: "515px" }}
        />
       
        {isVisible && (
          <img
            src={playbtn}
            loading="lazy"
            alt="playbtn"
            onClick={handleClick}
            className="absolute w-16 h-24 object-cover z-20 cursor-pointer  transition-opacity duration-700 ease-out "
            style={{ right: "190px", bottom:"119px" }}
          />
        )}
        {isFirstImage && (
          <div className="absolute">
            {/* <ConnectButton /> */}
              <CustomButton /> 
           {/* {!isWalletConnected ? (
                <button onClick={connectWallet} type="button" className="">
                  <img src={walletlogo} alt="playbtn"
                    className="absolute w-12 h-20 object-cover z-36 cursor-pointer  transition-opacity duration-700 ease-out  left-48"
                    style={{  top: '142px', width: '', height: '' }} />
                </button>
            ) : (
              <div>
             
              <button onClick={disconnectWallet}  className=""> 
              <img src={disconnectwlt} alt="playbtn"
                    className="absolute w-12 h-20 object-cover z-36 cursor-pointer  transition-opacity duration-700 ease-out  left-48"
                    style={{  top: '142px', width: '', height: '' }} />
              </button>
          </div>
      )} */}
          </div>
        )}
        {showSpankImage && lastActionCoordinates && (
          <img
            src={ActionImage}
            loading="lazy"
            alt="Action"
            className="absolute action-image"
            style={{ left: '235px', top: '300px', width: '140px', height: '140px' }}
          />
        )}
       
          {showPlusoneImage && newImagePosition && (
            <img
              src={PlusoneImage}
              loading="lazy"
              alt="New Action"
              className={`new-action-image ${showPlusoneImage ? "show" : "hide"}`}
              style={{
                position: 'absolute', 
                left:"143px", 
                top: "40px", 
                width: '30px', 
                height: '80px', 
          }}
          />
          )}
         {showRedImage && (
          <img
            src={RedImage}
            loading="lazy"
            alt="red "
            className="absolute "
            style={{ left: '235px', top: '300px', width: '140px', height: '140px' }}
          />
        )}
        {showRedhandImage && (
         
          <img
            src={RedhandImage}
            loading="lazy"
            alt="Level Up"
            className="absolute w-fit fade-in-levelup level-up-animation slowFadeInOut "
            style={{ left: '235px', top: '300px', width: '140px', height: '140px' }}
          />
        
        )}
       {!isFirstImage && (
        <div 
          className="absolute text-3xl z-20 fade-in" 
          style={{ 
            top: "26px", 
            right: "35px", 
            background: "linear-gradient(to bottom, rgba(255, 75, 108, 100), rgba(255, 151, 114, 100))", 
            WebkitBackgroundClip: "text", 
            color: "transparent", 
            transition: "color 0.5s ease-in-out", 
          }}>
          {score}
        </div>
      )}

      {!isFirstImage && (
        <div 
          className="absolute text-2xl z-20 font-bold fade-in" 
          style={{ 
            top: "36px", 
            left: "73px", 
            background: "linear-gradient(to bottom,  rgba(255, 75, 108, 100), rgba(255, 151, 114, 10))", 
            WebkitBackgroundClip: "text", 
            color: "transparent", 
            transition: "color 0.5s ease-in-out", 
          }}>
          {level}
        </div>
      )}

        {showMessage && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-black p-1 rounded shadow-md z-20">
            {message}
          </div>
        )}
       {isFirstImage && showRef && (
            <button onClick={handleReferClick} className=" absolute  z-30 bottom-2 left-5">
               <img
            src={Refbtn}
            loading="lazy"
            alt="Ref btn"
             
             style={{  width: '65px', height: '65px' }}
          />
            </button> 
        )}
      </div>
    </div>
  );
}

export default App;
