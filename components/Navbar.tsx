'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { NFTContext } from '../context/NFTContext';

import images from '../assets';
import { Button } from './';

interface MenuItemsProps {
    isMobile?: boolean;
    active: string;
    setActive: (item: string) => void;
    setIsOpen?: (isOpen: boolean) => void; // Add this line
}

const MenuItems = ({ isMobile, active, setActive, setIsOpen }: MenuItemsProps) => {
    const generateLink = (i: number): string => {
        switch (i) {
            case 0: return '/';
            case 1: return '/listed-nfts';
            case 2: return '/my-nfts';
            default: return '/';
        }
    };

    return (
        <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
            {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, i) => (
                <li 
                    key={i}
                    onClick={() => {
                        setActive(item);
                        if(isMobile && setIsOpen) setIsOpen(false); // Check if setIsOpen exists
                    }}
                    className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 
                        ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
                >
                    <Link href={generateLink(i)}>{item}</Link>
                </li>   
            ))}
        </ul>
    );
};

interface ButtonGroupProps {
    setActive: (item: string) => void;
    setIsOpen?: (isOpen: boolean) => void;
    router: ReturnType<typeof useRouter>;
}

const ButtonGroup = ({ setActive, router, setIsOpen }: ButtonGroupProps) => {
    const { connectWallet, currentAccount } = useContext(NFTContext);

    return currentAccount ? (
        <Button 
            btnName='Create' 
            classStyles='mx-2 rounded-xl'
            handleClick={() => {
                setActive('');
                if(setIsOpen) setIsOpen(false);
                router.push('/create-nft');
            }}
        />
    ) : (
        <Button 
            btnName='Connect' 
            classStyles='mx-2 rounded-xl'
            handleClick={connectWallet}
        />
    );
};

const checkActive = (active: string, setActive: (item: string) => void, pathname: string) => {
    switch (pathname) {
        case '/':
            if (active !== 'Explore NFTs') setActive('Explore NFTs');
            break;
        case '/listed-nfts':
            if (active !== 'Listed NFTs') setActive('Listed NFTs');
            break;
        case '/my-nfts':
            if (active !== 'My NFTs') setActive('My NFTs');
            break;
        case '/create-nft':
            setActive('');
            break;
        default:
            setActive('');
            break;
    }
};

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname(); 
    const [active, setActive] = useState('Explore NFTs');
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        checkActive(active, setActive, pathname);
    }, [pathname]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderThemeChanger = () => {
        if (!mounted) return null;

        return (
            <div className='flex items-center mr-2'>
                <input
                    className='checkbox'
                    type='checkbox'
                    id='checkbox'
                    onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    checked={theme === 'light'}
                />
                <label htmlFor='checkbox' className='flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label'>
                    <i className='fas fa-sun' />
                    <i className='fas fa-moon' />
                    <div className='w-3 h-3 absolute bg-white rounded-full ball'/>
                </label>
            </div>
        );
    };

    return (
        <nav className='flexBetween w-full fixed z-20 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1'>
            <div className='flex flex-1 flex-row justify-start'>
                <Link href='/'>
                    <div className='flexCenter md:hidden cursor-pointer' onClick={() => {
                        setActive('Explore NFTs');
                    }}>
                        <Image src={images.logo02} style={{ objectFit: 'contain' }} alt='logo' width={32} height={32} />
                        <p className='dark:text-white text-nft-black-1 font-semibold text-lg ml-1'>CryptoKet</p>
                    </div>
                </Link>
                <Link href='/'>
                    <div className='hidden md:flex' onClick={() => {
                        setActive('Explore NFTs');
                        setIsOpen(false);
                    }}>
                        <Image src={images.logo02} style={{ objectFit: 'contain' }} alt='logo' width={32} height={32} />
                    </div>
                </Link>
            </div>

            <div className='flex flex-intial flex-row justify-end'>
                {renderThemeChanger()}
                <div className='md:hidden flex'>
                    <MenuItems active={active} setActive={setActive} />
                    <div className='ml-4'>
                        <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
                    </div>
                </div>
            </div>

            <div className='hidden md:flex ml-2'>
                {isOpen ? (
                    <Image 
                        src={images.cross}
                        style={{ objectFit: 'contain' }}
                        width={20}
                        height={20}
                        alt='close'
                        onClick={() => setIsOpen(false)}
                        className={mounted && theme === 'light' ? 'filter invert' : ''}
                    />
                ) : (
                    <Image 
                        src={images.menu} 
                        style={{ objectFit: 'contain' }}
                        width={25}
                        height={25}
                        alt='menu'
                        onClick={() => setIsOpen(true)}
                        className={mounted && theme === 'light' ? 'filter invert' : ''}
                    />
                )}

                {isOpen && (
                    <div className='fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col'>
                        <div className='flex-1 p-4'>
                            <MenuItems active={active} setActive={setActive} isMobile={true} setIsOpen={setIsOpen} />
                        </div>
                        <div className='p-4 border-t dark:border-nft-black-1 border-nft-gray-1'>
                            <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;