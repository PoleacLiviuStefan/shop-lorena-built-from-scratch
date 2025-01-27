import React from 'react'

type ButtonProps = {
    children: React.ReactNode;
    bg?: string;
    bgHover?: string;
    color?: string;
    colorHover?: string;
  };

const Button: React.FC<ButtonProps> = ({ children, bg, bgHover, color, colorHover }) => {
    return (
        <button className={`bg-${bg ? bg :"black"} text-${color ? color : "white"} transition ease-in-out duration-300 hover:bg-${bgHover ? bgHover : "bg-gray-500"} hover:text-${colorHover ? colorHover : "white"} `}>{children}</button>
    )
}

export default Button;