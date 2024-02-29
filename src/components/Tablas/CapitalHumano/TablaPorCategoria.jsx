import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import useStore from '../../../Zustand/Zustand';
import { Button } from '@mui/material';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const [cabeceras,setCabeceras] = React.useState([])
    const { resultSearch } = useStore();
    // eslint-disable-next-line react/prop-types
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, copiaResultSearch } =
      props;

  React.useEffect(() => {
    if(resultSearch.length > 0){
        const valoresUnicos = [
            // eslint-disable-next-line react/prop-types
            ...new Set(copiaResultSearch[0].filter(o=>o.CODI_10 >=18 && o.CODI_10<=24).map((objeto) => objeto.CODI_10)),
          ];
    
          const primeraColumnaReparticion = "Repartición";
          const valoresUnicosOrdenados = [
            primeraColumnaReparticion,
            ...valoresUnicos.sort((a, b) => a - b),
          ];
    
          setCabeceras(valoresUnicosOrdenados);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {cabeceras.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell}
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

export default function TablaPorCategoria() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const { resultSearch,setResultSearch, setFlagCategoriasFuncionarios} = useStore();
  const [copiaResultSearch] = React.useState(resultSearch)
  const [filas,setFilas] = React.useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = () => {
    setResultSearch(copiaResultSearch[0])
    setSelected([]);
  };

  const handleClick = (event, row) => {
   
   setResultSearch(copiaResultSearch[0].filter(rs=>rs.deta_07.includes(row.Repartición)))
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];
  
    if (selectedIndex === -1) {
      // Si no está seleccionado, selecciona el nuevo
      newSelected = [row];
    } else {
      // Si ya está seleccionado, deselecciona todos
      newSelected = [];
      setResultSearch(copiaResultSearch[0]);
    }
  
    setSelected(newSelected);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;


  React.useEffect(() => {
    if (copiaResultSearch.length > 0) {
      const valoresUnicos = [
        ...new Set(copiaResultSearch[0].filter(o=>o.CODI_10 >=18 && o.CODI_10<=24).map((objeto) => objeto.CODI_10)),
      ];

      const primeraColumnaReparticion = "Repartición";
      const valoresUnicosOrdenados = [
        primeraColumnaReparticion,
        ...valoresUnicos.sort((a, b) => a - b),
      ];

      const datosOrganizados = {};

      copiaResultSearch[0].forEach((dato) => {
        const reparticion = dato.deta_07;
        if (!datosOrganizados[reparticion]) {
          datosOrganizados[reparticion] = { Repartición: reparticion };
        }
        datosOrganizados[reparticion][dato.CODI_10] = dato[""];
      });

    const filasTabla = Object.keys(datosOrganizados).map((reparticion) => {
      const fila = { Repartición: reparticion };
  
      valoresUnicosOrdenados.forEach((columna) => {
          if (columna === 18) {
              // Sumar los valores de las columnas 15, 16 y 17 y asignar a la columna 18
              fila[columna] = (datosOrganizados[reparticion][columna] || 0) +
                              (datosOrganizados[reparticion][15] || 0) +
                              (datosOrganizados[reparticion][16] || 0) +
                              (datosOrganizados[reparticion][17] || 0);
          } else {
              // Para otras columnas, asignar el valor directamente
              fila[columna] = datosOrganizados[reparticion][columna] || 0;
          }
      });
  
      return fila;
  });  
     
filasTabla.forEach((objeto) => {
  for (const key in objeto) {
    const value = objeto[key];
    
    if (parseInt(key) === 15 || parseInt(key) === 16 || parseInt(key) === 17) {
            // Suma el valor a la categoría 18 y elimina la propiedad
            objeto[18] = (objeto[18] || 0) + value;
            delete objeto[key];
          }
       
          if (parseInt(key) >= 50) {
            delete objeto[key];
          }
        }
      });
      
      setFilas(
        filasTabla.map((fila) => {
          const filaOrdenada = {};
          valoresUnicosOrdenados.forEach((columna) => {
            filaOrdenada[columna] = fila[columna];
          });
          return filaOrdenada;
        })
      );

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiaResultSearch]);

  const visibleRows = stableSort(filas, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      )
  
  return (
    <Box sx={{ width: '100%' }}>
      <Button onClick={()=>setFlagCategoriasFuncionarios(true)}>Funcionarios</Button>
      <Switch onClick={()=>setFlagCategoriasFuncionarios(true)}/>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={resultSearch[0].length}
              copiaResultSearch={copiaResultSearch}
            />
            {
            filas.length > 0 &&
            <TableBody>
              {visibleRows.map((row, index) => {
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
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                   
                    <TableCell >{row.Repartición}</TableCell>
                    <TableCell >{row[18]}</TableCell>
                    <TableCell >{row[19]}</TableCell>
                    <TableCell >{row[20]}</TableCell>
                    <TableCell >{row[21]}</TableCell>
                    <TableCell >{row[22]}</TableCell>
                    <TableCell >{row[23]}</TableCell>
                    <TableCell >{row[24]}</TableCell>
                  </TableRow>
                );
              })}
       
            </TableBody>
            }
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Comprimir tabla"
      />
    </Box>
  );
}