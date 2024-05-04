import { ThemeOptions } from '@mui/material/styles'
import {
  secondary,
  surface,
  primary,
  green,
  white,
  status,
  accent,
  blue,
  gold,
  magenta,
  black,
  error,
  warning,
} from './colour'

export type ColorProps = {
  [key: string]: {
    [key: string]: string
  }
}

export type GSKPalette = {
  color: ColorProps
  status: {
    'in progress': string
    'partially provisioned': string
    provisioned: string
    draft: string
    failed: string
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    gsk: GSKPalette
  }

  interface PaletteOptions {
    gsk: GSKPalette
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    mid: true
  }
}

export const GSKTheme = (): ThemeOptions | undefined => ({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: white[900],
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: accent[500],
          backgroundColor: 'transparent',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: white[900],
          borderBottom: '1px solid',
          borderBottomColor: secondary[400],
          boxShadow: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          color: secondary[900],
          background: surface.default,
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: {
            variant: 'outlined',
          },
          style: {
            borderColor: primary[800],
            color: primary[800],
            background: 'transparant',
            border: `2px solid ${primary[800]}`,
            '&:hover': {
              backgroundColor: `${green.mid}`,
              border: `2px solid ${primary[800]}`,
            },
            '&:active': {
              backgroundColor: `${green.light}`,
              border: `2px solid ${primary[800]}`,
            },
          },
        },
        {
          props: {
            variant: 'text',
          },
          style: {
            borderColor: primary[800],
            color: primary[800],
            background: 'transparant',
            '&:hover': {
              backgroundColor: `${green.mid}`,
              border: `2px solid transaprent`,
            },
            '&:active': {
              backgroundColor: `${green.light}`,
              border: `2px solid transaprent`,
            },
          },
        },
        {
          props: {
            variant: 'contained',
          },
          style: {
            borderColor: primary[800],
            color: white[900],
            background: primary[800],
            '&:hover': {
              backgroundColor: primary[700],
            },
            '&:active': {
              backgroundColor: primary[800],
            },
          },
        },
        {
          props: { variant: 'mid' },
          style: {
            borderColor: primary[800],
            color: white[900],

            background: primary[800],
            '&:hover': {
              backgroundColor: primary[700],
            },
            '&:active': {
              backgroundColor: primary[800],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          borderRadius: 28,
          boxShadow: 'none',
          fontSize: '1rem',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {},
    },
  },
  palette: {
    primary: {
      main: primary[800],
    },
    background: {
      default: surface.light,
      paper: surface.light,
    },
    text: {
      primary: 'rgb(25, 25, 25)',
      secondary: 'rgb(75,75,75)',
    },
    gsk: {
      color: {
        primary,
        secondary,
        surface,
        accent,
        blue,
        magenta,
        status,
        green,
        gold,
        white,
        black,
        error,
        warning,
      },
      status: {
        provisioned: status.provisioned,
        'in progress': status['in progress'],
        'partially provisioned': status['partially provisioned'],
        draft: status.draft,
        failed: status.failed,
      },
    },
  },
})