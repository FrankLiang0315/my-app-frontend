import { TextField, TextFieldProps, TextFieldVariants } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

export default function FormTextField<Variant extends TextFieldVariants>(
  props: {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: Variant;
    name: string;
    form: UseFormReturn<any, any, any>;
  } & Omit<TextFieldProps, "variant">
) {
  const { form, name, ...other } = props;
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div>
      <TextField
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
        {...other}
      ></TextField>
    </div>
  );
}
