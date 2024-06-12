import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { EnhancedTableToolbar } from './enhancedTableToolbar'
import Link from '@mui/material/Link'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { PropertyCard } from '../property-card/property-card'
import Button from '@mui/material/Button'
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
const styleSx = { display: { xs: 'none', sm: 'none', md: 'table-cell' } }
const styleSxSm = {
  display: { xs: 'none', sm: 'table-cell', md: 'table-cell' },
}
const styleSxLg = {
  display: { xs: 'none', sm: 'none', md: 'none', lg: 'table-cell' },
}
const headCells = [
  {
    id: 'propertyName',
    numeric: false,
    disablePadding: true,
    label: 'Property Name',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: true,
    label: 'price',
    style: styleSxLg,
  },
  {
    id: 'rentalYield',
    numeric: false,
    disablePadding: false,
    label: 'Yield',
    style: styleSxSm,
  },
  {
    id: 'monthlyCashFlow',
    numeric: true,
    disablePadding: false,
    label: 'Cash Flow (M)',
    style: styleSxLg,
  },
  {
    id: 'yearlyCashFlow',
    numeric: true,
    disablePadding: false,
    label: 'Cash Flow(Y)',
    style: styleSxLg,
  },
  {
    id: 'monthlyMortgage',
    numeric: true,
    disablePadding: false,
    label: 'Mortgage(M)',
    style: styleSx,
  },
  {
    id: 'profitAfterExpensesMonthly',
    numeric: true,
    disablePadding: false,
    label: 'Profit(M)',
    style: styleSx,
  },
  {
    id: 'profitAfterExpensesYearly',
    numeric: true,
    disablePadding: false,
    label: 'Profit(Y)',
    style: styleSx,
  },
  {
    id: 'ltv',
    numeric: true,
    disablePadding: false,
    label: 'LTV',
    style: styleSxSm,
  },
  {
    id: 'monthlyRentalIncome',
    numeric: true,
    disablePadding: false,
    label: 'Rent(M)',
    style: styleSxLg,
  },
  {
    id: 'coverage',
    numeric: true,
    disablePadding: false,
    label: 'Coverage 145%',
    style: styleSxSm,
  },
  {
    id: 'edit',
    numeric: true,
    disablePadding: false,
    label: 'edit',
    style: styleSxSm,
  },
]
//averageAnnualROI
function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={headCell.style}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: 'bold' }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export const ResultsTable = ({ results, handleDelete, handleExpand }) => {
  const rows = results
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(25)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const onDelete = () => {
    handleDelete(selected)
  }
  const onEdit = (e, id) => {
    e.stopPropagation()
    console.log('edit', id)
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  )
  const [open, setOpen] = React.useState(rows.map(() => false))
  return (
    <Box sx={{ width: '100%', pt: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }} elevation={0}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          onDelete={onDelete}
        />
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={'large'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <React.Fragment key={`row-${index}-${row.id}`}>
                    <TableRow
                      hover
                      onClick={() => {
                        setOpen((prev) => {
                          const newState = [...prev]
                          newState[index] = !newState[index]
                          return newState
                        })
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer', position: 'relative' }}
                    >
                      <TableCell padding="checkbox" sx={{ zIndex: 1 }}>
                        <Checkbox
                          onClick={(event) => {
                            event.stopPropagation()
                            handleClick(event, row.id)
                          }}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                        {/* <IconButton aria-label="expand row" size="small">
                          {open ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton> */}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.displayAddress}
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={styleSxLg}
                      >
                        {row.price}
                      </TableCell>

                      <TableCell align="left" sx={styleSxSm}>
                        {row.rentalYield}%
                      </TableCell>
                      <TableCell align="right" sx={styleSxLg}>
                        {row.monthlyCashFlow}
                      </TableCell>
                      <TableCell align="right" sx={styleSxLg}>
                        {row.yearlyCashFlow}
                      </TableCell>
                      <TableCell align="right" sx={styleSx}>
                        £{Math.floor(row.monthlyMortgage)}
                      </TableCell>
                      <TableCell align="right" sx={styleSx}>
                        £{Math.floor(row.profitAfterExpensesMonthly)}
                      </TableCell>
                      <TableCell align="right" sx={styleSx}>
                        {row.profitAfterExpensesYearly}
                      </TableCell>
                      <TableCell align="right" sx={styleSxSm}>
                        {Math.floor(row.ltv)}%
                      </TableCell>

                      <TableCell align="right" sx={styleSxLg}>
                        {row.monthlyRentalIncome}
                      </TableCell>
                      <TableCell align="right" sx={styleSxSm}>
                        {row.coverage}
                      </TableCell>

                      <TableCell align="right" sx={styleSxLg}>
                        <Button onClick={(e) => onEdit(e, row.id)}>edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={13}
                      >
                        <Collapse in={open[index]} timeout="auto">
                          <PropertyCard property={row} view="summary" />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33,
                  }}
                >
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 20, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
