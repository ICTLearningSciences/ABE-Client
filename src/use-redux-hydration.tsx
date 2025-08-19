/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loadUserDocs } from './store/slices/state';
import { useWithDocGoalsActivities } from './store/slices/doc-goals-activities/use-with-doc-goals-activites';
import { useWithEducationalManagement } from './store/slices/education-management/use-with-educational-management';
import { LoginStatus } from './store/slices/login';

export async function useReduxHydration() {
  const userData = useAppSelector((state) => state.login.user);
  const loginStatus = useAppSelector((state) => state.login.loginStatus);
  const dispatch = useAppDispatch();
  const { loadActivities, loadDocGoals, loadBuiltActivities } =
    useWithDocGoalsActivities();
  const { loadAllEducationalDataWithUserData } = useWithEducationalManagement();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (loginStatus !== LoginStatus.AUTHENTICATED) {
      setHydrated(false);
    }
  }, [loginStatus]);

  useEffect(() => {
    if (!userData || hydrated || loginStatus !== LoginStatus.AUTHENTICATED)
      return;
    setHydrated(true);
    const { _id: userId, educationalRole } = userData;
    dispatch(loadUserDocs({ userId }));
    loadActivities();
    loadBuiltActivities();
    loadDocGoals();
    if (educationalRole) {
      loadAllEducationalDataWithUserData(userId, educationalRole);
    }
  }, [loginStatus]);
}
