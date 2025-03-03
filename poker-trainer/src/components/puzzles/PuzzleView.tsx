import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PokerTable from '../poker/PokerTable';
import { PokerPuzzle, PlayerAction } from '../../types/poker';
// We no longer need this import
// Only import StatLabel, define our own StatValue
// import { StatLabel } from '../../App';

// Define ActionResult type to pass to parent component
interface ActionResult {
  action: PlayerAction;
  isCorrect: boolean;
}

interface PuzzleViewProps {
  puzzle: PokerPuzzle;
  onActionSelected: (result: ActionResult) => void;
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
  
  /* For portrait mode, optimize layout for the larger table */
  @media (orientation: portrait) and (max-width: 767px) {
    padding: 0 5px 30px; /* Reduce padding at the bottom */
    height: 100vh;
    justify-content: flex-start; /* Align content from the top */
    overflow-y: auto; /* Allow scrolling if needed */
  }
`;

// Fixed height container to avoid layout shifts
const ActionAreaWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  height: 140px; /* Fixed height that accommodates buttons and explanation */
  margin-top: 60px; /* Increased from 40px to add more space between table and buttons */
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (orientation: landscape) {
    margin-top: 60px; /* Increased from 50px to avoid overlap with bottom player */
    max-width: 600px;
    height: 120px;
  }
  
  /* For portrait mode (mobile), ensure enough space between table and buttons */
  @media (orientation: portrait) and (max-width: 767px) {
    margin-top: 35px; /* Increased from 20px to prevent overlap with bottom player */
    padding: 0 15px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  height: 100%;
`;

// Menu icon positioned at top right
const MenuIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  }
  
  span {
    display: block;
    height: 2px;
    width: 20px;
    margin: 3px 0;
    background-color: white;
    border-radius: 1px;
    transition: all 0.2s ease;
  }
  
  &:hover span {
    width: 22px;
  }
