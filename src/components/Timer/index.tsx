import { Box, Stack, Typography } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Digit from "../Digit";

type TimerProps = {
  start: boolean,
  seconds: number,
  setStart: React.Dispatch<React.SetStateAction<boolean>>,
  setSeconds: React.Dispatch<React.SetStateAction<number>>,
  type: number,
  isStopWatch: boolean
}

export default memo(function Timer({ start, setStart, seconds, setSeconds, type, isStopWatch }: TimerProps) {
  const [animated, setAnimated] = useState<any>({
      first: 0,
      fChanged: false,
      second: 0,
      sChanged: false,
      third: 0,
      tChanged: false
    });

  function convertToMinSec(time: number) {
    const arr = [0, 0, 0]

    arr[0] = Math.floor(time / 60);

    const sec = time % 60;

    arr[1] = Math.floor(sec / 10);
    arr[2] = sec % 10;

    return arr;
  }

  useEffect(() => {
    const timeArr = convertToMinSec(seconds);

    const newAnimated: any = {
        first: animated.first,
        fChanged: false,
        second: animated.second,
        sChanged: false,
        third: animated.third,
        tChanged: false
      }

    if (animated.first !== timeArr[0]) {
      newAnimated.fChanged = true;
    }
    if (animated.second !== timeArr[1]) {
      newAnimated.sChanged = true;
    }
    if (animated.third !== timeArr[2]) {
      newAnimated.tChanged = true;
    }
    setAnimated(newAnimated);

    setTimeout(() => {
        setAnimated({
          first: timeArr[0],
          fChanged: false,
          second: timeArr[1],
          sChanged: false,
          third: timeArr[2],
          tChanged: false
        });
      }, 100);
    }, [seconds]);

  useEffect(() => {
    if (start && !isStopWatch) {
      if (seconds > 0) {
        setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);  
      } else {
        setStart(false);
      }
    } 
    
    else if (start && isStopWatch) {
      setTimeout(() => {
        setSeconds(seconds + 1);
      }, 1000);     
    }
  }, [start, seconds]);


  return <>
    <Stack direction='column' justifyContent='center' alignItems='center' spacing={1} marginTop='40px'>
      <Typography variant='h5'>Timer</Typography>

      <Box border='5px solid rgb(25, 118, 210)' overflow='hidden' width='140px' sx={{borderRadius: '20px'}}>
        <Typography variant='h3' sx={{paddingLeft: '10px'}}>
          <Digit value={0} isChanged={false} type={type}/>
          <Digit value={animated.first} isChanged={animated.fChanged} type={type}/>
          <span>:</span>
          <Digit value={animated.second} isChanged={animated.sChanged} type={type}/>
          <Digit value={animated.third} isChanged={animated.tChanged} type={type}/>
        </Typography>
      </Box>
    </Stack>
  </>
});