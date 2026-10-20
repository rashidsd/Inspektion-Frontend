import { alpha, lighten, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material";

/** Header/footer background that stays readable in light and dark mode. */
export const getTableHeaderBg = (theme: Theme) =>
  theme.palette.mode === "dark"
    ? alpha(theme.palette.primary.main, 0.22)
    : lighten(theme.palette.primary.main, 0.85);

export const tableHeaderRowSx: SxProps<Theme> = {
  backgroundColor: (theme) => getTableHeaderBg(theme),
};

/** Alternating row background; pass invert when even rows should be striped. */
export const stripedRowSx = (
  index: number,
  invert = false
): SxProps<Theme> => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor: (theme) => {
    const striped = invert ? index % 2 === 0 : index % 2 !== 0;
    return striped ? theme.palette.action.hover : "transparent";
  },
});
