import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Input,
  Modal,
  Theme,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { RowDivSB } from '../../../styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../store/hooks';
import { UserRole } from '../../../store/slices/login';
const useStyles = makeStyles({ name: { SystemPromptModal } })(
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

export interface EditingInfo {
  i: number;
  data: string;
}

export default function SystemPromptModal(props: {
  isSaving: boolean;
  setTargetSystemPrompt: (targetSystemPrompt: number) => void;
  targetSystemPrompt: number;
  isEdited: boolean;
  systemPrompts: string[];
  editSystemPrompts: (i: number, value: string) => void;
  deleteSystemPrompt: (i: number) => void;
  saveSystemPrompts: (data: string[]) => void;
  open: boolean;
  close: () => void;
}): JSX.Element {
  const {
    systemPrompts,
    close,
    open,
    editSystemPrompts,
    saveSystemPrompts,
    deleteSystemPrompt,
    isEdited,
    isSaving,
    setTargetSystemPrompt,
    targetSystemPrompt,
  } = props;
  const { classes } = useStyles();
  const userRole = useAppSelector((state) => state.login.userRole);
  const isAdmin = userRole === UserRole.ADMIN;

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
            }}
          >
            {systemPrompts.map((prompt, index) => {
              return (
                <Input
                  key={index}
                  value={prompt}
                  multiline
                  readOnly={!isAdmin}
                  disableUnderline={!isAdmin}
                  title="System Prompt"
                  className={classes.inputField}
                  onChange={(e) => {
                    editSystemPrompts(index, e.target.value);
                  }}
                  startAdornment={
                    <FormControlLabel
                      label=""
                      style={{ height: 'fit-content', textAlign: 'center' }}
                      control={
                        <Checkbox
                          checked={targetSystemPrompt === index}
                          indeterminate={false}
                          onChange={(e) => {
                            setTargetSystemPrompt(index);
                          }}
                        />
                      }
                    />
                  }
                  endAdornment={
                    <>
                      {isAdmin && (
                        <IconButton
                          onClick={() => {
                            deleteSystemPrompt(index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </>
                  }
                />
              );
            })}
            {isAdmin && (
              <Button
                style={{
                  width: 'fit-content',
                  alignSelf: 'center',
                }}
                onClick={() => {
                  editSystemPrompts(systemPrompts.length, '');
                }}
              >
                Add Prompt
              </Button>
            )}
            <RowDivSB
              style={{
                alignSelf: 'center',
                justifyContent: 'space-around',
              }}
            >
              <Button onClick={close}>Close</Button>
              {isSaving ? (
                <CircularProgress />
              ) : (
                <>
                  {isAdmin ? (
                    <Button
                      disabled={!isEdited}
                      onClick={() => {
                        saveSystemPrompts(systemPrompts);
                      }}
                    >
                      Save
                    </Button>
                  ) : undefined}
                </>
              )}
            </RowDivSB>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
