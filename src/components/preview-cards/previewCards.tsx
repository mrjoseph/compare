import { PropertyPreviewCard } from '../property-preview-card/property-preview-card'
import Box from '@mui/material/Box'
import { Property } from '@/types'
import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'
type Props = {
  propertyDetails: Property[]
  steps?: number
  setSteps?: React.Dispatch<React.SetStateAction<number>>
  calculate?: () => void
}

export const PropertyPreviewCards = ({
  propertyDetails,
  steps,
  setSteps,
  calculate,
}: Props) => {
  console.log(propertyDetails)
  const next = () => {
    calculate && calculate()
    setSteps && steps && setSteps(steps + 1)
  }
  return (
    <>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {propertyDetails.map((property, index) => {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`${property.displayAddress}-${index}`}
            >
              <PropertyPreviewCard property={property} />
            </Grid>
          )
        })}
      </Grid>
      {propertyDetails.length > 0 && (
        <Box alignContent="center" justifyContent='center' display="flex">
          <Button
            disableElevation
            disabled={propertyDetails.length === 0 ? true : false}
            size="small"
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={next}
          >
            Next
          </Button>
        </Box>
      )}
    </>
  )
}
