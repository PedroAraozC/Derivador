import * as React from 'react';
import useStore from '../../Zustand/Zustand';
import { DataGrid } from '@mui/x-data-grid';
import TablaEsqueleto from '../Esqueletos/TablaEsqueleto';

const TablaPlantaPorCatego = () => {
  const { resultSearch } = useStore();
  const [cabeceras,setCabeceras] = React.useState([])
  const [filas,setFilas] = React.useState([])

  React.useEffect(() => {
    if (resultSearch[0].length > 0) {
      const valoresUnicos = [
        ...new Set(resultSearch[0].map((objeto) => objeto.CODI_10)),
      ];

      const primeraColumnaReparticion = "Repartición";
      const valoresUnicosOrdenados = [
        primeraColumnaReparticion,
        ...valoresUnicos.sort((a, b) => a - b),
      ];

      setCabeceras(valoresUnicosOrdenados);

      const datosOrganizados = {};

      resultSearch[0].forEach((dato) => {
        const reparticion = dato.deta_07;
        if (!datosOrganizados[reparticion]) {
          datosOrganizados[reparticion] = { Repartición: reparticion };
        }
        datosOrganizados[reparticion][dato.CODI_10] = dato[""];
      });

      // Construir array de filas para la tabla
      console.log(datosOrganizados);

      const filasTabla = Object.keys(datosOrganizados).map((reparticion) => {
        const fila = { Repartición: reparticion };
        valoresUnicosOrdenados.forEach((columna) => {
          fila[columna] = datosOrganizados[reparticion][columna] || 0;
        });
        return fila;
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
  }, [resultSearch]);

// const mayorWidth = (llave, clave) =>{
//   if(llave > clave){
//     return llave
//   }else{
//     return clave
//   }
// }
  return  (
    <div style={{ height: 270, width: '100%' }}>
      {
        resultSearch[0].length > 0? 
        <DataGrid
        rows={filas.map((rs, index) => ({ ...rs, id: index }))}
        columns={cabeceras.map((c)=>({field:c,width:c=="Repartición" && 370}))}
        getRowId={(row) => row.id} // Especifica cómo obtener el id de cada fila
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
      />
      :
      (
        <TablaEsqueleto/>
      )
      }
    </div>
  );
}

export default TablaPlantaPorCatego