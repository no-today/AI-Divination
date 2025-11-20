export interface HexagramData {
  code: number; // 0-63 decimal representation of binary
  name: string;
  symbol: string;
  pinyin: string;
  nature: string; // e.g., "Heaven over Heaven"
}

export interface DivinationResult {
  hexagram: HexagramData;
  interpretation: {
    judgment: string;
    poem: string[];
  };
  originalQuery: string;
}

export enum AppState {
  IDLE = 'IDLE',
  DIVINING = 'DIVINING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
