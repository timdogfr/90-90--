import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';

const contractAddress = "0xbB262edd3093483Cd8D141D7388847832ed87376";
const abi = contract.abi;

function App () {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [result, setResult] = useState(null);

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
      setResult("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      setResult("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setResult("Found an account! Address: ", accounts[0]);
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
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        setResult("Initialize payment");
        let nftTxn = await nftContract.mint(currentAccount);

        setResult("Mining... please wait");
        await nftTxn.wait();

        setResult(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        setResult("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err)
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

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Sampras NFT</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <div style={{ paddingTop: 20 }}>
        <a href="https://testnets.opensea.io/collection/sampras-nft-v2">Opensea Collection</a>
      </div>

      <div style={{ paddingTop: 20 }}>{result}</div>
    </div>
  )
}

export default App;
