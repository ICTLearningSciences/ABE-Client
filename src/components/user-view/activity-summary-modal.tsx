import { Box, Button, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles({ name: { ActivitySummaryModal } })(
  (theme: Theme) => ({
    inputField: {
      width: '100%',
      margin: 10,
    },
    modal: {},
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxWidth: '50%',
    },
  })
);

export default function ActivitySummaryModal(props: {
  activitySummary?: string;
  open: boolean;
  close: () => void;
}): JSX.Element {
  const { close, activitySummary, open } = props;
  const { classes } = useStyles();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '70%',
  };

  return (
    <div>
      <Modal open={open} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <h2>Summary</h2>
            <div
              style={{
                height: '100%',
                border: '1px solid lightgrey',
                padding: '10px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {activitySummary}
            </div>
            <Button onClick={close}>Close</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
