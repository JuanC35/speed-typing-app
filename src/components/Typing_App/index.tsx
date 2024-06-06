import { Box, Container, Stack, Typography, Grid, Button, Select, FormControl, InputLabel, MenuItem, SelectChangeEvent, Theme } from "@mui/material";
import styles from './styles.module.css';
import { useRef, useState, memo, useEffect } from "react";
import { ActionsGameApp, PagesRoutes, ActionsGame, GameState } from "../../reducers/gameReducer";
import User from "../User";
import Timer from "../Timer";
import { Statistics } from "../../reducers/userReducer";

export type TypingAppProps = {
  stateGame: GameState,
  dispatchGame: React.Dispatch<ActionsGameApp>,
  saveStatistics: (name: string | null, statistics: Statistics) => Promise<unknown>,
  theme: Theme
}

export default memo(function TypingApp({ stateGame, dispatchGame, saveStatistics, theme }: TypingAppProps) {
  const { name, avatar, numWords, maxSpeed, accuracy, speed, wordsForGame, 
    isNotDisabled, topSpace, gameEnds, isStopWatch } = stateGame;
  const [seconds, setSeconds] = useState<number>(stateGame.time);
  const [start, setStart] = useState<boolean>(false);

  const inputParagraph = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!start && ((seconds <= 0 && !isStopWatch) || (gameEnds && isStopWatch))) {

      dispatchGame({ type: ActionsGame.GAME_ENDS, payload: { time: seconds }});

      inputParagraph.current!.disabled = true;

      setTimeout(() => {
        saveStatistics(name, stateGame.statistics[stateGame.statistics.length - 1]);  
      }, 1000);
    }
  }, [start]);

  useEffect(() => {
    document.addEventListener('keydown', handleDisabled);

    return () => document.removeEventListener('keydown', handleDisabled);
  }, [isNotDisabled]);

  function handleStart() {
    dispatchGame({ type: ActionsGame.GAME_START });

    if (stateGame.gameType === 2) setSeconds(0); 
    else setSeconds(stateGame.time);

    dispatchGame({ type: ActionsGame.SET_WORDS_OF_THE_GAME });
    setStart(true);

    inputParagraph.current!.disabled = false;
    inputParagraph.current!.value = '';
    inputParagraph.current!.focus();
  }

  function handleComparison() {
    const textValue = inputParagraph.current!.value;
    const inputArr = textValue?.split(' ');
    const numberWords = inputArr!.length;
    const lastIndex = numberWords - 1;

    if (textValue.length % 6 === 0) {
      dispatchGame({ type: ActionsGame.SET_MAX_SPEED });
    }

    if (lastIndex - 1 < wordsForGame.length) {
      if (lastIndex > stateGame.index) {
        dispatchGame({ type: ActionsGame.SET_INDEX, payload: { index: lastIndex }});

        if (wordsForGame[lastIndex - 1].isCorrect === null) {
          if(wordsForGame[lastIndex - 1].word === inputArr![lastIndex - 1]) {
            dispatchGame({ type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: lastIndex - 1, isCorrect: true }});
          } else dispatchGame({ type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: lastIndex - 1, isCorrect: false }});
        }

        if ((lastIndex + 1) % 35 === 0) {
          dispatchGame({ type: ActionsGame.SET_TOP_SPACE, payload: { space: Number(((lastIndex + 1) / 35).toFixed(0)) }});
        }

      } else {
        dispatchGame({ type: ActionsGame.SET_INDEX, payload: { index: lastIndex }});
    
        for (let i = lastIndex; i <= stateGame.index; i++) {
          dispatchGame({ type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: i, isCorrect: null }});
        }

        for (let i = 0; i < lastIndex; i++) {
          if(wordsForGame[i].word === inputArr![i]) {
            dispatchGame({ type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: i, isCorrect: true }});
          } else dispatchGame({ type: ActionsGame.SET_WORD_ISCORRECT, payload: { index: i, isCorrect: false }});
        }

        if ((lastIndex + 1) % 35 === 0 && lastIndex < stateGame.index) {
          dispatchGame({ type: ActionsGame.SET_TOP_SPACE, payload: { space: Number((((lastIndex + 1) / 35) - 1).toFixed(0)) }});
        }
      }
    }
    
    if (wordsForGame.length === inputArr!.length - 1) {
      dispatchGame({ type: ActionsGame.SET_GAME_ENDS, payload: { isEnded: true }});
      setStart(false);
    }
      
  }

  function handleDisabled(e: any) {
    if (!isNotDisabled && e.key === 'Backspace') {
      e.preventDefault();
    }
  }

  return <>
     <Container className={styles.container}>
      <Stack justifyContent='center' alignItems='center'>
        <Typography variant='h3' className={styles.title}>Speed Typing App</Typography>
      </Stack>

      <Grid container spacing={2} maxWidth='xl' justifyContent='center' alignItems='center'>
        <Grid item lg={2}>
          <User avatar={avatar} name={name} words={numWords} 
            maxSpeed={maxSpeed} speed={speed} accuracy={accuracy}
            gameEnds={gameEnds}/>
        </Grid>

        <Grid item lg={8}>
          <Stack direction='column' justifyContent='center' alignItems='center'>
            <Box>
              <Box className={styles.containerParagraph} 
                border={`5px solid ${!gameEnds ? theme.palette.primary.main : 
                  theme.palette.secondary.main}`}>
                <Box className={styles.paragraph} top={`-${topSpace * 90}px`}>
                  {wordsForGame.map(({ word, isCorrect }, i) => {
                    return <span className={`${styles.spanWord}`}
                      key={`word${i}`}
                      style={{
                        color: isCorrect
                          ? theme.palette.secondary.main
                          : isCorrect === false
                          ? 'red'
                          : stateGame.index === i
                          ? theme.palette.primary.main
                          : 'black',

                        fontSize: stateGame.index === i ? '40px' : '24px',
                        paddingBottom: stateGame.index === i ? '5px' : '0px'
                      }}
                    >
                      {`${word}`}
                    </span>
                  })}
                </Box>
              </Box>
              <input ref={inputParagraph} className={styles.inputParagraph}
                onChange={handleComparison} 
                style={{ border: `5px solid ${!gameEnds ? theme.palette.primary.main : theme.palette.secondary.main}` }}
              >               
              </input>
            </Box>
          </Stack>      
        </Grid>

        <Grid item lg={2}>
          <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' sx={{ height: '90%' }} marginLeft='-40px'>
            <Button variant='custom'
              onClick={() => {
                dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.STATISTICS }});
              }}
              disabled={start ? true : false}   
            >Statistics</Button>
            <Button variant='custom'
              onClick={() => {
                dispatchGame({ type: ActionsGame.RESET_USER });
                dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.SIGNIN }})
              }}
              disabled={start ? true : false}              
            >Sign Off</Button>

            <FormControl sx={{ width: '150px' }}>
              <InputLabel id='gameTypeLabel'>Game Type</InputLabel>
              <Select
                labelId='gameTypeLabel'
                label='Game Type'
                value={stateGame.gameType?.toString()}
                disabled={start ? true : false}  
                onChange={(e: SelectChangeEvent) => {
                  const type = Number(e.target.value);
                  let setIsStopWatch = false;
                  
                  if (type === 2) {
                    setIsStopWatch = true;
                  } 
                  dispatchGame({ type: ActionsGame.SET_WORD, payload: { word: '' }});
                  dispatchGame({ type: ActionsGame.SET_GAME_TYPE, payload: { type: type }});
                  dispatchGame({ type: ActionsGame.SET_IS_STOPWATCH, payload: { is: setIsStopWatch }});
                }}
              >
                <MenuItem value={1}>Paragraph</MenuItem>
                <MenuItem value={2}>Fast Test</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '150px' }}>
              <InputLabel id='timerTypeLabel'>Timer Type</InputLabel>
              <Select
                labelId='timerTypeLabel'
                label='Timer Type'
                value={stateGame.timerType?.toString()}
                disabled={start ? true : false}  
                onChange={(e: SelectChangeEvent) => {
                  const type = Number(e.target.value);
                  dispatchGame({ type: ActionsGame.SET_TIMER_TYPE, payload: { type: type }});
                }}
              >
                <MenuItem value={0}>Faded</MenuItem>
                <MenuItem value={1}>Rotated</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '150px' }}>
              <InputLabel id='timeLabel'>Time</InputLabel>
              <Select
                labelId='timeLabel'
                label='Time'
                value={stateGame.time?.toString()}
                disabled={start ? true : false}  
                onChange={(e: SelectChangeEvent) => {
                  const time = Number(e.target.value)
                  dispatchGame({ type: ActionsGame.SET_TIME, payload: { time: time }})
                  setSeconds(time)
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={60}>60</MenuItem>
              </Select>
            </FormControl>

            <Timer start={start} setStart={setStart} seconds={seconds} 
              setSeconds={setSeconds} type={stateGame.timerType} isStopWatch={stateGame.isStopWatch}
            />
          </Stack>
        </Grid>

        <Grid item lg={2}>
          <Stack justifyContent='center' alignItems='center' width='250px'>
            <Button variant='custom' sx={{ marginTop: '30px' }}
              onClick={handleStart}
              disabled={start ? true : false}  
            >Start</Button>
          </Stack>
        </Grid>

        <Grid item lg={8}>
        </Grid>
        
        <Grid item lg={2}>
          <Stack justifyContent='center' alignItems='center' marginLeft='-40px'>
            <InputLabel>Backspace</InputLabel>
            <Button variant='custom'
              onClick={() => dispatchGame({ type: ActionsGame.SET_IS_NOT_DISABLED })}
              disabled={start ? true : false}  
            >{isNotDisabled ? 'Disable' : 'Enable'}</Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </>
});