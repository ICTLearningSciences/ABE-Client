import { Box, Button, Modal, Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { MultistepPromptRes, PromptOutputTypes } from '../../types';
import { ColumnDiv, JsonDisplay } from '../../styled-components';
import { useState } from 'react';
import { parseOpenAIResContent } from '../../helpers';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const useStyles = makeStyles({ name: { ViewPreviousRunModal } })(
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

export default function ViewPreviousRunModal(props: {
  previousRun?: MultistepPromptRes;
  open: boolean;
  close: () => void;
}): JSX.Element {
  const { previousRun, open, close } = props;
  const { classes } = useStyles();
  const [showJsonAsText, setShowJsonAsText] = useState(false);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
  };

  if (!previousRun) {
    return <></>;
  }
  return (
    <div>
      <Modal open={Boolean(open)} className={classes.modal}>
        <Box sx={style}>
          <div style={{ overflow: 'auto' }}>
            {previousRun.openAiData.map((promptStep, index) => {
              const parsedData = parseOpenAIResContent(promptStep);
              const isJsonOutput =
                parsedData.originalRequestPrompt?.outputDataType ===
                PromptOutputTypes.JSON;
              const showOutputAsText =
                parsedData.originalRequestPrompt?.outputDataType ===
                  PromptOutputTypes.TEXT || showJsonAsText;
              const responseMessage =
                parsedData.openAiResponse[0].message.content;
              return (
                <ColumnDiv>
                  <h2 style={{ alignSelf: 'center' }}>{`Step ${index + 1}`}</h2>
                  <div>Prompt</div>
                  <div style={{ border: '1px solid black' }}>
                    <JsonView
                      data={parsedData.openAiPrompt}
                      shouldExpandNode={allExpanded}
                      style={defaultStyles}
                    />
                  </div>
                  <br />
                  <div>Response</div>
                  <div style={{ border: '1px solid black' }}>
                    {showOutputAsText ? (
                      <div>
                        <JsonDisplay>
                          {isJsonOutput
                            ? JSON.stringify(responseMessage, null, 2)
                            : responseMessage}
                        </JsonDisplay>
                        {isJsonOutput ? (
                          <Button
                            onClick={() => {
                              setShowJsonAsText(!showJsonAsText);
                            }}
                          >
                            {showJsonAsText ? 'Show as JSON' : 'Show as Text'}
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                    ) : (
                      <div>
                        <JsonView
                          data={parsedData.openAiResponse}
                          shouldExpandNode={allExpanded}
                          style={defaultStyles}
                        />
                        <Button
                          onClick={() => {
                            setShowJsonAsText(!showJsonAsText);
                          }}
                        >
                          {showJsonAsText ? 'Show as JSON' : 'Show as Text'}
                        </Button>
                      </div>
                    )}
                  </div>
                </ColumnDiv>
              );
            })}
          </div>
          <Button
            onClick={() => {
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
