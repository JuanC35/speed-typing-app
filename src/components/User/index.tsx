import { Avatar, Stack, Typography } from "@mui/material";
import styles from './styles.module.css';

type UserProps = {
  avatar: string | null,
  name: string | null,
  words?: number | null,
  speed?: number | null,
  maxSpeed?: number | null,
  accuracy?: number | null,
  gameEnds?: boolean,
}

export default function User({ avatar, name, words, speed, maxSpeed, accuracy, gameEnds }: UserProps) {

  return <>
    <Stack direction='column' justifyContent='center' alignItems='center' width='250px'>
      <Avatar variant='large' className={styles.avatar} src={avatar!}/>
      <Typography variant='h3' marginBottom='40px'>{name}</Typography>
        {words !== undefined && 
          <Typography className={styles.stats} variant='h6'>
            <span className={styles.label}>Correct Words: </span> 
            <span className={styles.value}>{gameEnds ? words : 0}</span>
          </Typography>
        }
        {accuracy !== undefined && 
            <Typography className={styles.stats} variant='h6'>
              <span className={styles.label}>Accuracy [%]: </span>
              <span className={styles.value}>{gameEnds ? accuracy?.toFixed(1) : 0}</span>
            </Typography>
        }
        {speed !== undefined && 
            <Typography className={styles.stats} variant='h6'>
              <span className={styles.label}>Speed [wpm]: </span>
              <span className={styles.value}>{gameEnds ? speed?.toFixed(1) : 0}</span>
            </Typography>
        }
        {maxSpeed !== undefined && 
          <Typography className={styles.stats} variant='h6'>
            <span className={styles.label}>Max Speed [wpm]: </span>
            <span className={styles.value}>{gameEnds ? maxSpeed?.toFixed(1): 0}</span>
          </Typography>
        }
    </Stack>
  </>
}