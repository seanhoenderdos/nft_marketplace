'use client';

import { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '@/context/NFTContext';

import { Button, Input, Loader } from '@/components';
import images from '@/assets';

const CreateNft = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const { uploadToIPFS, createNFT, isLoadingNFT } = useContext(NFTContext);
  const router = useRouter();

  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });

  const onDrop = useCallback(async (acceptedFile: File[]) => {
    if (acceptedFile.length === 0) {
      alert('No file selected or file type not supported.');
      return;
    }

    try {
      // Call the uploadToIPFS function from the context
      const url = await uploadToIPFS(acceptedFile[0]);
      // console.log('File uploaded to:', url);

      // Update the fileUrl state with the returned URL
      setFileUrl(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}`
  ), [isDragActive, isDragAccept, isDragReject]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoadingNFT) {
    return (
      <div className='flexStart min-h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-3/5 md:w-full'>
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Create new NFT</h1>

        <div className='mt-16'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>Upload File</p>

          <div className='mt-4'>
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className='flexCenter flex-col text-center'>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>JPG, PNG, GIF, SVG, WEBM. Max 100mb.</p>

                <div className='my-12 w-full flex justify-center'>
                  <Image 
                    src={images.upload}
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain' }}
                    alt='file upload'
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>

                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm'>Drag & Drop File</p>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2'>or Browse media on your device</p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>

        <Input 
          inputType='input'
          title='Name'
          placeholder='NFT Name'
          handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <Input 
          inputType='textarea'
          title='Description'
          placeholder='NFT Description'
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input 
          inputType='number'
          title='Price'
          placeholder='NFT Price'
          handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
        />

        <div className='mt-7 w-full flex justify-end'>
          <Button 
            btnName="Create NFT"
            classStyles='rounded-xl'
            handleClick={() => createNFT(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNft;