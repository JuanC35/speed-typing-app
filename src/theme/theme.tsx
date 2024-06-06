import { createTheme } from "@mui/material";

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    custom: true;
  }
}

declare module '@mui/material/Avatar' {
  interface AvatarPropsVariantOverrides {
    large: true;
  }
}

declare module '@mui/material/styles' {
  interface PaletteColorOptions {
    main?: string;
  }
}

export let theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(25, 118, 210)',
    },
    secondary: {
      main: 'rgb(50, 200, 190)',
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'custom' },
          style: {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            width: '150px',
            height: '40px',
            marginTop: '10px',
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
            }
          }
        }
      ]
    },

    MuiAvatar: {
      variants: [
        {
          props: { variant: 'large' },
          style: {
            width: '150px',
            height: '150px',
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
            }
          }
        }
      ]
    },
  }
});