`;

const ActionButton = styled.button<{ action: PlayerAction }>`
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  border-width: 2px;
  border-style: solid;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex: 1;
  min-width: 100px;
  position: relative;
  height: 100%;
  backdrop-filter: blur(5px);
  
  ${props => {
    switch (props.action) {
      case 'FOLD':
        return `
          border-color: #e74c3c;
          color: #e74c3c;
          &:hover { 
            background-color: rgba(231, 76, 60, 0.1);
            box-shadow: 0 0 15px rgba(231, 76, 60, 0.3);
          }
        `;
      case 'CALL':
      case 'CHECK':
        return `
          border-color: #2ecc71;
          color: #2ecc71;
          &:hover { 
            background-color: rgba(46, 204, 113, 0.1);
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
          }
        `;
      case 'RAISE':
        return `
          border-color: #2ecc71;
          color: #2ecc71;
          &:hover { 
            background-color: rgba(46, 204, 113, 0.1);
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
          }
        `;
      default:
        return `
          border-color: #7f8c8d;
          color: #7f8c8d;
          &:hover { 
            background-color: rgba(127, 140, 141, 0.1);
            box-shadow: 0 0 15px rgba(127, 140, 141, 0.3);
          }
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
  border-radius: 4px;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// Feedback container that overlays the button area exactly
const FeedbackContainer = styled.div<{ correct: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: ${props => props.correct ? 'rgba(42, 74, 42, 0.85)' : 'rgba(74, 42, 42, 0.85)'};
  color: ${props => props.correct ? '#90ee90' : '#ff9090'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  z-index: 10;
  backdrop-filter: blur(5px);
  border: 2px solid ${props => props.correct ? 'rgba(46, 204, 113, 0.5)' : 'rgba(231, 76, 60, 0.5)'};
  box-shadow: 0 5px 15px ${props => props.correct ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
`;

// Explanation text for incorrect answers
const ExplanationContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  color: #ff9090;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  background-color: rgba(74, 42, 42, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

const ErrorMessage = styled.div`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(231, 76, 60, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<PokerPuzzle>(puzzle);
  const [puzzleError, setPuzzleError] = useState<string | null>(null);
  
  const userPlayer = currentPuzzle.players.find(player => player.isUser);
  
  // Determine if the user is in the big blind position
  const isUserBigBlind = userPlayer?.position === 'BB';
  
  // Determine if there is a bet to call (if not, user can check)
  const hasBetToCall = currentPuzzle.pot > (currentPuzzle.blinds.big + currentPuzzle.blinds.small);
  
  // Check for inconsistency between puzzle's correctAction and available actions
  useEffect(() => {
    // Clear any existing error
    setPuzzleError(null);
    
    // Check if the correctAction is CHECK but CHECK is not available (only CALL is)
    if (currentPuzzle.correctAction === 'CHECK' && hasBetToCall) {
      setPuzzleError("Error: Puzzle expects CHECK but there's a bet to call");
      console.error("Puzzle inconsistency: correctAction is CHECK but hasBetToCall is true");
    }
    
    // Check if the correctAction is CALL but CALL is not available (only CHECK is)
    if (currentPuzzle.correctAction === 'CALL' && !hasBetToCall && isUserBigBlind) {
      setPuzzleError("Error: Puzzle expects CALL but there's no bet to call");
      console.error("Puzzle inconsistency: correctAction is CALL but hasBetToCall is false and isUserBigBlind is true");
    }
  }, [currentPuzzle, hasBetToCall, isUserBigBlind]);
  
  // Reset state when puzzle changes
  useEffect(() => {
    if (puzzle.id !== currentPuzzle.id) {
      setSelectedAction(null);
      setShowFeedback(false);
      setShowExplanation(false);
      setCurrentPuzzle(puzzle);
      setPuzzleError(null);
    }
  }, [puzzle, currentPuzzle.id]);
  
  // Function to determine if the user's action is correct
  // This handles the CHECK/CALL equivalence
  const isActionCorrect = useCallback((action: PlayerAction): boolean => {
    const correctAction = currentPuzzle.correctAction;
    
    // Direct match
    if (action === correctAction) {
      return true;
    }
    
    // CHECK/CALL equivalence
    // If user selected CHECK and the correct action is CALL, but CHECK is the only available option
    if (action === 'CHECK' && correctAction === 'CALL' && isUserBigBlind && !hasBetToCall) {
      console.log('Accepting CHECK as correct when CALL was expected but unavailable');
      return true;
    }
    
    // If user selected CALL and the correct action is CHECK, but CALL is the only available option
    if (action === 'CALL' && correctAction === 'CHECK' && hasBetToCall) {
      console.log('Accepting CALL as correct when CHECK was expected but unavailable');
      return true;
    }
    
    return false;
  }, [currentPuzzle.correctAction, isUserBigBlind, hasBetToCall]);
  
  // Use useCallback to memoize the handleActionClick function
  const handleActionClick = useCallback((action: PlayerAction) => {
    setSelectedAction(action);
    setShowFeedback(true);
    setShowExplanation(false);
    
    // Check if the action is correct (including CHECK/CALL equivalence)
    const actionIsCorrect = isActionCorrect(action);
    
    // Pass the original action along with the correctness flag to the parent
    onActionSelected({ 
      action, 
      isCorrect: actionIsCorrect 
    });
    
    // Always hide feedback after 1 second for both correct and incorrect answers
    setTimeout(() => {
      // For incorrect answers, show the explanation
      if (!actionIsCorrect) {
        setShowFeedback(false);
        setShowExplanation(true);
      } else {
        // For correct answers, just hide the feedback (next puzzle will load automatically)
        setShowFeedback(false);
      }
    }, 1000);
  }, [onActionSelected, isActionCorrect]);
  
  // Use our custom isActionCorrect function instead of direct comparison
  const isCorrect = selectedAction ? isActionCorrect(selectedAction) : false;
  
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
  
  // If correctAction is CHECK, make sure action is available
  const canCheck = isUserBigBlind && !hasBetToCall;
  // If correctAction is CALL, make sure action is available
  const canCall = hasBetToCall;
  
  // Override correct action if needed to match available actions
  // This ensures the user always has the ability to select the correct action
  useEffect(() => {
    // This is a temporary fix to handle inconsistent puzzles
    // Long-term the puzzle generation should be fixed
    if (currentPuzzle.correctAction === 'CHECK' && !canCheck && canCall) {
      // If puzzle says CHECK but CHECK isn't available, change to CALL
      const updatedPuzzle = {
        ...currentPuzzle,
        correctAction: 'CALL' as PlayerAction
      };
      setCurrentPuzzle(updatedPuzzle);
      console.log("Corrected puzzle: Changed correctAction from CHECK to CALL");
    } else if (currentPuzzle.correctAction === 'CALL' && !canCall && canCheck) {
      // If puzzle says CALL but CALL isn't available, change to CHECK
      const updatedPuzzle = {
        ...currentPuzzle,
        correctAction: 'CHECK' as PlayerAction
      };
      setCurrentPuzzle(updatedPuzzle);
      console.log("Corrected puzzle: Changed correctAction from CALL to CHECK");
    }
  }, [currentPuzzle, canCheck, canCall]);
  
  return (
    <PuzzleContainer>
      {/* Menu icon positioned at top right */}
      <MenuIcon onClick={onMenuClick}>
        <span></span>
        <span></span>
        <span></span>
      </MenuIcon>
      
      <PokerTable 
        players={currentPuzzle.players}
        communityCards={currentPuzzle.communityCards}
        pot={currentPuzzle.pot}
        activePosition={userPlayer?.position}
        bigBlindAmount={currentPuzzle.blinds.big}
        stats={stats}
        accuracy={accuracy}
      />
      
      <ActionAreaWrapper>
        <ButtonContainer>
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
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </FeedbackContainer>
          )}
        </ButtonContainer>
        
        {/* Show explanation for incorrect answers after feedback disappears */}
        {showExplanation && !isCorrect && !showFeedback && (
          <ExplanationContainer>
            {currentPuzzle.actionDescription}
          </ExplanationContainer>
        )}
        
        {/* Show puzzle error if detected */}
        {puzzleError && (
          <ErrorMessage>
            {puzzleError}
          </ErrorMessage>
        )}
      </ActionAreaWrapper>
    </PuzzleContainer>
  );
};

export default PuzzleView; 