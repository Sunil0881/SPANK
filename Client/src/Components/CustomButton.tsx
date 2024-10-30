import '@rainbow-me/rainbowkit/styles.css';
import walletlogo from "../assets/walletbtn.png";
import disconnectbtn from "../assets/disconnectwlt.png";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const CustomButton = () => {
  const { isConnected } = useAccount(); // Check if the wallet is connected

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              // If wallet is not connected, show the connect button
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="w-20 h-28">
                    <img
                      src={walletlogo}
                      alt="connect"
                      className="absolute w-12 h-20 object-cover z-20 cursor-pointer bottom-6 transition-opacity duration-700 ease-out"
                      style={{ top: '76px', right: '55px' }}
                    />
                  </button>
                );
              }

              // If chain is unsupported, show the chain error message
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              // If wallet is connected, show the chain and disconnect buttons
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    <img
                      src={disconnectbtn}
                      alt="disconnect"
                      className="absolute w-12 h-20 object-cover z-20 cursor-pointer bottom-6 transition-opacity duration-700 ease-out left-48"
                      style={{ top: '29px', left: '5px' }}
                    />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomButton;
