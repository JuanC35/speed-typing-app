import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import { Statistics } from "../../reducers/userReducer";
import React, { useState } from "react";

type TableDataProps = {
  statistics: Statistics[],
}

export function TableData({ statistics }: TableDataProps) {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  function handleChangePage(_: unknown, newPage: number) {
    setPage(newPage);
    console.log(newPage);
  }

  function handleChangeRowsPerPage(e: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  const visibleRows = statistics.slice((page * rowsPerPage), (page * rowsPerPage) + rowsPerPage);

  return <>
    <TableContainer component={Box}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Game</TableCell>
            <TableCell align='right'>Accuracy (%)</TableCell>
            <TableCell align='right'>Correct Words</TableCell>
            <TableCell align='right'>Speed (wpm)</TableCell>
            <TableCell align='right'>Max Speed (wpm)</TableCell>
            <TableCell align='right'>Time (sec)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((row, i) => (
            <TableRow
             key={i}
             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>{i + 1 + (page * rowsPerPage)}</TableCell>
              <TableCell align='right'>{row.accuracy}</TableCell>
              <TableCell align='right'>{row.numWords}</TableCell>
              <TableCell align='right'>{row.speed}</TableCell>
              <TableCell align='right'>{row.maxSpeed}</TableCell>
              <TableCell align='right'>{row.fast}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination 
      component='div'
      rowsPerPageOptions={[10, 25, 50]}
      count={statistics.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </>
}