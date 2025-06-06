/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { eightHoursBetweenSessions } from '../fixtures/document-timeline/eight-hours-difference';
import { generationCompleted, generationInProgress } from '../fixtures/document-timeline/generations-in-progress';
import { tenTimelinePoints } from '../fixtures/document-timeline/ten-timeline-points';
import { cyMockDefault, cyMockGetDocTimeline } from '../helpers/functions';
import { JobStatus, MockDefaultType } from '../helpers/types';

describe('document timeline', () => {
  beforeEach(() => {
    cyMockDefault(cy);
  });

  describe('Top section', () => {
    /* This test case is checking whether the content is displayed on the right side if available. It
   visits a specific URL related to document history, then asserts that the revision time header
   container with the data attribute `data-cy=content-revision-container` should exist on the page.
   This is a basic test to ensure that the content is being rendered correctly in the specified
   location on the page. */
    it('display content on right side if avaliable', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // revision time header should exist
      cy.get('[data-cy=content-revision-container]').should('exist');
    });

    /* This test case is checking the display of revision information on a document timeline feature. It
  visits a specific URL related to document history and then asserts that the revision time header
  container with the data attribute `data-cy=content-revision-container` exists on the page. Within
  this container, it further checks that the revision title contains 'Revision:' and the revision
  date contains 'Mar 27, 2024'. This test ensures that the revision information is being rendered
  correctly in the specified location on the page. */
    it('display revision', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // revision time header should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=revision-time-header]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=revision-title]')
                .should('exist')
                .contains('Revision:');
              cy.get('[data-cy=revision-date]')
                .should('exist')
                .contains('Mar 27, 2024');
            });
        });
    });

    /* This test case is checking the display of intention and ensuring that it is editable. Here's a
    breakdown of what the test is doing: */
    it('display intention and should be editable', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // intention section should exist
      cy.get('[data-cy=intention-textarea]')
        .should('exist')
        .contains('This activity is to work on the hook of the essay.');
      // claeared the content of the textarea
      cy.get('[data-cy=intention-textarea]').within(() => {
        cy.get('textarea', { timeout: 1000 }).eq(0).type('New intention');
      });
    });

    /* This test case is checking the display of the summary section and ensuring that it is editable.
   Here's a breakdown of what the test is doing: */
    it('display summary and should be editable', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=summary-textarea]').within(() => {
        cy.get('textarea').eq(0).type('New summary');
      });
    });
  });

  describe('Available Timeline AI Outline', () => {
    /* This test case is checking the display of a statement in the document timeline feature. Here's a
   breakdown of what the test is doing: */
    it('display statement', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=ai-outline-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=ai-outline-statement-title]')
                .should('exist')
                .contains('Thesis');

              cy.get('[data-cy=ai-outline-statement-content]')
                .should('exist')
                .contains(
                  'Climate change is primarily caused by human activities.'
                );
            });
        });
    });

    /* This test case is checking the display of supporting claims in the document timeline feature.
   Here's a breakdown of what the test is doing: */
    it('display Supporting Claims', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=ai-outline-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=supporting-claims-container]').within(() => {
                cy.get('[data-cy=supporting-claims-title]')
                  .should('exist')
                  .contains('Supporting Claims');

                cy.get('[data-cy=supporting-claims-accordion]').should('exist');
                // should contain 3 claims
                cy.get('[data-cy=supporting-claims-accordion]')
                  .children()
                  .should('have.length', 3);
                cy.get('[data-cy=supporting-claims-accordion]')
                  .children()
                  .eq(0)
                  .should('exist')
                  .contains(
                    'Greenhouse gas emissions from human activities are the main driver of climate change.'
                  );
              });
            });
        });
    });

    /* This test case is checking the display of evidence given for each claim in the document timeline
   feature. Here's a breakdown of what the test is doing: */
    it('display Evidence Given for Each Claim', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=ai-outline-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=claim-evidence-title]')
                .should('exist')
                .contains('Evidence Given for Each Claim');

              cy.get('[data-cy=claim-evidence-1-container]').within(() => {
                cy.get('[data-cy=claim-evidence-1-title]')
                  .should('exist')
                  .contains(
                    '1. Greenhouse gas emissions from human activities are the main driver of climate change.'
                  );

                cy.get('[data-cy=claim-evidence-1-accordion]').should('exist');
                // should contain 3 claims
                cy.get('[data-cy=claim-evidence-1-accordion]')
                  .children()
                  .should('have.length', 2);
                cy.get('[data-cy=claim-evidence-1-accordion]')
                  .children()
                  .eq(0)
                  .should('exist')
                  .contains(
                    'Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.'
                  );
              });
            });
        });
    });

    /* The above code is a test written in TypeScript using Cypress for a web application. The test is
    checking the functionality of displaying the first revision point first on a specific page. */
    it('Display first revision point first', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=ai-outline-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=claim-evidence-title]')
                .should('exist')
                .contains('Evidence Given for Each Claim');

              cy.get('[data-cy=claim-evidence-1-container]').within(() => {
                cy.get('[data-cy=claim-evidence-1-title]')
                  .should('exist')
                  .contains(
                    '1. Greenhouse gas emissions from human activities are the main driver of climate change.'
                  );

                cy.get('[data-cy=claim-evidence-1-accordion]').should('exist');
                // should contain 3 claims
                cy.get('[data-cy=claim-evidence-1-accordion]')
                  .children()
                  .should('have.length', 2);
                cy.get('[data-cy=claim-evidence-1-accordion]')
                  .children()
                  .eq(0)
                  .should('exist')
                  .contains(
                    'Increase in carbon dioxide levels in the atmosphere due to burning of fossil fuels.'
                  );
              });
            });
        });
    });
  });

  describe('UI Content Revision', () => {
    beforeEach(() => {
      cyMockDefault(cy);
    });

    it('Shows scroll bar if needed in left side (Document)', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // left-content-container should have scroll bar
      cy.get('[data-cy=left-content-container]').should(
        'have.css',
        'overflow-y',
        'auto'
      );
    });

    it('Shows scroll bar if needed (Footer Timeline)', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // left-content-container should have scroll bar
      cy.get('[data-cy=timeline-footer-wrapper]').should(
        'have.css',
        'overflow-x',
        'auto'
      );
    });
  });

  describe('Not Available Timeline AI Outline', () => {
    beforeEach(() => {
      cyMockDefault(cy, {
        reverseOutline: 'No outline available',
        mockType: MockDefaultType.REVERSE_OUTLINE,
      });
    });

    /* This test case is checking for the display of a statement if it exists in the document timeline
   feature. Here's a breakdown of what the test is doing: */
    it('Do not display statement if it does not exists', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=ai-outline-container]').should('not.exist');
        });

      cy.get('[data-cy=no-ai-outline]')
        .should('exist')
        .contains('No AI outline available');
    });
  });

  describe('fetch timeline failed', () => {
    it('server failure', () => {
      cyMockGetDocTimeline(cy, {
        response: eightHoursBetweenSessions,
        jobStatus: JobStatus.FAILED,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.contains('Failed to load document timeline');
    });

    it('http failure', () => {
      cyMockGetDocTimeline(cy, {
        response: eightHoursBetweenSessions,
        statusCode: 500,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.contains('Request failed with status code 500');
    });
  });

  describe("summary and outline generation in progress", ()=>{
    it("shows loading status if generation not complete", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationInProgress,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=ai-summary-in-progress]").should("exist")
      cy.get("[data-cy=ai-outline-in-progress]").should("exist")
      cy.get("[data-cy=timeline-footer-item-card-0]").should("have.css", "opacity", "0.5")
      cy.get("[data-cy=timeline-footer-item-card-1]").should("have.css", "opacity", "0.5")
    })

    it("keeps polling while generation is in progress", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationInProgress,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=ai-summary-in-progress]").should("exist")
      cy.get("[data-cy=ai-outline-in-progress]").should("exist")
      // check for polls
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});

    })

    it("can view other parts of the document while generation is in progress", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationInProgress,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=ai-summary-in-progress]").should("exist")
      cy.get("[data-cy=ai-outline-in-progress]").should("exist")
      cy.get("[data-cy=intention-container]").should("contain.text", "This activity is to work on the hook of the essay.")
      cy.get("[data-cy=assignment-container]").should("contain.text", "Aliens assignment description")
    })

    it("properly displays summary and outline when generation is complete", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationInProgress,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=ai-summary-in-progress]").should("exist")
      cy.get("[data-cy=ai-outline-in-progress]").should("exist")
      cyMockGetDocTimeline(cy, {
        response: generationCompleted,
        jobStatus: JobStatus.COMPLETE,
      });
      cy.get("[data-cy=timeline-footer-item-card-0]").should("have.css", "opacity", "0.5")
      cy.get("[data-cy=timeline-footer-item-card-1]").should("have.css", "opacity", "0.5")
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.get("[data-cy=summary-container]").should("contain.text", "Complete Summary")
      cy.get("[data-cy=ai-outline-container]").should("contain.text", "The impact of climate change on global food security")
      cy.get("[data-cy=timeline-footer-item-card-0]").should("have.css", "opacity", "1")
      cy.get("[data-cy=timeline-footer-item-card-1]").should("have.css", "opacity", "1")
    })
  
    it("stops polling when generation is complete", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationInProgress,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=ai-summary-in-progress]").should("exist")
      cy.get("[data-cy=ai-outline-in-progress]").should("exist")
      cyMockGetDocTimeline(cy, {
        response: generationCompleted,
        jobStatus: JobStatus.COMPLETE,
      });
      cy.wait("@FetchDocumentTimelineStatus", {timeout: 3000});
      cy.get("[data-cy=summary-container]").should("contain.text", "Complete Summary")
      cy.get("[data-cy=ai-outline-container]").should("contain.text", "The impact of climate change on global food security")
      cy.wait(2000)
      cy.get("@FetchDocumentTimelineStatus.all").its("length").then((len)=>{
        cy.wait(4000)
        cy.get("@FetchDocumentTimelineStatus.all").should("have.length", len)
      })
    })

    it("cannot edit fields while timeline is being generated", ()=>{
      cyMockDefault(cy)
      cyMockGetDocTimeline(cy, {
        response: generationCompleted,
        jobStatus: JobStatus.IN_PROGRESS,
      });
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      cy.get("[data-cy=assignment-textarea]").within(()=>{
        cy.get("textarea").should("be.disabled")
      })
      cy.get("[data-cy=intention-textarea]").within(()=>{
        cy.get("textarea").should("be.disabled")
      })
      cy.get("[data-cy=summary-textarea]").within(()=>{
        cy.get("textarea").should("be.disabled")
      })
    })
  })
});
