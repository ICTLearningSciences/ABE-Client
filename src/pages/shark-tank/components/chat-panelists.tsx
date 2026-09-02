/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import type { UseWithPanels } from "../../../store/slices/panels/use-with-panels";
import PanelistCard from "./panelist-card";
import { useAppSelector } from "../../../store/hooks";

export function ChatPanelists(props: {
  useWithPanelActivity: UseWithPanels;
}): React.ReactNode {
  const { useWithPanelActivity } = props;
  const { activePanel, panelists, toggleActivePanelist } = useWithPanelActivity;
  const activePanelists = useAppSelector(
    (state) => state.panels.activePanelists,
  );
  return (
    <div
      className="row center-div"
      style={{
        backgroundImage:
          "linear-gradient(90deg,rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)",
        overflow: "hidden",
      }}
    >
      <div
        className="row spacing"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          padding: 10,
        }}
      >
        {activePanel?.panelists
          ?.map((m) => {
            const panelist = panelists.find((p) => p.clientId === m);
            if (!panelist) return <></>;
            return (
              <PanelistCard
                key={m}
                p={panelist}
                isActive={Boolean(activePanelists?.includes(m))}
                onMemberClick={() => toggleActivePanelist(m)}
              />
            );
          })
          .reverse()}
      </div>
    </div>
  );
}
