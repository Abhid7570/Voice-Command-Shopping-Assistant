import { parseVoiceCommand } from '../utils/voiceCommands.js';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let voiceCommandHistory = [];
let voiceStats = {
  totalCommands: 0,
  successfulCommands: 0,
  failedCommands: 0,
  languagesUsed: {},
  averageConfidence: 0
};

// Process voice command
export const processVoiceCommand = async (transcript, language, confidence = 0.8) => {
  try {
    // Parse the voice command
    const command = parseVoiceCommand(transcript, { code: language });
    
    // Record the command attempt
    const commandRecord = {
      id: Date.now().toString(),
      transcript,
      language,
      confidence,
      command,
      success: !!command,
      timestamp: new Date(),
      processingTime: Math.random() * 100 // Mock processing time
    };
    
    voiceCommandHistory.push(commandRecord);
    
    // Update statistics
    voiceStats.totalCommands++;
    if (command) {
      voiceStats.successfulCommands++;
    } else {
      voiceStats.failedCommands++;
    }
    
    // Update language usage
    voiceStats.languagesUsed[language] = (voiceStats.languagesUsed[language] || 0) + 1;
    
    // Update average confidence
    const totalConfidence = voiceCommandHistory.reduce((sum, cmd) => sum + cmd.confidence, 0);
    voiceStats.averageConfidence = totalConfidence / voiceCommandHistory.length;
    
    // Keep only last 1000 commands in memory
    if (voiceCommandHistory.length > 1000) {
      voiceCommandHistory = voiceCommandHistory.slice(-1000);
    }
    
    return {
      success: !!command,
      command,
      confidence,
      language,
      timestamp: commandRecord.timestamp,
      processingTime: commandRecord.processingTime
    };
    
  } catch (error) {
    // Record failed command
    const commandRecord = {
      id: Date.now().toString(),
      transcript,
      language,
      confidence,
      command: null,
      success: false,
      error: error.message,
      timestamp: new Date(),
      processingTime: 0
    };
    
    voiceCommandHistory.push(commandRecord);
    voiceStats.totalCommands++;
    voiceStats.failedCommands++;
    
    throw new Error(`Failed to process voice command: ${error.message}`);
  }
};

// Get voice command history
export const getVoiceCommandHistory = async (limit = 50, offset = 0, language = null) => {
  let filteredHistory = voiceCommandHistory;
  
  // Filter by language if specified
  if (language) {
    filteredHistory = filteredHistory.filter(cmd => cmd.language === language);
  }
  
  // Apply pagination
  const paginatedHistory = filteredHistory.slice(offset, offset + limit);
  
  return paginatedHistory.map(cmd => ({
    id: cmd.id,
    transcript: cmd.transcript,
    language: cmd.language,
    confidence: cmd.confidence,
    success: cmd.success,
    timestamp: cmd.timestamp,
    processingTime: cmd.processingTime,
    command: cmd.command ? {
      action: cmd.command.action,
      item: cmd.command.item,
      quantity: cmd.command.quantity,
      category: cmd.command.category
    } : null
  }));
};

// Get voice recognition statistics
export const getVoiceRecognitionStats = async () => {
  const recentCommands = voiceCommandHistory.slice(-100); // Last 100 commands
  
  const recentStats = {
    totalCommands: recentCommands.length,
    successfulCommands: recentCommands.filter(cmd => cmd.success).length,
    failedCommands: recentCommands.filter(cmd => !cmd.success).length,
    averageConfidence: recentCommands.reduce((sum, cmd) => sum + cmd.confidence, 0) / recentCommands.length,
    averageProcessingTime: recentCommands.reduce((sum, cmd) => sum + cmd.processingTime, 0) / recentCommands.length
  };
  
  return {
    overall: voiceStats,
    recent: recentStats,
    languages: Object.keys(voiceStats.languagesUsed).map(lang => ({
      code: lang,
      count: voiceStats.languagesUsed[lang],
      percentage: (voiceStats.languagesUsed[lang] / voiceStats.totalCommands * 100).toFixed(2)
    }))
  };
};

// Reset voice statistics (for testing purposes)
export const resetVoiceStats = async () => {
  voiceCommandHistory = [];
  voiceStats = {
    totalCommands: 0,
    successfulCommands: 0,
    failedCommands: 0,
    languagesUsed: {},
    averageConfidence: 0
  };
  return true;
};
