"use client"
import { Snackbar, Alert, Dialog, DialogContent, DialogContentText, IconButton, Slide, Zoom } from '@mui/material';
import { ReactNode, createContext, useState, forwardRef } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';




type Props = {
    children: ReactNode;
};

type Severity = 'error' | 'warning' | 'info' | 'success';

type MessageValuesType = {
    showAlert: (severity: Severity, message: string) => void;
    showDialog: (severity: Severity, message: string) => void;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Zoom ref={ref} {...props}/>
});


const defaultProvider: MessageValuesType = {
    showAlert: (severity: Severity, message: string) => null,
    showDialog: (severity: Severity, message: string) => null
};

const DialogIcon = ({ severity }: { severity: Severity }) => {
    switch (severity) {
        case 'error': return <ErrorOutlineOutlinedIcon className='text-9xl' color={severity} />
        case 'warning': return <WarningAmberOutlinedIcon className='text-9xl' color={severity} />
        case 'info': return <InfoOutlinedIcon className='text-9xl' color={severity} />
        case 'success': return <CheckCircleOutlineIcon className='text-9xl' color={severity} />
    }
};

const MessageContext = createContext(defaultProvider)
const MessageProvider = ({ children }: Props) => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Severity>('success');
    const [type, setType] = useState<'dialog' | 'alert'>('alert');

    const show = (severity: Severity, message: string) => {
        setSeverity(severity);
        setMessage(message);
        setType(type)
    }

    const showAlertFun = (severity: Severity, message: string) => {
        show(severity, message);
        setShowAlert(true);
    }

    const showDialogFun = (severity: Severity, message: string) => {
        show(severity, message);
        setShowDialog(true);
    }

    return (
        <MessageContext.Provider value={{ showAlert: showAlertFun, showDialog: showDialogFun }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={showAlert}
                onClose={() => setShowAlert(false)}
                key={'test'}
            >
                <Alert onClose={() => setShowAlert(false)} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Dialog open={showDialog}
                onClose={() => setShowDialog(false)}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm">
                <IconButton
                    aria-label="close"
                    onClick={() => setShowDialog(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <div className='text-center p-5'>
                        <DialogIcon severity={severity} />
                        <p className='text-2xl m-0'>{message}</p>
                    </div>
                </DialogContent>
            </Dialog>
            {children}
        </MessageContext.Provider>
    )
}

export { MessageProvider, MessageContext };
