import React from 'react';
import { Panelist } from '../../../store/slices/panels/types';
import { UseWithPanels } from '../../../store/slices/panels/use-with-panels';
import PanelistCard from './panelist-card';

export function ChatPanelists(props: {
  useWithPanelActivity: UseWithPanels;
}): JSX.Element {
  const { useWithPanelActivity } = props;
  const {
    activePanel,
    activePanelist,
    panelists,
    setPanelMode,
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

  return (
    <div
      className="row center-div"
      style={{
        padding: 10,
        backgroundImage:
          'linear-gradient(90deg,rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        className="row spacing"
        style={{ overflowX: 'auto', overflowY: 'hidden' }}
      >
        {activePanel?.panelists.map((m) => {
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
    </div>
  );
}
