'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useTheme } from 'next-themes';

import images from '../assets';
import { Button } from './';

interface FooterLinksProps {
  heading: string;
  items: string[];
}

const FooterLinks = ({ heading, items }: FooterLinksProps) => (
  <div className='flex-1 justify-start items-start'>
    <h3 className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-10'>{heading}</h3>
    {items.map((item: string, index: number) => (
      <p key={index} className='font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:txt-nft-gray-1 hover:text-nft-black-1 my-3'>{item}</p>
    ))}
  </div>
);

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
        <div className='flexStart flex-1 flex-col'>
          <div className='flexCenter cursor-pointer'>
            <Image src={images.logo02} style={{ objectFit: 'contain' }} alt='logo' width={32} height={32} />
            <p className='dark:text-white text-nft-black-1 font-semibold text-lg ml-1'>CryptoKet</p>
          </div>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6'>Get the latest updates</p>
          <div className='flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md'>
            <input type='email' placeholder='Your Email' className='h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none'/>
            <div className='flex-intial'>
              <Button btnName='Email me' classStyles='rounded-md' handleClick={() => {}} />
            </div>
          </div> 
        </div> 

        <div className='flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8'>
          <FooterLinks heading='CryptoKet' items={['Explore', 'How it works', 'Contact us']} />
          <FooterLinks heading='Support' items={['Help center', 'Terms of service', 'Legal', 'Privacy policy']} />
        </div>
      </div>
      
      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">Cryptoket, Inc. All Rights Reserved.</p>
          
          <div className='flex sm:mt-4'>
            {[images.instagram, images.twitter, images.telegram, images.discord].map((image, index: number) => (
              <div className="mx-2 cursor-pointer" key={index}>
                <Image
                  src={image}
                  style={{ objectFit: 'contain' }}
                  width={24}
                  height={24}
                  alt="social"
                  className={mounted && theme === 'light' ? 'filter invert' : ''}
                />
              </div>
            ))} 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;