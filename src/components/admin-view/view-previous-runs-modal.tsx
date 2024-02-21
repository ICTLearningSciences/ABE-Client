import { Box, Button, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { MultistepPromptRes } from '../../types';
import { RowDivSB } from '../../styled-components';

const useStyles = makeStyles({ name: { ViewPreviousRunsModal } })(
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

export default function ViewPreviousRunsModal(props: {
  previousRuns: MultistepPromptRes[];
  open: boolean;
  close: () => void;
  setRunToView: (run?: MultistepPromptRes) => void;
}): JSX.Element {
  const { previousRuns, open, close, setRunToView } = props;
  const { classes } = useStyles();
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: 'fit-content',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div>
      <Modal open={Boolean(open)} className={classes.modal}>
        <Box sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            {previousRuns.map((run, index) => (
              <RowDivSB
                style={{
                  borderBottom: '1px solid black',
                }}
              >
                <span>{`Run ${index + 1}`}</span>
                <Button
                  onClick={() => {
                    setRunToView(run);
                  }}
                >
                  View
                </Button>
              </RowDivSB>
            ))}
          </div>
          <Button
            style={{
              justifySelf: 'center',
            }}
            onClick={() => {
              setRunToView(undefined);
              close();
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
