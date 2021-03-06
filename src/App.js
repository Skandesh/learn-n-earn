import { useEffect, useState } from 'react';
import './App.css';
import testingBot from './contracts/TESTINGBOT.json';
import tokenNFTContract from './contracts/tokenToNft.json';
import { ethers } from 'ethers';

const nft_contractAddress = "0xc50eb2879552DACCbee1357c93e16cdA4E80E76C";//"0xd72683f758ca602736ed1f6a6c7d0c1318394ade";//"0x355638a4eCcb777794257f22f50c289d4189F245";
const nft_abi = tokenNFTContract.abi;
const testing_bot_abi = testingBot.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nft_contractAddress, nft_abi, signer);

        console.log("Initialize payment by signer" );
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
        console.log(account);
        //let nftTxn = await nftContract.mintNFT(1, { value: ethers.utils.parseEther("0.01") });
        let nftTxn = await nftContract.safeMint();//account, 1);
        console.log("sending the value of the ether... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }
    }
    } catch (err) {
      console.log(err);
    }
  }

  
  const listAccountDetailsHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nft_contractAddress, nft_abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.safeMint(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  
  const listAccountDetailsButton = () => {
    return (
      <button onClick={listAccountDetailsHandler} className='cta-button mint-nft-button'>
        List Account Details
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Learn & Earn - with Karma credits!</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <div>
        {currentAccount ? listAccountDetailsButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
