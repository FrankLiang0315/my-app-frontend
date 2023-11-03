import { Dialog, DialogProps, Zoom } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from 'react';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Zoom ref={ref} {...props}/>
});


export function TransitionDialog (props: DialogProps): JSX.Element
{
    return (
        <Dialog
            {...props}
            TransitionComponent={Transition}
        />
    )
}