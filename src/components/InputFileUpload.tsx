import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { forwardRef } from "react";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const InputFileUpload = forwardRef(function InputFileUpload(
  { isIcon, lable, fileChange, size, flex, btnColor, variant, minWidth }: any,
  ref?: React.Ref<HTMLInputElement>
) {
  return (
    <Button
      sx={{ p: 1, flex: flex, minWidth: minWidth ? minWidth : null }}
      component="label"
      role={undefined}
      variant={variant ? variant : "outlined"}
      tabIndex={-1}
      startIcon={isIcon && <CloudUploadIcon />}
      size={size}
      color={btnColor}
    >
      {lable}
      <VisuallyHiddenInput
        type="file"
        onChange={fileChange}
        multiple
        ref={ref}
      />
    </Button>
  );
});

export default InputFileUpload;
