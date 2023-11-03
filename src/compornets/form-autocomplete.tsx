import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  options: any[];
  value: string;
  label: string;
  form: UseFormReturn<any, any, any>;
  name: string;
};
export function FormAutocomplete(props: Props) {
  const { options, label, value, form, name } = props;
  const { setValue, getValues, watch , formState:{errors}} = form;

  useEffect(() => {
    watch(name);
  }, []);

  return (
    <div>
      <Autocomplete
        value={
          options.find(
            (option: any) => option[value].toString() === getValues(name)
          ) ?? null
        }
        onChange={(event: any, newValue: any) => {
          if (newValue) {
            setValue(name, newValue[value].toString());
          }
        }}
        disablePortal
        options={options}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderOption={(props, option) => {
          return (
            <li {...props} key={option[value]}>
              {option[label]}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="請選擇" />}
      />
      <div className="text-red-500">{errors[name]?.message?.toString()}</div>
    </div>
  );
}
