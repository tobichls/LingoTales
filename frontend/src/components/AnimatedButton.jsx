import React, { useState, useEffect } from 'react';



const AnimatedButton = ({ option, timeoutFunction, handleButtonClick, id, initialColor, finalColor }) => {
//   const [isHovering, setIsHovering] = useState(true); // Initial hover state
//   const [timeoutId, setTimeoutId] = useState(null);

    var hovering = false
    var timeout_id = null

//   // Clear timeout on unmount
//   useEffect(() => {
//     () => clearTimeout(timeout_id); 
//   }, [timeout_id]);

  const handleMouseEnter = () => {
    if (!hovering) {  
      hovering = true 
    }
    timeout_id = setTimeout(timeoutFunction, 3000); 
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId); 
    if (hovering) { 
        hovering = false
    }
  };

  return (
    <button
      className={`custom-animated-button hover-color-shift`} 
      style={{ backgroundColor: initialColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={id}
      onClick={handleButtonClick}
    >
      {option}
    </button>
  );
}

export default AnimatedButton;