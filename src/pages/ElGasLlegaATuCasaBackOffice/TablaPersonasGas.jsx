/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, TextField, useTheme } from "@mui/material";
import axios from "../../config/axios";
import { DataGrid, esES } from "@mui/x-data-grid";
import useStore from "../../Zustand/Zustand";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import logoMuni from "../../assets/logoMuni-sm.png";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const TablaPersonasGas = () => {
  const [filtered, setFiltered] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useStore();
  console.log(user);
  //Funcion para listar las convocatorias
  useEffect(() => {
    obtenerUsuariosGas();
  }, []);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();

    const filtered = usuarios?.filter((row) =>
      Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(lowerSearch)
      )
    );

    setFiltered(filtered);
  }, [searchText, usuarios]);

  const obtenerUsuariosGas = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/gas/obtenerUsuariosGas");
      console.log(res.data.usuarios);
      setUsuarios(res.data.usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const formatearFechaHora = (fechaIso) => {
    if (!fechaIso) return "";
    const [year, month, day] = fechaIso.slice(0, 10).split("-");
    const hora = fechaIso.slice(11, 16);
    return `${day}-${month}-${year} ${hora}`;
  };

  const columnas = [
    {
      headerName: "ID",
      field: "id_persona_gas",
      width: 50,
      headerAlign: "center",
      align: "center",
      minWidth: 60,
      maxWidth: 100,
    },
    {
      headerName: "Apellido y Nombre",
      field: "nombreCompleto",
      width: 240,
      headerAlign: "center",
      align: "left",
      minWidth: 200,
      maxWidth: 350,
      valueGetter: (params) => {
        return `${params.row.apellido_persona_gas || ""} ${
          params.row.nombre_persona_gas || ""
        }`.trim();
      },
    },
    {
      headerName: "Localidad",
      field: "localidad",
      width: 120,
      headerAlign: "center",
      align: "left",
      minWidth: 100,
    },
    {
      headerName: "Barrio",
      field: "barrio",
      width: 120,
      headerAlign: "center",
      align: "left",
      minWidth: 100,
    },
    {
      headerName: "Calle",
      field: "domicilio_persona",
      width: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      headerName: "Núm/Sec",
      field: "numero_sec",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Piso/Mz",
      field: "piso_mz",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Dpto/Casa",
      field: "depto_casa",
      width: 90,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
    },
    {
      headerName: "C. P.",
      field: "codigo_postal",
      width: 40,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Teléfono",
      field: "telefono_persona_gas",
      width: 100,
      headerAlign: "center",
      align: "left",
    },
    {
      headerName: "Email",
      field: "email_persona_gas",
      width: 220,
      headerAlign: "center",
      align: "left",
      maxWidth: 300,
    },
    {
      headerName: "Red",
      field: "red_gas",
      width: 60,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        if (params.value == 1) return "Sí";
        if (params.value == 0) return "No";
        return "No Sé";
      },
    },
    {
      headerName: "Cant.",
      field: "cantidad_personas",
      width: 40,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Fecha de Carga",
      field: "fecha_carga",
      width: 120,
      headerAlign: "center",
      align: "center",
      minWidth: 140,
      valueFormatter: (params) => formatearFechaHora(params.value),
    },
  ];

  const imprimirTabla = () => {
    console.log("imprimirTabla: start", new Date().toISOString());
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
    const logoHeight = 50;

    const img = new window.Image();
    img.src = logoMuni;

    img.onload = () => {
      console.log("imprimirTabla: img loaded");
      doc.addImage(img, "PNG", 40, 20, logoWidth, logoHeight);

      try {
        doc.setFontSize(18);
        const title = "Registro de Personas Gas";
        const textWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - textWidth) / 2, 50);

        // columnas que querés en el PDF
        const columns = [
          { header: "ID", dataKey: "id_persona_gas" },
          { header: "Apellido y Nombre", dataKey: "nombreCompleto" },
          { header: "Localidad", dataKey: "localidad" },
          { header: "Barrio", dataKey: "barrio" },
          { header: "Calle", dataKey: "domicilio_persona" },
          { header: "Núm/Sec", dataKey: "numero_sec" },
          { header: "Piso/Mz", dataKey: "piso_mz" },
          { header: "Dpto/Casa", dataKey: "depto_casa" },
          { header: "C.P.", dataKey: "codigo_postal" },
          { header: "Teléfono", dataKey: "telefono_persona_gas" },
          { header: "Email", dataKey: "email_persona_gas" },
          { header: "Red", dataKey: "red_gas" },
          { header: "Cant.", dataKey: "cantidad_personas" },
          { header: "Fecha de Carga", dataKey: "fecha_carga" },
        ];

        // preparar filas con los mismos datos que ves en la tabla
        const rows = filtered.map((row) => ({
          id_persona_gas: row.id_persona_gas,
          nombreCompleto: `${row.apellido_persona_gas || ""} ${
            row.nombre_persona_gas || ""
          }`.trim(),
          localidad: row.localidad,
          barrio: row.barrio,
          domicilio_persona: row.domicilio_persona,
          numero_sec: row.numero_sec,
          piso_mz: row.piso_mz,
          depto_casa: row.depto_casa,
          codigo_postal: row.codigo_postal,
          telefono_persona_gas: row.telefono_persona_gas,
          email_persona_gas: row.email_persona_gas,
          red_gas:
            row.red_gas === 1 ? "Sí" : row.red_gas === 0 ? "No" : "No Sé",
          cantidad_personas: row.cantidad_personas,
          fecha_carga: formatearFechaHora(row.fecha_carga),
        }));

        autoTable(doc, {
          startY: 75,
          head: [columns.map((col) => col.header)],
          body: rows.map((row) => columns.map((col) => row[col.dataKey])),
          styles: { fontSize: 8, halign: "center" },
          headStyles: { fillColor: [31, 137, 246], halign: "center" },
          columnStyles: {
            1: { halign: "left" }, // nombre
            9: { halign: "left" }, // teléfono
            10: { halign: "left" }, // email
          },
          margin: { left: 40, right: 40 },
          tableWidth: "auto",
          didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(7);

            const fecha = new Date();
            const datos = [
              `Usuario: ${user?.apellido_persona || ""} ${
                user?.nombre_persona || ""
              }`,
              `Fecha: ${fecha.toLocaleDateString()}`,
              `Hora: ${fecha.toLocaleTimeString()}`,
            ];
            const textoPie = datos.join("    ");

            const y = doc.internal.pageSize.getHeight() - 30;
            doc.text(textoPie, data.settings.margin.left, y);

            const paginado = `Página ${
              doc.internal.getCurrentPageInfo().pageNumber
            } de ${pageCount}`;
            doc.text(
              paginado,
              doc.internal.pageSize.getWidth() - data.settings.margin.right,
              y,
              { align: "right" }
            );
          },
        });

        const pdfUrl = doc.output("bloburl");
        window.open(pdfUrl, "_blank");
      } catch (err) {
        console.error("imprimirTabla: error durante generación PDF", err);
      }
    };

    img.onerror = (e) => {
      console.error("imprimirTabla: img.onerror", e);
      alert("No se pudo cargar el logo para la impresión.");
    };
    console.log("imprimirTabla: end (async image load pending)");
  };

  const exportarExcel = () => {
    const data = filtered.map((row) => ({
      ID: row.id_persona_gas,
      "Apellido y Nombre": `${row.apellido_persona_gas || ""} ${
        row.nombre_persona_gas || ""
      }`.trim(),
      Localidad: row.localidad,
      Barrio: row.barrio,
      Calle: row.domicilio_persona,
      "Núm/Sec": row.numero_sec,
      "Piso/Mz": row.piso_mz,
      "Dpto/Casa": row.depto_casa,
      "C.P.": row.codigo_postal,
      Teléfono: row.telefono_persona_gas,
      Email: row.email_persona_gas,
      Red: row.red_gas === 1 ? "Sí" : row.red_gas === 0 ? "No" : "No Sé",
      Cantidad: row.cantidad_personas,
      "Fecha de Carga": formatearFechaHora(row.fecha_carga),
    }));

    // generar hoja
    const ws = XLSX.utils.json_to_sheet(data);

    // 👇 autoajuste de columnas
    const colWidths = Object.keys(data[0]).map((key) => {
      const maxLength = data.reduce((len, row) => {
        const cellValue = row[key] ? row[key].toString() : "";
        return Math.max(len, cellValue.length);
      }, key.length);
      return { wch: maxLength + 2 }; // +2 para margen
    });
    ws["!cols"] = colWidths;

    // crear libro y agregar hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Personas Gas");

    // nombre del archivo con fecha
    const now = new Date();
    const fecha =
      String(now.getDate()).padStart(2, "0") +
      String(now.getMonth() + 1).padStart(2, "0") +
      now.getFullYear();
    const fileName = `personas_gas_${fecha}.xlsx`;

    // exportar archivo
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <div className=" d-flex justify-content-end mt-3"></div>
      <div className="mt-5 mb-5 ">
        <div className="ps-5 ms-3">
          <TextField
            label="Buscar"
            type="text"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="medium"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="ms-4 mb-3"
          />
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ ml: 2, p: 1, borderRadius: 3 }}
            onClick={exportarExcel}
            disabled={loading || filtered.length === 0}
          >
            <DownloadIcon
              fontSize="small"
              sx={{ color: "white", fontSize: 27 }}
            />
          </Button>

          <Button
            variant="contained"
            onClick={imprimirTabla}
            sx={{
              borderRadius: 3,
              ml: 1,
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            <LocalPrintshopIcon sx={{ fontSize: 32 }} />
          </Button>
        </div>

        <DataGrid
          rows={filtered}
          columns={columnas}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 100, page: 0 },
            },
          }}
          getRowId={(row) => row.id_persona_gas}
          pageSizeOptions={[100, 200, 500]}
          autoHeight
          sx={{
            width: "90%",
            alignSelf: "center",
            justifySelf: "center",
            height: "400px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "50px",
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.8rem",
              backgroundColor: "#1f89f6",
              color: "white",
              fontWeight: 400,
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.675rem",
            },
          }}
          localeText={{
            ...esES.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: "Sin información disponible",
          }}
        />
      </div>
    </>
  );
};

export default TablaPersonasGas;
