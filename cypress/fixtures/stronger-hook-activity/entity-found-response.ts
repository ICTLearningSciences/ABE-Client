/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { JobStatus, AiJobStatusApiRes } from "../../helpers/types";


export interface Experience {
    experience: string;
    interest: number;
    justification: string;
    question: string;
  }
  
  export interface EntityDetectionPromptResponse {
    experiences: Experience[];
    response: string;
  }

export const entityFoundResponse = (entities: Experience[], jobStatus?: JobStatus): AiJobStatusApiRes => {
    const _response: EntityDetectionPromptResponse = {
        experiences: entities,
        response: "This is the entity found response."
    }
    const response = JSON.stringify(_response);

    return {
        "response": {
            "aiServiceResponse": {
                "aiAllStepsData": [
                    {
                        "aiServiceRequestParams": {
                            "messages": [
                                {
                                    "role": "system",
                                    "content": "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2021-09."
                                },
                                {
                                    "role": "user",
                                    "content": "You are a USC professor grading a papers thesis. You will first be given a message from the user which you will extract people and places from. You will then rank those people and places by which you find most interesting to include in the users thesis.\n\nUsers message to pull entities from: my brother, my sister, Ben Stiller, Ryan Reynolds, and my dog Clifford\n\n{\n\t“entitiesFound”: [       {            \"entityName\": \"entity1\",            \"interest\": <1-5>       }       ]\n}\n\nYou must respond as JSON following the format above. Only respond using valid JSON. Please check that the JSON is valid and follows the format given.\n\nHere is the users essay, please use the thesis from the paper to rank the people and places previously extracted:\n\nFlorida Department of Health Advises Against Latest Coronavirus Booster\nThe Florida Department of Health is advising against the latest coronavirus booster shot for individuals younger than the age of 65, issuing several warnings, highlighting the potential adverse effects, including cardiovascular conditions such as myocarditis.\nThe department released its guidance on September 13 following the federal government’s approval of the latest mRNA booster shot on September 11.\n“While the initial mRNA COVID-19 vaccines were authorized by the United States Food and Drug Administration (FDA) utilizing human clinical trial data, the most recent booster approval was granted in the absence of any meaningful booster-specific clinical trial data performed in humans,” the Florida Department of Health wrote, contending that the federal government “failed to provide sufficient data to support the safety and efficacy of the COVID-19 vaccines.”\nBecause of that, the department is expecting healthcare providers in the Sunshine State to remain transparent and offer individuals who are considering the new booster shot all of the information.\n“Based on the high rate of global immunity and currently available data, the State Surgeon General recommends against the COVID-19 booster for individuals under 65,” the guidance reads, urging individuals 65 and older to consult with their healthcare providers, who should review all potential concerns and information provided in the guidance.\nThe department said both providers and patients should be aware that the mRNA booster shots “present a risk of subclinical and clinical myocarditis and other cardiovascular conditions among otherwise healthy individuals.”\nIt also warned of the “unknown risk of potential adverse impacts with each additional dose of the mRNA COVID-19 vaccine; currently individuals may have received five to seven doses (and counting) of this vaccine over a 3-year period.”\nUltimately, Surgeon General Joseph Ladapo urges Floridians to stay healthy by staying physically active, eating more vegetables and healthy fats, minimizing processed food, and spending time outside.\nThe guidance contains 14 references on the last two pages on claims made in the document.\n“CDC & FDA continue to push COVID vaccines that are not backed by clinical evidence, but blind faith alone with ZERO regard for widespread immunity,” Ladapo said on social media, sharing the guidance.\n“The American people deserve the truth, but the Biden admin only wants to control your behavior,” he warned.\nFlorida Gov. Ron DeSantis supports Ladapo’s decision, asserting that the latest booster was “hastily” approved.\n“We will not stand by and let the FDA and CDC use Floridians as guinea pigs for mRNA jabs that have not been proven to be safe or effective,” he added:\nThe Food and Drug Administration (FDA) approved and authorized the updated booster on Monday, opening the jab to everyone five years and older, regardless of previous vaccination.\nIt also opens up this booster to babies, noting that “individuals 6 months through 4 years of age who have previously been vaccinated against COVID-19 are eligible to receive one or two doses of an updated mRNA COVID-19 vaccine (timing and number of doses to administer depends on the previous COVID-19 vaccine received).”\nThe FDA adds that unvaccinated babies and toddlers, those six months through four years old, are eligible for up to three jabs — “three doses of the updated authorized Pfizer-BioNTech COVID-19 Vaccine or two doses of the updated authorized Moderna COVID-19 Vaccine.”\nDespite misinformation initially spread by President Joe Biden, coronavirus vaccines do not prevent transmission of the virus, nor do they prevent one from contracting it.\nBiden said during a town hall in July 2021:\nBut again, one last thing. I — we don’t talk enough to you about this, I don’t think. One last thing that’s really important is: We’re not in a position where we think that any virus — including the Delta virus, which is much more transmissible and more deadly in terms of non — unvaccinated people — the vi- — the various shots that people are getting now cover that. They’re — you’re okay. You’re not going to — you’re not going to get COVID if you have these vaccinations.\nIronically, exactly one year later, the vaccinated and boosted president contracted the virus.\n\n"
                                }
                            ],
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "aiServiceResponse": [
                            {
                                "index": 0,
                                "message": {
                                    "refusal": null,
                                    "role": "assistant",
                                    "content": response
                                },
                                "finish_reason": "stop",
                                "logprobs": null
                            }
                        ],
                        tokenUsage:{
                            promptUsage: 1,
                            completionUsage: 1,
                            totalUsage: 2
                        }
                    }
                ],
                "answer": response
            },
            jobStatus: jobStatus || JobStatus.COMPLETE
        }
    }
}