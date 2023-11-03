import { CircularProgress } from "@mui/material";

export function Loading() {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <CircularProgress />
        </div>
    );
}