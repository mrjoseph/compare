import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { ImageCarousel } from '../image-carousel/image-carousel'
import DoneIcon from '@mui/icons-material/Done'
import NextLink from 'next/link' // Alias one of the imports as NextLink
import { Divider, Grid, Link, Link as MuiLink, Stack } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import { Avatar } from '@mui/material'
import Hidden from '@mui/material/Hidden'

import { CalculatedPropertyResults } from '@/types'

type Props = {
  property: CalculatedPropertyResults
  view: string
}

export const PropertyCard = ({ property, view }: Props) => {
  const formatCurrency = (value: number) =>
    `£${Math.floor(value).toLocaleString()}`

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} sm={12} md={4}>
        <ImageCarousel images={property.images} />

        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
          padding={1}
          divider={<Divider />}
          sx={{ display: { lg: 'none' } }}
        >
          <Typography variant="h6" color="text.primary" component="p">
            {property.displayAddress}
          </Typography>
          <Typography variant="body2" color="text.primary" component="p">
            {property.price}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={12} md={8}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="strong">
              Rent
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.monthlyRentalIncome}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} padding={2}>
            <Link href={`${property.url}`} target="blank">
              Link
            </Link>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Repayment
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.repaymentType === 'interestOnly'
                ? 'Interest only'
                : 'Repayment'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Interest Rate
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.loanInterest}%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Deposit
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.deposit}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Loan
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.loan}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Monthly costs
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.monthlyOperatingCosts}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Stamp Duty
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {`£${property.stampDuty.STAMP_DUTY_TO_PAY.toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Setup fees
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {`£${property.setupFees.toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={4} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Profit over mortage term of {property.mortgageTerm} years
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.totalProfitAfterSetupFees}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6} padding={2}>
            <Typography variant="body1" color="text.primary" component="p">
              Profit over mortage term of {property.mortgageTerm} years - Stamp Duty
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              {property.totalProfitAfterSetupFeesAndStampDuty}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={0}>
          <Grid item xs={6} sm={4} md={4}>
            <List>
              {/* <ListItem>
                  <ListItemText
                    primary="Monthly rental income"
                    secondary={property.monthlyRentalIncome}
                  />
                </ListItem> */}
              <ListItem>
                <ListItemText
                  primary="Annual rental income"
                  secondary={property.annualRentalIncome}
                />
              </ListItem>
              {/* <ListItem>
                  <ListItemText
                    primary="Monthly operating costs"
                    secondary={property.monthlyOperatingCosts}
                  />
                </ListItem> */}
              <ListItem>
                <ListItemText
                  primary="Rental yield"
                  secondary={`${property.rentalYield}%`}
                />
              </ListItem>
              {/* <ListItem>
                  <ListItemText
                    primary="Repayment type"
                    secondary={
                      property.repaymentType === 'interestOnly'
                        ? 'Interest only mortgage'
                        : 'Repayment mortgage'
                    }
                  />
                </ListItem> */}
              <ListItem>
                <ListItemText
                  primary="Repayment period"
                  secondary={`${property.repaymentPeriod} years`}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <List>
              {/* <ListItem>
                  <ListItemText
                    primary="Deposit"
                    secondary={property.deposit}
                  />
                </ListItem> */}
              {/* <ListItem>
                  <ListItemText primary="Loan" secondary={property.loan} />
                </ListItem> */}
              <ListItem>
                <ListItemText
                  primary="Monthly mortgage"
                  secondary={`£${Math.floor(property.monthlyMortgage)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Interest rate"
                  secondary={`${property.loanInterest}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Loan to value (LTV)"
                  secondary={`${Math.floor(property.ltv)}%`}
                />
                {Math.floor(property.ltv) <= 75 ? (
                  <DoneIcon color="success" />
                ) : (
                  'no'
                )}
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Monthly profit"
                  secondary={formatCurrency(
                    property.profitAfterExpensesMonthly,
                  )}
                />
                {property.profitAfterExpensesMonthly > 500 ? (
                  <DoneIcon color="success" />
                ) : (
                  'no'
                )}
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Yearly profit"
                  secondary={`${property.profitAfterExpensesYearly} (${property.annualProfitPercentage})`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total investment"
                  secondary={formatCurrency(property.totalInvestment)}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
