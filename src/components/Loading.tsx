import CircularProgress from "@mui/material/CircularProgress";
export default function Loading({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-full w-full" : ""
      }`}
    >
      <CircularProgress />
    </div>
  );
}
