export interface IPlayer {
   nickname: string;
   playerId: string;
   socketId: string;
   roomId: string;
   board?: number;
   isPlaying?: boolean;
   isWinner?: boolean;
   isLoser?: boolean;
}