/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import useStore from '../../../Zustand/Zustand';



function EnhancedTableHead(props) {
    const [cabeceras, setCabeceras] = React.useState([])
    const { resultSearch } = useStore();
    const { onSelectAllClick, orderBy, numSelected, rowCount, onRequestSort, copiaResultSearch } =
      props;

      React.useEffect(() => {
        
        if( resultSearch.length > 0){
          let arrTotal = [Object.keys(copiaResultSearch[0][0])]
          arrTotal[0].push('Total')
          setCabeceras(arrTotal)
        }
      }, [resultSearch])

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {cabeceras[0]?.map((columnName, index) => (
          <TableCell key={index}>
            <TableSortLabel
              active={orderBy === columnName}
              onClick={createSortHandler(columnName)}
            >
              {columnName}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TablaPlantaMunicipal() {
  const [selected, setSelected] = React.useState([]);
  const [selectedTotal, setSelectedTotal] = React.useState(true);
  const { resultSearch,setResultSearch } = useStore();
  const [copiaResultSearch] = React.useState(resultSearch)

  const sumarColumna = (filas, nombreColumna) => {
    return filas.reduce((total, fila) => {
      const valor = parseInt(fila[nombreColumna], 10);
      return isNaN(valor) ? total : total + valor;
    }, 0);
  };
  const totalizarFilas = (filas) => {
    return filas.map((fila) => {
      const totalFila = Object.values(fila).reduce((subtotal, valor) => {
        const num = parseInt(valor, 10);
        return isNaN(num) ? subtotal : subtotal + num;
      }, 0);
      return totalFila;
    });
  };
  const totalesFilas = totalizarFilas(copiaResultSearch[0]);
  const totalPlanta = totalesFilas[0] + totalesFilas[1]


  const handleSelectAllClick = () => {
    setResultSearch(copiaResultSearch[0]);
    setSelected([]);
    setSelectedTotal(true)
  };  

  const handleClick = (event, row) => {
    setResultSearch(copiaResultSearch[0].filter(rs => rs.sexo.includes(row.sexo)));
    setSelected([]);
    // Seleccionar la fila individual
    setSelected([row]);
    setSelectedTotal(false)
  };
  
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            aria-label="spanning table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={copiaResultSearch.length}
              copiaResultSearch={copiaResultSearch}
            />
            {copiaResultSearch.length > 0 && (
              <TableBody>
                {copiaResultSearch[0].map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.sexo}</TableCell>
                      <TableCell>{row.PLANTA}</TableCell>
                      <TableCell>{row.CONTRATO}</TableCell>
                      <TableCell>{row.FUNCIONARIOS}</TableCell>
                      <TableCell>{totalesFilas[index]}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow 
                  sx={{ cursor: "pointer" }} 
                  hover 
                  role="checkbox" 
                  onClick={handleSelectAllClick}
                  aria-checked={selectedTotal}
                  selected={selectedTotal}
                >
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={selectedTotal}/>
                  </TableCell>
                  <TableCell sx={{fontStyle: 'bold'}}>Total</TableCell>
                  <TableCell align="left">
                    {sumarColumna(copiaResultSearch[0], "PLANTA")}
                  </TableCell>
                  <TableCell align="left">
                    {sumarColumna(copiaResultSearch[0], "CONTRATO")}
                  </TableCell>
                  <TableCell align="left">
                    {sumarColumna(copiaResultSearch[0], "FUNCIONARIOS")}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    {totalPlanta}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}