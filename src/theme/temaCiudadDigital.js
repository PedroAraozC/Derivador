import { createTheme } from "@mui/material/styles";

// Tema MUI del nuevo aspecto "Ciudad Digital".
// Sólo define apariencia: colores, radios, sombras, tipografía y overrides visuales.
// `crearTema(modo)` devuelve la variante clara u oscura; los valores de cada modo
// deben mantenerse alineados con los tokens --cd-* de src/styles/ciudadDigital.css.
const FUENTE =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Inter, Roboto, system-ui, sans-serif';

const ACENTO = "#1f89f6";
const FOCO = "0 0 0 4px rgba(31, 137, 246, 0.14)";
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

const PALETAS = {
  light: {
    fondo: "#f4f6fb",
    papel: "#ffffff",
    superficieSuave: "#f8fafc",
    texto: "#0f172a",
    texto2: "#475569",
    texto3: "#94a3b8",
    borde: "rgba(15, 23, 42, 0.08)",
    bordeInput: "rgba(15, 23, 42, 0.14)",
    bordeInputHover: "rgba(15, 23, 42, 0.28)",
    bordeCelda: "rgba(15, 23, 42, 0.06)",
    hover: "rgba(15, 23, 42, 0.04)",
    hoverOutlined: "rgba(15, 23, 42, 0.03)",
    iconoApagado: "rgba(15, 23, 42, 0.3)",
    acentoSuave: "#e8f2fe",
    acentoFuerte: "#0b63c9",
    pistaSwitch: "#cbd5e1",
    thumbDeshabilitado: "#f1f5f9",
    tooltipFondo: "rgba(15, 23, 42, 0.92)",
    tooltipTexto: "#ffffff",
    backdrop: "rgba(15, 23, 42, 0.38)",
    sombraSm:
      "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 14px rgba(15, 23, 42, 0.05)",
    sombraMd:
      "0 2px 6px rgba(15, 23, 42, 0.05), 0 14px 36px rgba(15, 23, 42, 0.09)",
    sombraModal:
      "0 24px 64px rgba(15, 23, 42, 0.22), 0 2px 8px rgba(15, 23, 42, 0.08)",
    sombraThumb:
      "0 1px 3px rgba(15, 23, 42, 0.25), 0 3px 8px rgba(15, 23, 42, 0.15)",
    exitoSuave: "#e6f7ec",
    errorSuave: "#fee2e2",
    avisoSuave: "#fdf2dc",
  },
  dark: {
    fondo: "#0b1220",
    papel: "#111a2b",
    superficieSuave: "#172238",
    texto: "#e5e7eb",
    texto2: "#94a3b8",
    texto3: "#64748b",
    borde: "rgba(255, 255, 255, 0.08)",
    bordeInput: "rgba(255, 255, 255, 0.16)",
    bordeInputHover: "rgba(255, 255, 255, 0.3)",
    bordeCelda: "rgba(255, 255, 255, 0.06)",
    hover: "rgba(255, 255, 255, 0.06)",
    hoverOutlined: "rgba(255, 255, 255, 0.05)",
    iconoApagado: "rgba(255, 255, 255, 0.3)",
    acentoSuave: "rgba(31, 137, 246, 0.16)",
    acentoFuerte: "#4da3ff",
    pistaSwitch: "#334155",
    thumbDeshabilitado: "#475569",
    tooltipFondo: "#e2e8f0",
    tooltipTexto: "#0f172a",
    backdrop: "rgba(0, 0, 0, 0.55)",
    sombraSm: "0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.35)",
    sombraMd: "0 2px 6px rgba(0, 0, 0, 0.35), 0 14px 36px rgba(0, 0, 0, 0.5)",
    sombraModal: "0 24px 64px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)",
    sombraThumb: "0 1px 3px rgba(0, 0, 0, 0.5), 0 3px 8px rgba(0, 0, 0, 0.35)",
    exitoSuave: "rgba(22, 163, 74, 0.18)",
    errorSuave: "rgba(239, 68, 68, 0.16)",
    avisoSuave: "rgba(245, 158, 11, 0.18)",
  },
};

