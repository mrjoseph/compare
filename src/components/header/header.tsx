import { Box, Avatar, Typography } from '@mui/material'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import Link from 'next/link'
export const Header = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="/">
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <HouseRoundedIcon />
          </Avatar>
        </Link>
      </Box>
      <Box margin={2}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Buy to let comparison tool
        </Typography>
        <Typography
          component="p"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Copy and paste a Rightmove URL to get started
        </Typography>
      </Box>
    </>
  )
}
