import React, { useState } from 'react';
import styled from 'styled-components';
import GameSettings from './components/settings/GameSettings';
import PuzzleView from './components/puzzles/PuzzleView';
import { GameSettings as GameSettingsType, PokerPuzzle, PlayerAction } from './types/poker';
import { createSamplePuzzle } from './utils/pokerUtils';

const AppContainer = styled.div`
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 18px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#7f8c8d'};
  border: none;
  border-radius: 5px;
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#bdc3c7'};
  }
`;

const MainContent = styled.main`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const StatBox = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  min-width: 120px;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'puzzle'>('settings');
  const [settings, setSettings] = useState<GameSettingsType>({
    gameType: 'CASH',
    playerCount: 6,
    userPosition: 'BTN',
    bigBlinds: 100,
  });
  
  const [puzzle, setPuzzle] = useState<PokerPuzzle | null>(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  
  const handleSettingsChange = (newSettings: GameSettingsType) => {
    setSettings(newSettings);
    generateNewPuzzle(newSettings);
    setActiveTab('puzzle');
  };
  
  const generateNewPuzzle = (settingsToUse: GameSettingsType = settings) => {
    const newPuzzle = createSamplePuzzle(
      settingsToUse.gameType,
      settingsToUse.playerCount,
      settingsToUse.userPosition,
      settingsToUse.bigBlinds
    );
    setPuzzle(newPuzzle);
  };
  
  const handleActionSelected = (action: PlayerAction) => {
    if (!puzzle) return;
    
    // Update stats
    const isCorrect = action === puzzle.correctAction;
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
    
    // Generate a new puzzle after a delay
    setTimeout(() => {
      generateNewPuzzle();
    }, 2000);
  };
  
  const accuracy = stats.total > 0 
    ? Math.round((stats.correct / stats.total) * 100) 
    : 0;
  
  return (
    <AppContainer>
      <Header>
        <Title>Poker Trainer</Title>
        <Subtitle>Practice your decision-making skills in different poker scenarios</Subtitle>
      </Header>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Tab>
        <Tab 
          active={activeTab === 'puzzle'} 
          onClick={() => {
            if (puzzle) {
              setActiveTab('puzzle');
            } else {
              generateNewPuzzle();
              setActiveTab('puzzle');
            }
          }}
        >
          Puzzles
        </Tab>
      </TabsContainer>
      
      <MainContent>
        {activeTab === 'settings' && (
          <GameSettings onSettingsChange={handleSettingsChange} initialSettings={settings} />
        )}
        
        {activeTab === 'puzzle' && puzzle && (
          <PuzzleView puzzle={puzzle} onActionSelected={handleActionSelected} />
        )}
      </MainContent>
      
      {stats.total > 0 && (
        <Stats>
          <StatBox>
            <StatLabel>Correct</StatLabel>
            <StatValue>{stats.correct}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Incorrect</StatLabel>
            <StatValue>{stats.incorrect}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Total</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Accuracy</StatLabel>
            <StatValue>{accuracy}%</StatValue>
          </StatBox>
        </Stats>
      )}
    </AppContainer>
  );
};

export default App;
