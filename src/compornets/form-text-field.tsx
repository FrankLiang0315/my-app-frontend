import { TextField, TextFieldProps, TextFieldVariants } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { register } from "module";
import { UseFormRegister, UseFormReturn } from "react-hook-form";

type Props = {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: Variant;
  } & Omit<TextFieldProps, 'variant'>;

export default function FormTextField<Variant extends TextFieldVariants> (props: {
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant?: Variant;
    name: string;
    form: UseFormReturn<any, any, any>;
  } & Omit<TextFieldProps, 'variant'>) {

    const {form, name, ...other} = props;
    const {
        register,
        formState: { errors },
      } = form;
    return (
        <TextField 
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
        {...other}
     
        ></TextField>
    );
}