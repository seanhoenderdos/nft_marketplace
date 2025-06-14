import React from 'react';

interface ButtonProps {
  classStyles: string;
  btnName: string;
  handleClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ classStyles, btnName, handleClick }) => {
  return (
    <button
      type='button'
      className={`nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}
      onClick={handleClick}
    >
      {btnName}
    </button>
  );
};

export default Button;