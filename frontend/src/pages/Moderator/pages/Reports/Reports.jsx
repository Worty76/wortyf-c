import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    padding: "1%",
    width: "95%",
    margin: "0 auto",
  },
});

export const Reports = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>Reports</div>
    </div>
  );
};
