import React from 'react';
import styled from 'styled-components';

interface CardProps {
  rank: string;
  suit: string;
  faceDown?: boolean;
  isUserCard?: boolean;
}

const CardContainer = styled.div<{ isUserCard?: boolean }>`
  width: ${props => props.isUserCard ? '50px' : '40px'};
  height: ${props => props.isUserCard ? '75px' : '60px'};
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  box-shadow: 
    ${props => props.isUserCard 
      ? '0 3px 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.25)'};
  font-weight: bold;
  position: relative;
  font-size: ${props => props.isUserCard ? '16px' : '14px'};
  border: ${props => props.isUserCard ? '2px solid rgba(255, 255, 0, 0.3)' : 'none'};
  transition: all 0.15s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      ${props => props.isUserCard 
        ? '0 5px 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.15)' 
        : '0 4px 12px rgba(0, 0, 0, 0.3)'};
  }
`;

const CardBack = styled.div<{ isUserCard?: boolean }>`
  width: ${props => props.isUserCard ? '50px' : '40px'};
  height: ${props => props.isUserCard ? '75px' : '60px'};
  border-radius: 6px;
  background: linear-gradient(135deg, #273c75 0%, #2c3e50 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.15s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background: 
      repeating-linear-gradient(
        45deg,
        #303f9f,
        #303f9f 5px,
        #3949ab 5px,
        #3949ab 10px
      );
    border-radius: 3px;
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  }
`;

const TopCorner = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '14px' : '12px'};
  line-height: 1;
  font-weight: 700;
  text-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.1);
`;

const BottomCorner = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  bottom: 3px;
  right: 3px;
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '14px' : '12px'};
  line-height: 1;
  transform: rotate(180deg);
  font-weight: 700;
  text-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.1);
`;

const Center = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '26px' : '22px'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Card: React.FC<CardProps> = ({ rank, suit, faceDown = false, isUserCard = false }) => {
  if (faceDown) {
    return <CardBack isUserCard={isUserCard} />;
  }
  
  // Determine card color based on suit
  const isRed = suit === '♥' || suit === '♦';
  const color = isRed ? '#e74c3c' : '#2c3e50';
  
  // Format rank for display (10 is displayed as 10, but others as single char)
  const displayRank = rank === '10' ? '10' : rank;
  
  return (
    <CardContainer isUserCard={isUserCard}>
      <TopCorner color={color} isUserCard={isUserCard}>
        {displayRank}<br/>{suit}
      </TopCorner>
      <Center color={color} isUserCard={isUserCard}>{suit}</Center>
      <BottomCorner color={color} isUserCard={isUserCard}>
        {displayRank}<br/>{suit}
      </BottomCorner>
    </CardContainer>
  );
};

export default Card; 