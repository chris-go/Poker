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
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  box-shadow: ${props => props.isUserCard ? '0 2px 8px rgba(255, 255, 255, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.2)'};
  font-weight: bold;
  position: relative;
  font-size: ${props => props.isUserCard ? '16px' : '14px'};
  border: ${props => props.isUserCard ? '2px solid rgba(255, 255, 0, 0.3)' : 'none'};
`;

const CardBack = styled.div<{ isUserCard?: boolean }>`
  width: ${props => props.isUserCard ? '50px' : '40px'};
  height: ${props => props.isUserCard ? '75px' : '60px'};
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const TopCorner = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '14px' : '12px'};
  line-height: 1;
`;

const BottomCorner = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '14px' : '12px'};
  line-height: 1;
  transform: rotate(180deg);
`;

const Center = styled.div<{ color: string; isUserCard?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.color};
  font-size: ${props => props.isUserCard ? '24px' : '20px'};
`;

const Card: React.FC<CardProps> = ({ rank, suit, faceDown = false, isUserCard = false }) => {
  if (faceDown) {
    return <CardBack isUserCard={isUserCard} />;
  }
  
  // Determine card color based on suit
  const isRed = suit === '♥' || suit === '♦';
  const color = isRed ? 'red' : 'black';
  
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