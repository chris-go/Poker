import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GameType, Position, GameSettings as GameSettingsType } from '../../types/poker';
import { getPositionsForPlayerCount } from '../../utils/pokerUtils';

interface GameSettingsProps {
  onSettingsChange: (settings: GameSettingsType) => void;
  initialSettings?: GameSettingsType;
}

const SettingsContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SettingsTitle = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 16px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin-right: 8px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #3477eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2a5db0;
  }
`;

const defaultSettings: GameSettingsType = {
  gameType: 'CASH',
  playerCount: 6,
  userPosition: 'BTN',
  bigBlinds: 100,
};

const GameSettings: React.FC<GameSettingsProps> = ({ 
  onSettingsChange, 
  initialSettings = defaultSettings 
}) => {
  const [settings, setSettings] = useState<GameSettingsType>(initialSettings);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  
  // Update available positions when player count changes
  useEffect(() => {
    const positions = getPositionsForPlayerCount(settings.playerCount);
    setAvailablePositions(positions);
    
    // If current position is not available in the new set of positions, update to first available
    if (!positions.includes(settings.userPosition)) {
      setSettings(prev => ({
        ...prev,
        userPosition: positions[0]
      }));
    }
  }, [settings.playerCount, settings.userPosition]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Convert numeric inputs to numbers
    if (name === 'playerCount' || name === 'bigBlinds') {
      parsedValue = parseInt(value, 10);
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsChange(settings);
  };
  
  return (
    <SettingsContainer>
      <SettingsTitle>Game Settings</SettingsTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Game Type</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput 
                type="radio" 
                name="gameType" 
                value="CASH" 
                checked={settings.gameType === 'CASH'}
                onChange={handleChange}
              />
              Cash Game
            </RadioLabel>
            <RadioLabel>
              <RadioInput 
                type="radio" 
                name="gameType" 
                value="MTT" 
                checked={settings.gameType === 'MTT'}
                onChange={handleChange}
              />
              Tournament (MTT)
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        
        <FormGroup>
          <Label>Number of Players</Label>
          <Select 
            name="playerCount" 
            value={settings.playerCount}
            onChange={handleChange}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Your Position</Label>
          <Select 
            name="userPosition" 
            value={settings.userPosition}
            onChange={handleChange}
          >
            {availablePositions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Stack Size (Big Blinds)</Label>
          <Select 
            name="bigBlinds" 
            value={settings.bigBlinds}
            onChange={handleChange}
          >
            {[20, 30, 40, 50, 75, 100, 150, 200, 250].map(bb => (
              <option key={bb} value={bb}>{bb} BB</option>
            ))}
          </Select>
        </FormGroup>
        
        <SubmitButton type="submit">Apply Settings</SubmitButton>
      </form>
    </SettingsContainer>
  );
};

export default GameSettings; 