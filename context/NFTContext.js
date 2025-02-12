'use client';

import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketAddressAbi } from './constants';

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const nftCurrency = 'ETH';

    // Pinata API credentials
    const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return alert('Please install MetaMask');

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log('No accounts found.');
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert('Please install MetaMask');

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        setCurrentAccount(accounts[0]);
        window.location.reload();
    };

    const uploadToIPFS = async (data) => {
        try {
            // If the data is a file, handle it as before
            if (data instanceof File) {
                const formData = new FormData();
                formData.append('file', data);

                const metadata = JSON.stringify({
                    name: data.name, // Use the file name
                    keyvalues: {
                        description: 'Uploaded via NFT Marketplace',
                    },
                });
                formData.append('pinataMetadata', metadata);

                const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY,
                    },
                });

                return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
            }

            // If the data is a JSON object, handle it as JSON
            else if (typeof data === 'object' && !(data instanceof File)) {
                const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
                    headers: {
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY,
                    },
                });

                return `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
            }

            // Handle other cases
            else {
                throw new Error('Unsupported data type for IPFS upload.');
            }
        } catch (error) {
            console.error('Error uploading to Pinata IPFS:', error);
            throw error;
        }
    };

    const createNFT = async (formInput, fileUrl, router) => {
        const { name, description, price } = formInput;

        if (!name || !description || !price || !fileUrl) return;

        // Create a metadata object (plain JavaScript object, not a string)
        const metadata = {
            name,
            description,
            image: fileUrl, // The URL of the uploaded file (e.g., image)
        };

        try {
            // Upload the metadata object to Pinata IPFS
            const metadataUrl = await uploadToIPFS(metadata);

            // Create a sale with the metadata URL
            await createSale(metadataUrl, price);

            // Redirect to the home page
            router.push('/');
        } catch (error) {
            console.error('Error uploading metadata to Pinata IPFS:', error);
            throw error;
        }
    };

    const createSale = async (url, formInputPrice, isReselling, id) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const price = ethers.utils.parseUnits(formInputPrice, 'ether');
        const contract = fetchContract(signer);
        const listingPrice = await contract.getListingPrice();

        const transaction = !isReselling
        ? await contract.createToken(url, price, { value: listingPrice.toString() })
        : await contract.resellToken(id, price, { value: listingPrice.toString() });

        await transaction.wait();
    };

    const fetchNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const data = await contract.fetchMarketItems();

        const items = await Promise.all(data.map( async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const { data: { image, name, description} } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI
            };
        }));

        return items;
    };

    const fetchMyNFTsOrListedNFTs = async (type) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);

        const data = type === 'fetchItemsListed'
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();

        const items = await Promise.all(data.map( async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const { data: { image, name, description} } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI
            };
        }));

        return items;
    };

    const buyNft = async (nft) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
        
        const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

        await transaction.wait();
    }

    return (
        <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNft, createSale }}>
            {children}
        </NFTContext.Provider>
    );
};