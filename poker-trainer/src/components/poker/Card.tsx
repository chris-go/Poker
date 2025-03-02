import React from 'react';
import styled from 'styled-components';

interface CardProps {
  rank: string;
  suit: string;
  faceDown?: boolean;
}

const CardContainer = styled.div`
  width: 40px;
  height: 60px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  position: relative;
  font-size: 14px;
`;

const CardBack = styled.div`
  width: 40px;
  height: 60px;
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

const TopCorner = styled.div<{ color: string }>`
  position: absolute;
  top: 2px;
  left: 2px;
  color: ${props => props.color};
  font-size: 12px;
  line-height: 1;
`;

const BottomCorner = styled.div<{ color: string }>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  color: ${props => props.color};
  font-size: 12px;
  line-height: 1;
  transform: rotate(180deg);
`;

const Center = styled.div<{ color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.color};
  font-size: 20px;
`;

const Card: React.FC<CardProps> = ({ rank, suit, faceDown = false }) => {
  if (faceDown) {
    return <CardBack />;
  }
  
  // Determine card color based on suit
  const isRed = suit === '♥' || suit === '♦';
  const color = isRed ? 'red' : 'black';
  
  // Format rank for display (10 is displayed as 10, but others as single char)
  const displayRank = rank === '10' ? '10' : rank;
  
  return (
    <CardContainer>
      <TopCorner color={color}>
        {displayRank}<br/>{suit}
      </TopCorner>
      <Center color={color}>{suit}</Center>
      <BottomCorner color={color}>
        {displayRank}<br/>{suit}
      </BottomCorner>
    </CardContainer>
  );
};

export default Card; 