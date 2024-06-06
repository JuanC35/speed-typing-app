import styles from './styles.module.css';
import { useRef, useEffect, useState } from 'react';
import { Avatar, Box, Container, Grid, Stack, Input, Button, Typography, InputLabel, Link } from "@mui/material";
import { UserType } from '../../reducers/userReducer';
import { InfoOutlined } from '@mui/icons-material';
import { ActionsGameApp, ActionsGame, PagesRoutes } from '../../reducers/gameReducer';
import { useRegistration, ActionsRegistration } from '../../reducers/registrationReducer';
import hashString from '../../util/hashPassword';
import { FetchData } from '../SignInPage';

type RegistrationPageProps = {
  avatars: string[],
  dispatchGame: React.Dispatch<ActionsGameApp>,
  saveData: <T>(user: T) => Promise<void>,
  getUsers: <T>() => Promise<T>
}

export default function RegistrationPage({ avatars, dispatchGame, saveData, getUsers }: RegistrationPageProps) {
  const [stateRegistration, dispatchRegistration] = useRegistration();
  const [data, setData] = useState<FetchData>([]);
  
  const name = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const { selectedAvatar, fieldsCompleted, notice } = stateRegistration;

  useEffect(() => {
    (async function() {
      const users = await getUsers<FetchData>();
      setData(users);
    })();
  }, []);

  function handleAvatarClick(i: number) {
    dispatchRegistration({ type: ActionsRegistration.SELECT_AVATAR, payload: { index: i }});
  }

  function handleRegistration() {
    const nameValue = name.current!.value;
    const passwordValue = password.current!.value;
    let nameAvailable = true;

    for (let i = 0; i < data.length; i++) {
      if (data[i].text.name === nameValue) {
        nameAvailable = false;
        break;
      } 
    }

    dispatchRegistration({ type: ActionsRegistration.CHECK_FIELDS, 
      payload: { name: nameValue, password: passwordValue, available: nameAvailable }});
  }

  useEffect(() => {
    if (fieldsCompleted === false) {
      setTimeout(() => {
        dispatchRegistration({ type: ActionsRegistration.SET_FIELDS_COMPLETED, payload: { isFieldsCompleted: null }});
        dispatchRegistration({ type: ActionsRegistration.RESET_NOTICE });
      }, 2000);
    }

    if (fieldsCompleted) {
      const user = {
        name: name.current!.value,
        password: hashString(password.current!.value),
        avatar: avatars[selectedAvatar],
        statistics: []
      }
      saveData<UserType>(user);
     
      dispatchGame({ type: ActionsGame.CURRENT_USER, payload: { name: user.name, avatar: user.avatar, statistics: [] }});
      dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.TYPING_APP }});
    }  
  }, [fieldsCompleted]);

  return <>
    <Container className={`${styles.container}`}>
      <Stack direction='column' spacing={2} alignItems='center' justifyContent='center' sx={{margin: '20px'}}>
        <Typography variant='h3'>Speed Typing App</Typography>
        <Typography variant='h4'>Registration</Typography>
      </Stack>
      <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
        <Box>
          <Grid container maxWidth='sm' maxHeight='lg'>
            {avatars.map((cell, i) => (
              <Grid item xs={5} key={i} sx={{margin: '10px'}}>
                <Avatar
                  variant='large'
                  src={cell} 
                  className={`${i === selectedAvatar ? styles.selectedAvatar : styles.unSelectedAvatar}`}
                  onClick={() => handleAvatarClick(i)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
          
        <Box>
          <Stack direction='column' spacing={1}>
            <InputLabel>Name: </InputLabel>
            <Input inputRef={name} size='medium' placeholder='Name' required/>
              {notice[0] ? 
              <Box>
                <Typography variant='body2' color='red' className={styles.alertNotice}>
                  <InfoOutlined fontSize='small' sx={{marginRight: '5px'}} /> 
                  {notice[0]}
                </Typography>
              </Box> :
              <Box className={styles.emptyAlert}/>
              }

            <InputLabel>Password: </InputLabel>
            <Input inputRef={password} size='medium' placeholder='Password' type='password' required/>
              {notice[1] ? 
              <Box>
                <Typography variant='body2' color='red' className={styles.alertNotice}>
                  <InfoOutlined fontSize='small' sx={{marginRight: '5px'}}/> 
                  {notice[1]}
                </Typography>
              </Box> :
              <Box className={styles.emptyAlert}/>
              }
            
            <Button
              variant='custom'
              onClick={() => handleRegistration()}
            >Sign Up</Button>

            <Typography variant='body2'>If you already have and account.<br />{`Sign in `}
              <Link 
                component='span'
                onClick={() => dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.SIGNIN }})}
                > here.
              </Link>
            </Typography>

            {notice[2] ? 
            <Box>
              <Typography variant='body2' color='red' className={styles.alertNotice}>
                <InfoOutlined fontSize='small' sx={{marginRight: '5px'}}/> 
                {notice[2]}
              </Typography>
            </Box> :
            <Box className={styles.emptyAlert}/>
            }
          </Stack>
        </Box>
      </Stack>
    </Container>
   
  </>
}