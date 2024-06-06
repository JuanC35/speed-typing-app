import { CircularProgress, Container, Stack } from "@mui/material";

export default function Loading() {
  return <Container maxWidth='xl'>
    <Stack alignItems='center' justifyContent='center'>
      <CircularProgress />
    </Stack>
  </Container>
}