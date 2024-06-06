import { Statistics } from "../reducers/userReducer";

export function formatingData( statistics: Statistics[] ) {
  const dataFormated = statistics.reduce((acc: number[][], curr: Statistics, i: number) => {
      acc[0].push(i);
      acc[1].push(curr.numWords);
      acc[2].push(curr.speed);
      acc[3].push(curr.maxSpeed);
      acc[4].push(curr.accuracy);
      acc[5].push(curr.fast);

      return acc;
  }, [[], [], [], [], [], [],])

  return dataFormated;
}