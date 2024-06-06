import { Dialog, Stack, Typography, Button } from "@mui/material";

export function EndGameDialog() {

  return <>
    <Dialog open={true} fullWidth={true} sx={{ height: '300px' }}>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h2'>Game Finished</Typography>

        <Button variant='contained' sx={{ width:'100px', height:'40px' }}>Back</Button>
      </Stack>
    </Dialog>
  </>
}