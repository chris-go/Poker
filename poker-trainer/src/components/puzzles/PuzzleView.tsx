import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PokerTable from '../poker/PokerTable';
import { PokerPuzzle, PlayerAction } from '../../types/poker';
// Only import StatLabel, define our own StatValue
import { StatLabel } from '../../App';

interface PuzzleViewProps {
  puzzle: PokerPuzzle;
  onActionSelected: (action: PlayerAction) => void;
  onMenuClick?: () => void;
  stats: {
    correct: number;
    incorrect: number;
    total: number;
  };
  accuracy: number;
}

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: auto;
  padding: 0 5px;
  position: relative;
  
  /* Add padding for horizontal orientation (landscape) */
  @media (orientation: landscape) {
    padding: 30px 5px;
    max-height: 100vh;
    justify-content: center;
  }
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px; /* Increased to move buttons down more */
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  position: relative; /* For absolute positioning of feedback */
  
  @media (orientation: landscape) {
    margin-top: 30px; /* Increased in landscape mode too */
    max-width: 600px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  flex-wrap: wrap;
`;

// Stats box positioned at top left - more compact with grayed-out text
const StatsContainer = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 100;
  background-color: rgba(42, 42, 42, 0.85);
  border-radius: 8px;
  padding: 8px 10px;
  width: 150px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9em;
  color: rgba(224, 224, 224, 0.7); /* Grayed out text */
`;

const GameModeText = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: rgba(224, 224, 224, 0.8);
  margin-bottom: 6px;
  text-align: center;
`;

const StatValue = styled.div`
  font-weight: bold;
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
  position: relative;
  
  ${props => {
    switch (props.action) {
      case 'FOLD':
        return `
          background-color: #e74c3c;
          color: white;
          &:hover { background-color: #c0392b; }
        `;
      case 'CALL':
      case 'CHECK':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
        `;
      case 'RAISE':
        return `
          background-color: #2ecc71;
          color: white;
          &:hover { background-color: #27ae60; }
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

const HotkeyIndicator = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2px 5px;
  border-radius: 3px;
`;

// Updated FeedbackContainer to not cause layout shifts
const FeedbackContainer = styled.div<{ correct: boolean }>`
  position: absolute;
  top: 100%; /* Position below the buttons */
  left: 20px;
  right: 20px;
  margin-top: 10px;
  background-color: ${props => props.correct ? '#2a4a2a' : '#4a2a2a'};
  color: ${props => props.correct ? '#90ee90' : '#ff9090'};
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  z-index: 10;
`;

// Menu icon moved from PokerTable to be next to the accuracy tracking box
const MenuIcon = styled.div`
  position: absolute;
  top: 15px;
  left: 170px; /* Positioned to the right of stats box */
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  span {
    display: block;
    height: 3px;
    width: 22px;
    margin: 2px 0;
    background-color: white;
  }
`;

const PuzzleView: React.FC<PuzzleViewProps> = ({ 
  puzzle, 
  onActionSelected, 
  onMenuClick, 
  stats, 
  accuracy 
}) => {
  const [selectedAction, setSelectedAction] = useState<PlayerAction | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const userPlayer = puzzle.players.find(player => player.isUser);
  
  // Determine if the user is in the big blind position
  const isUserBigBlind = userPlayer?.position === 'BB';
  
  // Determine if there is a bet to call (if not, user can check)
  const hasBetToCall = puzzle.pot > (puzzle.blinds.big + puzzle.blinds.small);
  
  // Reset state when puzzle changes
  useEffect(() => {
    setSelectedAction(null);
    setShowFeedback(false);
  }, [puzzle]);
  
  // Use useCallback to memoize the handleActionClick function
  const handleActionClick = useCallback((action: PlayerAction) => {
    setSelectedAction(action);
    setShowFeedback(true);
    onActionSelected(action);
  }, [onActionSelected]);
  
  const isCorrect = selectedAction === puzzle.correctAction;
  
  // Add keyboard event listeners for hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFeedback) return; // Don't process hotkeys while showing feedback
      
      // Only trigger hotkeys if no modifier keys are pressed
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'f':
          handleActionClick('FOLD');
          break;
        case 'c':
          if (hasBetToCall) {
            handleActionClick('CALL');
          } else if (isUserBigBlind) {
            handleActionClick('CHECK');
          }
          break;
        case 'r':
          handleActionClick('RAISE');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFeedback, hasBetToCall, isUserBigBlind, handleActionClick]);
  
  return (
    <PuzzleContainer>
      <StatsContainer>
        <GameModeText>
          {puzzle.gameType === 'CASH' ? 'Cash Game' : 'Tournament'}
        </GameModeText>
        <StatsRow>
          <StatLabel>Correct</StatLabel>
          <StatValue>{stats.correct}</StatValue>
        </StatsRow>
        <StatsRow>
          <StatLabel>Incorrect</StatLabel>
          <StatValue>{stats.incorrect}</StatValue>
        </StatsRow>
        <StatsRow>
          <StatLabel>Total</StatLabel>
          <StatValue>{stats.total}</StatValue>
        </StatsRow>
        <StatsRow>
          <StatLabel>Accuracy</StatLabel>
          <StatValue>{accuracy}%</StatValue>
        </StatsRow>
      </StatsContainer>
      
      {/* Menu icon moved from PokerTable component */}
      <MenuIcon onClick={onMenuClick}>
        <span></span>
        <span></span>
        <span></span>
      </MenuIcon>
      
      <PokerTable 
        players={puzzle.players}
        communityCards={puzzle.communityCards}
        pot={puzzle.pot}
        activePosition={userPlayer?.position}
        bigBlindAmount={puzzle.blinds.big}
      />
      
      <ActionPanel>
        <ActionButtons>
          <ActionButton action="FOLD" onClick={() => handleActionClick('FOLD')}>
            Fold
            <HotkeyIndicator>F</HotkeyIndicator>
          </ActionButton>
          
          {isUserBigBlind && !hasBetToCall ? (
            <ActionButton action="CHECK" onClick={() => handleActionClick('CHECK')}>
              Check
              <HotkeyIndicator>C</HotkeyIndicator>
            </ActionButton>
          ) : hasBetToCall ? (
            <ActionButton action="CALL" onClick={() => handleActionClick('CALL')}>
              Call
              <HotkeyIndicator>C</HotkeyIndicator>
            </ActionButton>
          ) : null}
          
          <ActionButton action="RAISE" onClick={() => handleActionClick('RAISE')}>
            Raise
            <HotkeyIndicator>R</HotkeyIndicator>
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