'use client';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '@/context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar } from '@/components'; 

import images from '@/assets';
import { shortenAddress } from '@/utils/shortenAddress';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsCopy, setNftsCopy] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  interface NFT {
    tokenId: number;
    name: string;
    price: number;
    seller: string;
    owner: string;
    description: string;
  }

  useEffect(() => {
    setIsLoading(true);
    fetchMyNFTsOrListedNFTs()
      .then((items: NFT[]) => {
        setNfts(items);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, [fetchMyNFTsOrListedNFTs]);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (Low to High)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (High to Low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently Added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        break;
    }
  }, [activeSelect]);

  if (isLoading) {
    return (
      <div className='flexStart min-h-screen'>
        <Loader />
      </div>
    );
  }

  const onHandleSearch = (value: string) => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className='w-full flex justify-start items-center flex-col min-h-screen'>
      <div className='w-full flexCenter flex-col'>
        <Banner
          name='Your Nifty NFTs'
          childStyles='text-center mb-4'
          parentStyles='h-80 justify-center'
        />

        <div className='flexCenter flex-col -mt-20 z-0'>
          <div className='flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full'>
            <Image 
              src={images.creator1}
              className='rounded-full object-cover'
              style={{ objectFit: 'cover' }}
              alt='profile'
            />
          </div>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6'>
            {shortenAddress(currentAccount)}
          </p>
        </div>
      </div>

      {!isLoading && !nfts.length && !nftsCopy.length ? (
        <div className='flexCenter sm:p-4 p-16'>
          <h1 className='font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl'>
            No NFTs Owned
          </h1>
        </div>
      ) : (
        <div className='sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col'>
          <div className='flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8'>
            <SearchBar 
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
          </div>
          <div className='mt-3 w-full flex flex-wrap'>
            {nfts.map((nft) => 
              <NFTCard 
                key={nft.tokenId}
                nft={nft}
                onProfilePage
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
