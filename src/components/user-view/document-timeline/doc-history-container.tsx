/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import React from "react";
import { useParams } from "react-router-dom";
import withAuthorizationOnly from "../../../hooks/wrap-with-authorization-only";
import type { UseWithLogin } from "../../../store/slices/login/use-with-login";
import Header from "../../header/header";
import { DocumentTimelinePage } from "./index";
import { useNavigateWithParams } from "../../../hooks/use-navigate-with-params";

function DocHistoryContainer(props: {
  useLogin: UseWithLogin;
}): React.ReactNode {
  const { useLogin } = props;
  const { docId } = useParams<Record<string, string>>();
  const navigate = useNavigateWithParams();
  return (
    <>
      <Header
        useLogin={useLogin}
        courseNavPath="/docs"
        freeDocEditingNavPath="/docs"
      />
      <div
        style={{
          width: "100%",
          height: "94%", //header takes 6%
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DocumentTimelinePage
          returnToDocs={() => navigate(`/docs`)}
          docIdFromParams={docId || ""}
        />
      </div>
    </>
  );
}

const Page = withAuthorizationOnly(DocHistoryContainer);
export default Page;
