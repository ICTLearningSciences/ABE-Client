/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { tenTimelinePoints } from '../fixtures/document-timeline/ten-timeline-points';
import { cyMockDefault } from '../helpers/functions';

export enum MockDefaultType {
  VERSION = 'VERSION',
  REVERSE_OUTLINE = 'REVERSE_OUTLINE',
  CUSTOM_FILE_DATA = 'CUSTOM_FILE_DATA',
  ALL = 'ALL',
}

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
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=intention-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=intention-title]')
                .should('exist')
                .contains('Intention');
              cy.get('[data-cy=intention-textarea]')
                .should('exist')
                .contains('This activity is to work on the hook of the essay.');
              // claeared the content of the textarea
              cy.get('[data-cy=intention-textarea]')
                .clear()
                .type('New intention');
            });
        });
    });

    /* This test case is checking the display of the summary section and ensuring that it is editable.
   Here's a breakdown of what the test is doing: */
    it('display summary and should be editable', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
      // summary section should exist
      cy.get('[data-cy=content-revision-container]')
        .should('exist')
        .within(() => {
          cy.get('[data-cy=summary-container]')
            .should('exist')
            .within(() => {
              cy.get('[data-cy=summary-title]')
                .should('exist')
                .contains('Summary');
              cy.get('[data-cy=summary-textarea]')
                .should('exist')
                .contains(
                  "In the current version, there are minor changes made to the document compared to the previous version. The only change made is the addition of the statement 'I'm making more changes' at the end of the document. No other areas of the document were substantially changed."
                );
              // claeared the content of the textarea
              cy.get('[data-cy=summary-textarea]').clear().type('New summary');
            });
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
                .contains('Statement');

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
    it.only('display Evidence Given for Each Claim', () => {
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
      cyMockDefault(cy, {
        mockType: MockDefaultType.CUSTOM_FILE_DATA,
        customFileData: tenTimelinePoints,
      });
    });

    /* This test case is checking for the display of a statement if it exists in the document timeline
   feature. Here's a breakdown of what the test is doing: */
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
      cy.get('[data-cy=footer-timeline]').should(
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
});