export function crearTema(modo = "light") {
  const t = PALETAS[modo] || PALETAS.light;

  return createTheme({
    palette: {
      mode: modo,
      primary: {
        main: ACENTO,
        dark: t.acentoFuerte,
        light: t.acentoSuave,
        contrastText: "#ffffff",
      },
      success: { main: "#16a34a", light: t.exitoSuave, dark: "#15803d" },
      error: { main: "#dc2626", light: t.errorSuave, dark: "#b91c1c" },
      warning: { main: "#f59e0b", light: t.avisoSuave, dark: "#b45309" },
      info: { main: ACENTO, light: t.acentoSuave, dark: t.acentoFuerte },
      text: { primary: t.texto, secondary: t.texto2, disabled: t.texto3 },
      divider: t.borde,
      background: { default: t.fondo, paper: t.papel },
      action: {
        hover: t.hover,
        selected: "rgba(31, 137, 246, 0.08)",
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: FUENTE,
      h4: { fontWeight: 700, letterSpacing: "-0.025em" },
      h5: { fontWeight: 700, letterSpacing: "-0.02em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      overline: { fontWeight: 600, letterSpacing: "0.12em" },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            minHeight: 38,
            paddingInline: 16,
            transition: `transform 100ms ease-out, background-color 150ms ${EASE}, border-color 150ms ${EASE}, box-shadow 150ms ${EASE}`,
            "&:active": { transform: "scale(0.97)" },
          },
          sizeSmall: { minHeight: 32, borderRadius: 8, paddingInline: 12 },
          sizeLarge: { minHeight: 46, borderRadius: 12 },
          outlined: {
            borderColor: t.bordeInput,
            backgroundColor: t.papel,
            "&:hover": {
              borderColor: t.bordeInputHover,
              backgroundColor: t.hoverOutlined,
            },
          },
          outlinedPrimary: {
            borderColor: "rgba(31, 137, 246, 0.4)",
            "&:hover": {
              borderColor: ACENTO,
              backgroundColor: "rgba(31, 137, 246, 0.06)",
            },
          },
          containedPrimary: {
            "&:hover": { backgroundColor: "#0b63c9" },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: `transform 100ms ease-out, background-color 150ms ${EASE}`,
            "&:active": { transform: "scale(0.94)" },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
          rounded: { borderRadius: 16 },
          outlined: { borderColor: t.borde },
          elevation1: { boxShadow: t.sombraSm, border: `1px solid ${t.borde}` },
          elevation2: { boxShadow: t.sombraSm, border: `1px solid ${t.borde}` },
          elevation3: { boxShadow: t.sombraMd, border: `1px solid ${t.borde}` },
          elevation6: { boxShadow: t.sombraMd },
          elevation8: { boxShadow: t.sombraMd, border: `1px solid ${t.borde}` },
          elevation24: { boxShadow: t.sombraModal },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, border: `1px solid ${t.borde}` },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: { borderRadius: 16, overflow: "hidden" },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              backgroundColor: t.superficieSuave,
              color: t.texto2,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: t.bordeCelda,
            paddingTop: 12,
            paddingBottom: 12,
            fontSize: "0.9rem",
          },
          sizeSmall: { paddingTop: 8, paddingBottom: 8 },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            "& .MuiTableRow-root": {
              transition: `background-color 120ms ${EASE}`,
            },
            "& .MuiTableRow-root:hover": {
              backgroundColor: "rgba(31, 137, 246, 0.04)",
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: 0,
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            borderTop: `1px solid ${t.borde}`,
            color: t.texto2,
          },
          toolbar: { minHeight: 52 },
          selectLabel: { fontSize: "0.8rem" },
          displayedRows: { fontSize: "0.8rem" },
          select: { borderRadius: 8 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: t.papel,
            transition: `box-shadow 150ms ${EASE}`,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: t.bordeInput },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: t.bordeInputHover,
            },
            "&.Mui-focused": { boxShadow: FOCO },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1.5,
            },
            "&.Mui-disabled": { backgroundColor: t.superficieSuave },
          },
          input: { "&::placeholder": { color: t.texto3, opacity: 1 } },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&:before": { borderBottomColor: t.bordeInput },
            "&:hover:not(.Mui-disabled):before": {
              borderBottomColor: t.bordeInputHover,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: "0.95rem" },
        },
      },
      MuiFormHelperText: {
        styleOverrides: { root: { marginLeft: 2 } },
      },
      MuiSelect: {
        styleOverrides: { icon: { color: t.texto3 } },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: t.iconoApagado,
            "& .MuiSvgIcon-root": { borderRadius: 6 },
          },
        },
      },
      MuiRadio: {
        styleOverrides: { root: { color: t.iconoApagado } },
      },
      // Switch estilo iOS
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 46,
            height: 28,
            padding: 0,
            margin: 8,
            "& .MuiSwitch-switchBase": {
              padding: 2,
              transitionDuration: "240ms",
              "&.Mui-checked": {
                transform: "translateX(18px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                  backgroundColor: ACENTO,
                  opacity: 1,
                  border: 0,
                },
                "&.Mui-disabled + .MuiSwitch-track": { opacity: 0.4 },
              },
              "&.Mui-disabled .MuiSwitch-thumb": { color: t.thumbDeshabilitado },
              "&.Mui-disabled + .MuiSwitch-track": { opacity: 0.4 },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 24,
              height: 24,
              boxShadow: t.sombraThumb,
            },
            "& .MuiSwitch-track": {
              borderRadius: 14,
              backgroundColor: t.pistaSwitch,
              opacity: 1,
              transition: `background-color 240ms ${EASE}`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 999 },
          sizeSmall: { height: 24, fontSize: "0.75rem" },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            boxShadow: t.sombraModal,
            backgroundImage: "none",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: { fontWeight: 600, letterSpacing: "-0.01em", fontSize: "1.15rem" },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: { padding: "12px 24px 20px", gap: 8 },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: t.backdrop,
            backdropFilter: "blur(4px)",
            "&.MuiBackdrop-invisible": {
              backgroundColor: "transparent",
              backdropFilter: "none",
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 14,
            border: `1px solid ${t.borde}`,
            boxShadow: t.sombraMd,
            marginTop: 6,
          },
          list: { padding: 6 },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontSize: "0.9rem",
            minHeight: 36,
            "&.Mui-selected": {
              backgroundColor: "rgba(31, 137, 246, 0.08)",
              "&:hover": { backgroundColor: "rgba(31, 137, 246, 0.12)" },
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: 14,
            boxShadow: t.sombraMd,
            border: `1px solid ${t.borde}`,
          },
          option: { borderRadius: 8, margin: "0 6px" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 500,
            padding: "6px 10px",
            backgroundColor: t.tooltipFondo,
            color: t.tooltipTexto,
          },
          arrow: { color: t.tooltipFondo },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12 },
          filled: { fontWeight: 500 },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: { root: { borderRadius: 12 } },
      },
      MuiSkeleton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: t.borde } },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { height: 2, borderRadius: 2 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { fontWeight: 500, "&.Mui-selected": { fontWeight: 600 } },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: `1px solid ${t.borde}`,
            borderRadius: 16,
            backgroundColor: t.papel,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: t.superficieSuave,
              borderBottomColor: t.borde,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.texto2,
            },
            "& .MuiDataGrid-cell": {
              borderBottomColor: t.bordeCelda,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(31, 137, 246, 0.04)",
            },
            "& .MuiDataGrid-footerContainer": { borderTopColor: t.borde },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
          },
        },
      },
    },
  });
}

const temaCiudadDigital = crearTema("light");

export default temaCiudadDigital;
