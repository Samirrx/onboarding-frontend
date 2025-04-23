import React, { ReactNode, useEffect, useState } from 'react';
import AuthPattern from '../../assets/auth/img-a2-grid.svg';
import AuthPatternDark from '../../assets/auth/img-a2-grid-dark.svg';

interface BackgroundPattern2Props {
  children: ReactNode;
}

const BackgroundPattern2: React.FC<BackgroundPattern2Props> = ({
  children
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Assumes Tailwind's dark mode class is applied
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const backgroundImage = isDarkMode
    ? `url(${AuthPatternDark})`
    : `url(${AuthPattern})`;
  const overlayColor = isDarkMode
    ? 'bg-black bg-opacity-85'
    : 'bg-[#f6f5f5] bg-opacity-85';

  return (
    <div
      className={`relative m-0 flex h-screen min-h-full items-center justify-center overflow-hidden bg-cover pt-44`}
      style={{
        backgroundColor: isDarkMode ? '#000' : '#fff',
        backgroundImage: backgroundImage,
        backgroundPosition: 'top 150px left',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 top-0 ${overlayColor} z-[1]`}
      />
      <div className="relative z-[5] w-full">{children}</div>
    </div>
  );
};

export default BackgroundPattern2;
