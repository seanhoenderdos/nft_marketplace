'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';

interface SearchBarProps {
  activeSelect: string;
  setActiveSelect: (value: string) => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ activeSelect, setActiveSelect, handleSearch, clearSearch }) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [toggle, setToggle] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      clearSearch();
    }
  }, [search, handleSearch, clearSearch]);

  return (
    <>
      <div className='flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 px-4 py-3 rounded-empty'>
        <Image 
          src={images.search}
          style={{ objectFit: 'contain' }}
          width={20}
          height={20}
          alt='search'
          className={theme === 'light' ? 'filter invert' : ''}
        />
        <input 
          type='text'
          placeholder='Search NFT here...'
          className='dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none'
          onChange={(e) => setDebouncedSearch(e.target.value)}
          value={debouncedSearch}
        />
      </div>

      <div 
        onClick={() => setToggle((prevToggle) => !prevToggle)}
        className='relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 py-3 px-4 rounded-empty'
      >
        <p className='font-poppins dark:text-white text-nft--black-1 font-normal text-xs'>{activeSelect}</p>
        <Image 
          src={images.arrow}
          style={{ objectFit: 'contain' }}
          width={15}
          height={15}
          alt='arrow'
          className={theme === 'light' ? 'filter invert' : ''}
        />
        {toggle && (
          <div className='absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-1 border-nft-gray-2 py-3 px-4 rounded-empty'>
            {['Recently Added', 'Price (Low to High)', 'Price (High to Low)'].map((item) => (
              <p 
                className='font-poppins dark:text-white text-nft--black-1 font-normal text-xs my-3 cursor-pointer'
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveSelect(item);
                  setToggle(false);
                }}
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
