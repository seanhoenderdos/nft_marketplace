import React from 'react';

interface BannerProps {
    name: string;
    childStyles: string;
    parentStyles:string;    
  }

const Banner = ({ name, childStyles, parentStyles }: BannerProps) => {
  return (
    <div className={`relative w-full flex items-center x-0 overflow-hidden nft-gradient ${parentStyles}`}>
        <p className={`dark:text-white text-nft-black-1 font-bold text-5xl font-poppins leading-70 ${childStyles} z-10`}>{name}</p>
        <div className='absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16'/>
        <div className='absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-14'/>
    </div>
  )
};

export default Banner;