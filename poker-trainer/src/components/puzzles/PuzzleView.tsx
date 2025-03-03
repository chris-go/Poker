import React, { useState } from 'react';
import styled from 'styled-components';
import PokerTable from '../poker/PokerTable';
import { PokerPuzzle, PlayerAction } from '../../types/poker';

interface PuzzleViewProps {
  puzzle: PokerPuzzle;
  onActionSelected: (action: PlayerAction) => void;
}

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const SituationDescription = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ action: PlayerAction }>`
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 100px;
  
  ${props => {
    switch (props.action) {
      case 'FOLD':
        return `
          background-color: #e74c3c;
          color: white;
          &:hover { background-color: #c0392b; }
        `;
      case 'CALL':
        return `
          background-color: #3498db;
          color: white;
          &:hover { background-color: #2980b9; }
        `;
      case 'CHECK':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
        `;
      case 'RAISE':
        return `
          background-color: #f39c12;
          color: white;
          &:hover { background-color: #d35400; }
        `;
      default:
        return `
          background-color: #7f8c8d;
          color: white;
          &:hover { background-color: #2c3e50; }
        `;
    }
  }}
`;

const FeedbackContainer = styled.div<{ correct: boolean }>`
  background-color: ${props => props.correct ? '#dff0d8' : '#f2dede'};
  color: ${props => props.correct ? '#3c763d' : '#a94442'};
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  text-align: center;
  font-weight: bold;
`;

const PuzzleView: React.FC<PuzzleViewProps> = ({ puzzle, onActionSelected }) => {
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const userPlayer = puzzle.players.find(player => player.isUser);
  
  const handleActionClick = (action: PlayerAction) => {
    setSelectedAction(action);
    setShowFeedback(true);
    onActionSelected(action);
  };
  
  const isCorrect = selectedAction === puzzle.correctAction;
  
  return (
    <PuzzleContainer>
      <PokerTable 
        players={puzzle.players}
        communityCards={puzzle.communityCards}
        pot={puzzle.pot}
        activePosition={userPlayer?.position}
        bigBlindAmount={puzzle.blinds.big}
      />
      
      <ActionPanel>
        <SituationDescription>
          {puzzle.gameType === 'CASH' ? 'Cash Game' : 'Tournament'} - 
          Blinds: {puzzle.blinds.small/puzzle.blinds.big}/1 BB - 
          Pot: {puzzle.pot/puzzle.blinds.big} BB - 
          Your Stack: {userPlayer?.stack ? (userPlayer.stack/puzzle.blinds.big) : 0} BB
        </SituationDescription>
        
        <ActionButtons>
          <ActionButton action="FOLD" onClick={() => handleActionClick('FOLD')}>
            Fold
          </ActionButton>
          
          <ActionButton action="CHECK" onClick={() => handleActionClick('CHECK')}>
            Check
          </ActionButton>
          
          <ActionButton action="CALL" onClick={() => handleActionClick('CALL')}>
            Call
          </ActionButton>
          
          <ActionButton action="RAISE" onClick={() => handleActionClick('RAISE')}>
            Raise
          </ActionButton>
        </ActionButtons>
        
        {showFeedback && (
          <FeedbackContainer correct={isCorrect}>
            {isCorrect
              ? 'Correct! ' + puzzle.actionDescription
              : 'Not the best play. ' + puzzle.actionDescription}
          </FeedbackContainer>
        )}
      </ActionPanel>
    </PuzzleContainer>
  );
};

export default PuzzleView; 