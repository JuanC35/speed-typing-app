import { styled, Select } from "@mui/material";

export const CustomSelect = styled(Select)(({ theme }) => ({
  '&:hover': {
    backgroundColor: `${theme.palette.secondary.main}`,
  }
}));
