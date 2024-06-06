import { Container, Stack, Box, Input, InputLabel, Button, FormHelperText, Typography, Link } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { UserType } from "../../reducers/userReducer";
import { InfoOutlined } from "@mui/icons-material";
import { ActionsGameApp, ActionsGame, PagesRoutes } from "../../reducers/gameReducer";
import hashString from "../../util/hashPassword";

export type FetchData = {
  id: number,
  text: UserType
}[];

type SignInPageProps = {
  dispatchGame: React.Dispatch<ActionsGameApp>,
  getUsers: <T>() => Promise<T>
}

export default function SignInPage({ dispatchGame, getUsers }: SignInPageProps) {
  const [fieldsCompleted, setFieldsCompleted] = useState<boolean>(true);
  const [data, setData] = useState<FetchData>([]);

  const name = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async function() {
      const users = await getUsers<FetchData>();
      setData(users);
    })();
  }, []);

  function handleSignIn() {
    const nameValue = name.current!.value;
    const passWordValue = password.current!.value;

    for (let i = 0; i < data.length; i++) {
      if (data[i].text.name === nameValue && data[i].text.password === hashString(passWordValue)) {
        dispatchGame({ type: ActionsGame.CURRENT_USER, payload: 
          { name: data[i].text.name, avatar: data[i].text.avatar, statistics: data[i].text.statistics }});
        dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.TYPING_APP }});
      }
    }

    setFieldsCompleted(false);

    setTimeout(() => {
      setFieldsCompleted(true);
    }, 1000);
  }

  return <>
    <Container>
      <Stack direction='column' spacing={4} alignItems='center'>
        <Typography variant='h3'>Speed Typing App</Typography>
        <Typography variant='h4'>Sign In</Typography>
        <Stack spacing={4} sx={{width: '250px'}}>
          <InputLabel>Name: </InputLabel>
          <Input inputRef={name} size='medium' placeholder='Name' required/>
          <InputLabel>Password: </InputLabel>
          <Input inputRef={password} size='medium' placeholder='Password' type='password' required/>

          <Button
            variant='custom'
            onClick={() => handleSignIn()}
          >Sign In</Button>

          <Typography variant='body2'>{`If you do not have and account. Sign up `}
            <Link 
              component='span'
              onClick={() => dispatchGame({ type: ActionsGame.CHANGE_PAGE, payload: { page: PagesRoutes.SIGNUP }})}
              > here.
            </Link>
          </Typography>

          {!fieldsCompleted && 
          <Box>
            <FormHelperText error>
              <InfoOutlined /> 
              Name or password incorrect,
            </FormHelperText>
          </Box>}
        </Stack>
      </Stack>
    </Container>
  </>
}