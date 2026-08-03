/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigateWithParams } from "./use-navigate-with-params";
import { useAppSelector } from "../store/hooks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthorizationOnly = (Component: any) => (props: any) => {
  const loginState = useAppSelector((state) => state.login);
  const navigate = useNavigateWithParams();

  useEffect(() => {
    if (
      (loginState.loginStatus === 1 || loginState.loginStatus === 4) &&
      !loginState.accessToken
    ) {
      if (typeof window !== "undefined") {
        navigate("/");
      }
      navigate("/");
    }
  }, [loginState]);

  if (loginState.loginStatus === 0 || loginState.loginStatus === 2) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return loginState.loginStatus === 3 ? (
    <Component
      {...props}
      accessToken={loginState.accessToken}
      user={loginState.user}
    />
  ) : (
    <div>
      <CircularProgress />
    </div>
  );
};

export default withAuthorizationOnly;
