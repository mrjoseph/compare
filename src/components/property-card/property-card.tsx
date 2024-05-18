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

import NextLink from 'next/link' // Alias one of the imports as NextLink
import { Grid, Link as MuiLink } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import { Avatar } from '@mui/material'
import Hidden from '@mui/material/Hidden'

import { CalculatedPropertyResults, Response } from '@/types'

type CombinedProps = CalculatedPropertyResults & Response
type Props = {
  property: CombinedProps
  view: string
}

export const PropertyCard = ({ property, view }: Props) => {
  const formatCurrency = (value: number) =>
    `£${Math.floor(value).toLocaleString()}`

  return (
    <Card elevation={0} sx={{ mb: 2 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={4}>
          <ImageCarousel images={property.images} />

          <Grid item xs={12} sm={12} md={8}>
            <List>
              <ListItem>
                <ListItemText
                  secondary={
                    <>
                      <Typography
                        variant="h6"
                        color="text.primary"
                        component="h3"
                      >
                        {property.displayAddress} {property.price}
                      </Typography>
                      <MuiLink href={property.url}>Rightmove</MuiLink>
                    </>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {view === 'summary' && (
          <Grid item xs={12} sm={12} md={8}>
            {/* <List>
              <ListItem>
                <ListItemText
                  secondary={
                    <>
                      <Typography
                        variant="h5"
                        color="text.primary"
                        component="h4"
                      >
                        {property.displayAddress} {property.price}
                      </Typography>
                      <MuiLink href={property.url}>Rightmove</MuiLink>
                    </>
                  }
                />
              </ListItem>
            </List> */}
            <Grid container spacing={0}>
              <Grid item xs={12} sm={4} md={4}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Monthly rental income"
                      secondary={property.monthlyRentalIncome}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Annual rental income"
                      secondary={property.annualRentalIncome}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Monthly operating costs"
                      secondary={property.monthlyOperatingCosts}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Rental yield"
                      secondary={`${property.rentalYield}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Repayment type"
                      secondary={
                        property.repaymentType === 'interestOnly'
                          ? 'Interest only mortgage'
                          : 'Repayment mortgage'
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Deposit"
                      secondary={property.deposit}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Loan" secondary={property.loan} />
                  </ListItem>
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
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Monthly profit after expenses"
                      secondary={formatCurrency(
                        property.profitAfterExpensesMonthly,
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Yearly profit after expenses"
                      secondary={property.profitAfterExpensesYearly}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total investment"
                      secondary={formatCurrency(property.totalInvestment)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Profit (%) per year"
                      secondary={property.annualProfitPercentage}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Repayment period"
                      secondary={`${property.repaymentPeriod} years`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}
