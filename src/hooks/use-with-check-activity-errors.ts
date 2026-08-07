/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useEffect, useRef, useState } from "react";
import {
  ActivityStepErrorChecker,
  type FlowErrors,
} from "../classes/activity-builder-activity/activity-step-error-checker";
import type { ActivityBuilder } from "../components/activity-builder/types";

export function useWithCheckActivityErrors(
  globalStateKeys: string[],
  localActivityCopy: ActivityBuilder,
) {
  const errorChecker = useRef<ActivityStepErrorChecker>(
    new ActivityStepErrorChecker(),
  );
  const curErrorChecker = errorChecker.current;
  const [errors, setErrors] = useState<FlowErrors>();

  useEffect(() => {
    curErrorChecker.setGlobalStateKeys(globalStateKeys);
    curErrorChecker.checkErrors(localActivityCopy);
    setErrors(curErrorChecker.errors);
  }, [globalStateKeys]);

  useEffect(() => {
    curErrorChecker.checkErrors(localActivityCopy);
    setErrors(curErrorChecker.errors);
  }, [localActivityCopy]);

  return { errors };
}
