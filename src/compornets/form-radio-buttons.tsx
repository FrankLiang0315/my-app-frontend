"use client";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  name: string;
  form: UseFormReturn<any, any, any>;
  buttons: { label: string; value: any }[];
};
export function FormRadioButtons(props: Props) {
  const { name, form, buttons } = props;
  const {
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = form;
  useEffect(() => {
    watch(name);
  }, []);

  return (
    <div>
      <div className="w-full gap-2 grid grid-cols-2">
        {buttons.map((button) => {
          return (
            <Button
              key={button.value}
              fullWidth
              size="large"
              variant={
                getValues(name) === button.value ? "contained" : "outlined"
              }
              onClick={() => {
                setValue(name, button.value);
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </div>
      <div className="text-red-500">{errors[name]?.message?.toString()}</div>
    </div>
  );
}
