import { Container, Stack, Typography, Grid, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { ActionsGameApp, GameState } from '../../reducers/gameReducer';
import { ActionsGame, PagesRoutes } from '../../reducers/gameReducer';
import SimpleLineChart from '../LineChart';
import User from '../User';
import styles from './styles.module.css'
import { TableData } from '../TableData';
import { Statistics } from '../../reducers/userReducer';
import { formatingData } from '../../util/formatingData';

type GraphPageProps = {
  stateGame?: GameState,
  name: string | null,
  avatar: string | null,
  statistics: Statistics[]
  dispatchGame: React.Dispatch<ActionsGameApp>
}

export default function GraphPage({ name, avatar, statistics, dispatchGame }: GraphPageProps) {
  const [data, setData] = useState<number[][] | null>(null);

  useEffect(() => {
    setData(formatingData(statistics));
  }, []);


  return <>
    <Container maxWidth={false} sx={{ padding:'20px' }}>
      <Stack direction='column' alignItems='center' width='96vw' margin='0px'>
       <Typography variant='h3' className={styles.title}>Speed Typing App</Typography>

        <Grid container spacing={0} maxWidth='xl'>
          <Grid item lg={6}>
            <Stack direction='column' justifyContent='center' alignItems='center' paddingTop='40px'>
              <User avatar={avatar} name={name}/>
              
              <Button 
                variant='custom'
                onClick={() => dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.TYPING_APP }})}
              >Back</Button>

              <Box width='450px' marginTop='20px'>
                <TableData statistics={statistics} />
              </Box>
            </Stack>           
          </Grid>

          <Grid item lg={6} sx={{display: 'flex', justifyContent:'center'}}>        
            <Box marginLeft='10px'>
              {
                !data ? 
                <Typography variant='h2' top='200px' left='50px' position='relative'>Not Data</Typography> :
                <Box>
                  <SimpleLineChart 
                    xValues={data![0]} 
                    yValues={data![4]} 
                    xLabel='Game' 
                    yLabel='Accuracy (%)'
                  />
                  <SimpleLineChart 
                    xValues={data![0]} 
                    yValues={data![1]} 
                    xLabel='Game' 
                    yLabel='Number of Words'
                  />
                  <SimpleLineChart 
                    xValues={data![0]} 
                    yValues={data![2]} 
                    xLabel='Game' 
                    yLabel='Speed (words/min)'
                  />
                  <SimpleLineChart 
                    xValues={data![0]} 
                    yValues={data![3]} 
                    xLabel='Game' 
                    yLabel='Max Speed (words/min)'
                  />
                  <SimpleLineChart 
                    xValues={data![0]} 
                    yValues={data![5]} 
                    xLabel='Game' 
                    yLabel='Time (sec)'
                  />
                </Box>                   
              }
            </Box>
          </Grid>

          <Grid item xs={2}></Grid>
        </Grid>
      </Stack>
    </Container>
  </>
}