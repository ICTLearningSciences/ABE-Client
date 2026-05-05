/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import * as React from 'react';
import { Button, Grid } from '@mui/material';
import { TextSnippet } from '@mui/icons-material';

import PanelistCard from './components/panelist-card';
import UserDocumentDisplay from './components/doc-display';
import { Header } from './components/header';
import { Chat } from './components/chat';
import { useWithState } from '../../exported-files';
import { useNavigateWithParams } from '../../hooks/use-navigate-with-params';
import { useWithPanels } from '../../store/slices/panels/use-with-panels';
import { Panelist } from '../../store/slices/panels/types';
import withAuthorizationOnly from './wrap-with-authorization-only';

import './shark-tank.css';

function SharkTankChat(): JSX.Element {
  const navigate = useNavigateWithParams();
  const { state: docState, updateCurrentDocId } = useWithState();
  const useWithPanelActivity = useWithPanels();

  const { curDocId } = docState;
  const {
    activity,
    activePanel,
    activePanelist,
    panelists,
    setPanelMode,
    setActivity,
    setActivePanelist,
  } = useWithPanelActivity;

  function onMemberClick(m: Panelist): void {
    if (activePanelist?.clientId === m.clientId) {
      setPanelMode(true);
      setActivePanelist(undefined);
    } else {
      setPanelMode(false);
      setActivePanelist(m.clientId);
    }
  }

  if (!activePanel || !activity) {
    navigate('/shark-tank');
    return <></>;
  }

  return (
    <main className="root">
      <Header title="Chat" />
      <div className="page">
        <Grid container style={{ width: '100%', height: '100%' }}>
          <Grid
            xs={curDocId ? 8 : 12}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div
              className="row spacing center-div"
              style={{
                overflowX: 'auto',
                paddingTop: 10,
                paddingBottom: 10,
                backgroundImage:
                  'linear-gradient(90deg,rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)', // "rgba(0, 0, 0, 0.3)",
                width: '100%',
                maxWidth: '100%',
                display: curDocId ? '' : 'none',
              }}
            >
              {activePanel.panelists.map((m) => {
                const panelist = panelists.find((p) => p.clientId === m);
                if (!panelist) return <></>;
                return (
                  <PanelistCard
                    key={m}
                    p={panelist}
                    isActive={!activePanelist || activePanelist.clientId === m}
                    onMemberClick={onMemberClick}
                  />
                );
              })}
            </div>
            <div
              className="column center-div"
              style={{
                flexGrow: 1,
                background: 'rgb(48, 53, 58)',
                margin: 10,
              }}
            >
              <UserDocumentDisplay
                docId={curDocId}
                activityId={activity?._id}
                onOpenDoc={updateCurrentDocId}
              />
            </div>
            <div className="row spacing center-div" style={{ padding: 20 }}>
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
          </Grid>
          {curDocId && (
            <Grid
              xs={4}
              style={{ height: '100%', paddingRight: 20, paddingLeft: 20 }}
            >
              <Chat
                selectedActivity={activity}
                setSelectedActivity={(activity) => {
                  setActivity(activity._id);
                }}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </main>
  );
}

export default withAuthorizationOnly(SharkTankChat);
