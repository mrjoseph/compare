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


type Props = {
  property: Response
  view: string
}

export const PropertyCardPreview = ({ property, view }: Props) => {
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
      </Grid>
    </Card>
  )
}
