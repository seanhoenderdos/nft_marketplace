'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Banner, CreatorCard, NFTCard } from "../components";
import { useTheme } from 'next-themes';

import images from '../assets';
import { makeId } from '../utils/makeid';
import Image from 'next/image';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null); // Add type annotation
  const scrollRef = useRef<HTMLDivElement>(null); // Add type annotation

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (!current) return; // Add null check

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount; // Scroll left
    } else {
      current.scrollLeft += scrollAmount; // Scroll right
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current && parent) {
      if (current.scrollWidth >= parent.offsetWidth) {
        setHideButtons(false);
      } else {
        setHideButtons(true);
      }
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  }); // Add empty dependency array

  return (
    <main>
      <div className="flex flex-col justify-center sm:px-4 p-12">
        <div className="w-full minmd:w-4/5">
          <Banner 
            name='Discover, collect, and sell extraordinary NFTs'
            childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left' 
            parentStyles="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          />

          <div>
            <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Best Creators</h1>
            <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
              <div className='flex dark:text-white flex-row w-max overflow-x-scroll no-scrollbar select-none' ref={scrollRef}>
                {[6, 7, 8, 9, 10].map((i) => (
                  <CreatorCard 
                    key={`creator-${i}`}
                    rank={i}
                    creatorImage={images[`creator${i}` as keyof typeof images]}
                    creatorName={`0x${makeId(3)}...${makeId(4)}`}
                    creatorEths={10 - i * 0.5}
                  />
                ))}
                {!hideButtons && (
                  <>
                    <div onClick={() => handleScroll('left')} className='absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0'>
                      <Image 
                        src={images.left}
                        layout='fill'
                        style={{ objectFit: 'contain' }}
                        alt='left_arrow'
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                    <div onClick={() => handleScroll('right')} className='absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0'>
                      <Image 
                        src={images.right}
                        layout='fill'
                        style={{ objectFit: 'contain' }}
                        alt='right_arrow'
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start'>
            <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Bids</h1>
            <div className='dark:text-white text-nft-black-1'>SearchBar</div>
          </div>
          <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard 
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.534).toFixed(2),
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: 'Cool NFT on Sale',
                }}
              /> 
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
