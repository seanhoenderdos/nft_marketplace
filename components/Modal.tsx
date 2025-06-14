'use client';

import { useRef, MouseEvent } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';

interface ModalProps {
  header: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
  handleClose: () => void;
}

const Modal = ({ header, body, footer, handleClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null); // Specify the type of the ref
  const { theme } = useTheme();

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <div
      className='flexCenter fixed inset-0 z-10 bg-overlay-black animated fadeIn'
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className='w-2/5 md:w-11/12 minlg:w-2/4 dark:bg-nft-dark bg-white flex flex-col rounded-lg'
      >
        <div className='flex justify-end mt-4 mr-4 minlg:mt-6 minlg:mr-6'>
          <div
            className='relative w-3 h-3 minlg:w-6 minlg:h-6 cursor-pointer'
            onClick={handleClose}
          >
            <Image
              src={images.cross as StaticImageData} // Cast to StaticImageData
              alt='Close modal' // Add alt attribute
              layout='fill'
              className={theme === 'light' ? 'filter invert' : ''}
            />
          </div>
        </div>

        <div className='flexCenter w-full text-center p-4'>
          <h2 className='font-poppins dark:text-white text-nft-black-1 font-normal text-2xl'>
            {header}
          </h2>
        </div>
        <div className='dark:text-white text-nft-black-1 p-10 sm:px-4 border-t border-b dark:border-nft-black-3 border-nft-gray-1'>
          {body}
        </div>
        <div className='flexCenter p-4 dark:text-white text-nft-black-1'>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;