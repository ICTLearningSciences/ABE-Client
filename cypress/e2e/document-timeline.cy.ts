/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { MockDefaultType } from '../../src/types';
import { cyMockDefault } from '../helpers/functions';

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
  });

  describe('UI AI Outline', () => {
    beforeEach(() => {
      cyMockDefault(cy, {
        mockType: MockDefaultType.VERSION,
        version: {
          docId: '1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y',
          plainText:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Platea dictumst vestibulum rhoncus est. Est pellentesque elit ullamcorper dignissim cras tincidunt. Cursus in hac habitasse platea dictumst quisque. Sem fringilla ut morbi tincidunt augue interdum velit euismod in. Non blandit massa enim nec dui. Velit sed ullamcorper morbi tincidunt ornare massa eget. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Enim sed faucibus turpis in. Vel pretium lectus quam id. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis.          Dolor sed viverra ipsum nunc aliquet bibendum. Non consectetur a erat nam at lectus urna duis. Ipsum nunc aliquet bibendum enim. Amet commodo nulla facilisi nullam vehicula ipsum a. Morbi tristique senectus et netus et malesuada fames. Faucibus et molestie ac feugiat. Tristique et egestas quis ipsum. Consequat ac felis donec et odio pellentesque diam volutpat. Ullamcorper sit amet risus nullam eget. Diam vulputate ut pharetra sit amet. Id ornare arcu odio ut sem. Velit scelerisque in dictum non consectetur a. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Sit amet cursus sit amet dictum sit. Interdum velit laoreet id donec. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Consectetur lorem donec massa sapien faucibus et molestie. Pretium lectus quam id leo in vitae. Dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh.          Platea dictumst vestibulum rhoncus est pellentesque elit. Vitae et leo duis ut diam. Lobortis feugiat vivamus at augue eget arcu dictum. Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Volutpat diam ut venenatis tellus in metus vulputate eu. Habitant morbi tristique senectus et netus et malesuada fames. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Feugiat sed lectus vestibulum mattis. Nec ullamcorper sit amet risus nullam eget. Sed viverra tellus in hac habitasse. Vulputate ut pharetra sit amet aliquam id diam. Praesent semper feugiat nibh sed.       Odio aenean sed adipiscing diam donec adipiscing tristique. Ultrices in iaculis nunc sed augue lacus viverra vitae congue. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Turpis cursus in hac habitasse platea. At tempor commodo ullamcorper a lacus vestibulum. In nibh mauris cursus mattis molestie a iaculis. Nisi scelerisque eu ultrices vitae. Risus sed vulputate odio ut. Non consectetur a erat nam at lectus urna. Adipiscing tristique risus nec feugiat in fermentum posuere urna. Egestas sed sed risus pretium quam vulputate dignissim suspendisse in. Arcu felis bibendum ut tristique et egestas quis. Augue lacus viverra vitae congue. Sagittis orci a scelerisque purus semper eget duis at. Vivamus arcu felis bibendum ut tristique et egestas quis. Enim neque volutpat ac tincidunt. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sit amet nulla facilisi morbi tempus iaculis urna.          Euismod lacinia at quis risus sed vulputate odio ut. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Vitae congue mauris rhoncus aenean vel elit scelerisque. Adipiscing elit pellentesque habitant morbi tristique senectus et netus et. Pulvinar proin gravida hendrerit lectus a. Duis convallis convallis tellus id interdum velit laoreet id donec. Tellus orci ac auctor augue mauris augue neque. Ut sem nulla pharetra diam sit. Nunc lobortis mattis aliquam faucibus purus. Hac habitasse platea dictumst quisque. In massa tempor nec feugiat nisl pretium. Non tellus orci ac auctor augue mauris.          Adipiscing elit pellentesque habitant morbi tristique. Massa sapien faucibus et molestie ac feugiat sed lectus. Eu augue ut lectus arcu. Ipsum faucibus vitae aliquet nec ullamcorper sit amet. Diam quam nulla porttitor massa id neque aliquam. Mattis vulputate enim nulla aliquet. Vel orci porta non pulvinar. Nullam ac tortor vitae purus faucibus ornare suspendisse. Leo integer malesuada nunc vel. Diam donec adipiscing tristique risus nec. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus dolor. Vestibulum sed arcu non odio euismod lacinia at quis risus.          In fermentum posuere urna nec tincidunt praesent. Eros in cursus turpis massa tincidunt dui. Egestas congue quisque egestas diam in arcu. Varius quam quisque id diam vel quam elementum pulvinar. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Purus in mollis nunc sed id semper risus in. Mauris vitae ultricies leo integer malesuada. Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Tortor id aliquet lectus proin nibh. Pellentesque habitant morbi tristique senectus et netus et. Amet dictum sit amet justo donec enim diam. Mi bibendum neque egestas congue quisque egestas diam in. Venenatis a condimentum vitae sapien pellentesque. Nunc sed id semper risus in hendrerit gravida rutrum. Turpis massa tincidunt dui ut ornare lectus sit.          Habitant morbi tristique senectus et netus et malesuada. Id donec ultrices tincidunt arcu non sodales. Nullam non nisi est sit amet facilisis magna etiam. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Felis donec et odio pellentesque diam volutpat. Tempor orci eu lobortis elementum nibh tellus molestie. Venenatis a condimentum vitae sapien pellentesque. Lectus nulla at volutpat diam ut venenatis tellus in metus. Pellentesque eu tincidunt tortor aliquam nulla facilisi. Egestas quis ipsum suspendisse ultrices gravida dictum fusce. Tempus quam pellentesque nec nam aliquam. Integer malesuada nunc vel risus commodo. Non odio euismod lacinia at quis risus sed vulputate. Nisl rhoncus mattis rhoncus urna neque. At auctor urna nunc id cursus metus aliquam eleifend mi. Tristique magna sit amet purus gravida. Vitae justo eget magna fermentum iaculis eu non diam phasellus. Risus sed vulputate odio ut enim blandit volutpat maecenas. Nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper.          Dui accumsan sit amet nulla facilisi morbi tempus iaculis. Fusce id velit ut tortor pretium viverra suspendisse potenti. Quam elementum pulvinar etiam non quam. Nulla facilisi morbi tempus iaculis urna id. Ac turpis egestas integer eget aliquet. Volutpat odio facilisis mauris sit amet massa vitae. Dictum non consectetur a erat nam at. Tortor id aliquet lectus proin nibh. Morbi leo urna molestie at elementum eu facilisis sed odio. Convallis tellus id interdum velit laoreet id. Sit amet risus nullam eget.          Congue eu consequat ac felis donec. Habitant morbi tristique senectus et netus et malesuada fames ac. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Dictum non consectetur a erat nam at lectus urna. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Quis ipsum suspendisse ultrices gravida dictum fusce ut. Vitae nunc sed velit dignissim sodales ut. Sed faucibus turpis in eu. Ipsum dolor sit amet consectetur adipiscing. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Commodo odio aenean sed adipiscing diam donec adipiscing. Molestie nunc non blandit massa enim nec. Varius quam quisque id diam vel. Sed turpis tincidunt id aliquet.',
          lastChangedId:
            'ALBJ4LvpUjPG6iVXa8vibKE0FafnztNmt9B3Qmmn8h0Z5SfAgNZSjfH1Dk33Ygrte_B_WuN1EIxZ4uBJoekEju8',
          sessionIntention: {
            description: 'This activity is to work on the hook of the essay.',
            createdAt: '2024-03-27T05:00:02.587Z',
          },
          chatLog: [
            {
              sender: 'SYSTEM',
              message:
                'This activity is to work on the hook that gets the readers interest at the start of the paper. We are going to consider the narrativity and the emotions that are connected with the intro.',
            },
            {
              sender: 'SYSTEM',
              message:
                "Feel free to edit the intro to your paper, and tell me when it's ready for me to review.",
            },
            {
              sender: 'USER',
              message: 'Ready',
            },
            {
              sender: 'SYSTEM',
              message:
                'Based on the absence of emotional evocativeness and narrativity, the hook in this essay is weak. It does not engage the reader or provide any narrative context. To improve the hook, it could benefit from incorporating emotions and narrative elements to create a more engaging and captivating introduction. The current rating for emotions is 1 and for narrativity is 1.',
            },
            {
              sender: 'SYSTEM',
              message: 'What would you like to work on?',
            },
          ],
          activity: '658230f699045156193339ac',
          intent: '',
          title: 'Same activity, 8 hour',
          lastModifyingUser: 'ashiel408@gmail.com',
          sessionId: '123',
          modifiedTime: '2024-03-27T04:53:41.735Z',
          createdAt: '2024-03-27T04:53:41.735Z',
          updatedAt: '2024-03-27T04:53:41.735Z',
        },
      });
    });

    /* This test case is checking for the display of a statement if it exists in the document timeline
   feature. Here's a breakdown of what the test is doing: */
    it.only('Do not display statement if it does not exists', () => {
      cy.visit('/docs/history/1LqProM_kIFbMbMfZKzvlgaFNl5ii6z5xwyAsQZ0U87Y');
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
