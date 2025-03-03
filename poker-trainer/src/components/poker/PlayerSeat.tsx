import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Player } from '../../types/poker';
import Card from './Card';

interface PlayerSeatProps {
  player: Player;
  style?: CSSProperties;
  isActive?: boolean;
  bigBlindAmount?: number;
}

const SeatContainer = styled.div<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? '#4a6fa5' : '#333'};
  border-radius: 10px;
  padding: 10px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
  z-index: 10;
  ${props => props.isActive && `
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 0, 0.7);
  `}
`;

const PositionBadge = styled.span`
  background-color: #222;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-right: 5px;
`;

const Stack = styled.div`
  font-weight: bold;
  margin: 5px 0;
`;

const PlayerCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
`;

const FaceDownCard = styled.div`
  width: 25px;
  height: 35px;
  border-radius: 3px;
  background-color: #1f5ebf;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.1) 5px,
    rgba(0, 0, 0, 0.1) 10px
  );
  border: 1px solid #0d3177;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, style, isActive, bigBlindAmount = 1 }) => {
  return (
    <SeatContainer style={style} isActive={isActive}>
      <div>
        <PositionBadge>{player.position}</PositionBadge>
        {player.isUser && '👤'}
      </div>
      <Stack>{player.stack / bigBlindAmount} BB</Stack>
      
      <PlayerCards>
        {player.isUser && player.cards ? (
          <>
            <Card rank={player.cards[0].rank} suit={player.cards[0].suit} />
            <Card rank={player.cards[1].rank} suit={player.cards[1].suit} />
          </>
        ) : (
          <>
            <FaceDownCard />
            <FaceDownCard />
          </>
        )}
      </PlayerCards>
    </SeatContainer>
  );
};

export default PlayerSeat; 