/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import * as React from 'react';
import { Button, Grid, MenuItem } from '@mui/material';
import { TextSnippet } from '@mui/icons-material';

import { CssTextField } from './components';
import PanelistCard from './components/panelist-card';
import ChatThread from './components/chat-thread';
import UserDocumentDisplay from './components/doc-display';
import { Header } from './components/header';
import ToggleAgentMode from './components/toggle-mode';
import { useWithPanels } from '../../store/slices/panels/use-with-panels';
import { useWithState } from '../../exported-files';
import { Panelist } from '../../store/slices/panels/types';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';
import withAuthorizationOnly from '../../hooks/wrap-with-authorization-only';

import './shark-tank.css';

function SharkTankChat(): JSX.Element {
  const navigate = useNavigateWithParams();
  const {
    usePanelMode,
    activity,
    activePanel,
    activePanelist,
    panelists,
    setActivePanelist,
  } = useWithPanels();
  const { state: docState, updateCurrentDocId } = useWithState();
  const { curDocId } = docState;

  function onMemberClick(m: Panelist): void {
    console.log(m);
  }

  if (!activePanel || !activity) {
    navigate('/shark-panel');
    return <></>;
  }

  return (
    <main className="root">
      <Header title="Chat" />
      <div className="page">
        <Grid container spacing={1} style={{ width: '100%', height: '100%' }}>
          <Grid xs={8}>
            <div className="column" style={{ height: '100%' }}>
              {usePanelMode ? (
                <div
                  className="row spacing center-div"
                  style={{
                    overflowX: 'auto',
                    padding: 20,
                    backgroundImage:
                      'linear-gradient(90deg,rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)', // "rgba(0, 0, 0, 0.3)",
                    width: '100%',
                  }}
                >
                  {activePanel.panelists.map((m) => {
                    const panelist = panelists.find((p) => p.clientId === m);
                    if (!panelist) return <></>;
                    return (
                      <PanelistCard
                        key={m}
                        p={panelist}
                        onMemberClick={onMemberClick}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="row center-div">
                  <CssTextField
                    label="Agent"
                    focused
                    select
                    value={activePanelist}
                    style={{ width: 300, margin: 10 }}
                  >
                    {activePanel.panelists.map((m) => {
                      const panelist = panelists.find((p) => p.clientId === m);
                      if (!panelist) return <></>;
                      return (
                        <MenuItem
                          key={m}
                          value={m}
                          onClick={() => setActivePanelist(m)}
                        >
                          {panelist.panelistName}
                        </MenuItem>
                      );
                    })}
                  </CssTextField>
                </div>
              )}
              <div
                className="column center-div"
                style={{
                  flexGrow: 1,
                  background: 'rgb(48, 53, 58)',
                  margin: 20,
                }}
              >
                <UserDocumentDisplay
                  docId={curDocId}
                  onOpenDoc={updateCurrentDocId}
                />
              </div>
              <div className="row spacing center-div" style={{ padding: 20 }}>
                <ToggleAgentMode />
                <Button
                  variant="contained"
                  disabled={!curDocId}
                  startIcon={<TextSnippet />}
                  onClick={() => updateCurrentDocId('')}
                >
                  My Documents
                </Button>
                <div />
              </div>
            </div>
          </Grid>
          <Grid xs={4}>
            <ChatThread currentDoc={curDocId} />
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default withAuthorizationOnly(SharkTankChat);
