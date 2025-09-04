/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { ModifyStudentAssignmentProgressResponse } from "./enrollment-operations";
import { studentWithUpdatedProgress } from "./enrollment-operations";
import { AiServiceModel } from "../../fixtures/educational-management/educational-types"

export const updateStudentProgressResponse: ModifyStudentAssignmentProgressResponse = {
    modifyStudentAssignmentProgress: studentWithUpdatedProgress
  };

export function studentWithUpdatedActivityDefaultLLM(defaultLLM: AiServiceModel): ModifyStudentAssignmentProgressResponse {
    return {
        modifyStudentAssignmentProgress: {
        ...studentWithUpdatedProgress,
        assignmentProgress: studentWithUpdatedProgress.assignmentProgress.map(ap=>{
            return {
                ...ap,
                activityCompletions: ap.activityCompletions.map(ac=>{
                    return {
                        ...ac,
                        defaultLLM: defaultLLM
                    }
                })
                }
            })
        }
    }
};