import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  minWidth:500,
  p: 4,
}

export default function BasicModal({ property }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Button onClick={handleOpen}>view table§§§</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
        
        }}
      >
        <Box sx={style}>
          <Typography>
            <strong>Price:</strong> {property.price}
          </Typography>
          <Typography>
            <strong>Address:</strong> {property.displayAddress}
          </Typography>
          <Typography>
            <strong>LTV:</strong> {property.ltv.toFixed()}%
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}
