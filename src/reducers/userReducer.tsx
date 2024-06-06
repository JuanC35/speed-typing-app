export type State = UserType[];

export type Statistics = { 
  timeStamp: number,
  numWords: number,
  speed: number,
  maxSpeed: number,
  accuracy: number,
  fast: number
}

export type UserType = {
  name: string;
  password: string;
  avatar: string;
  statistics: Statistics[],
} 