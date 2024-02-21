import { JobStatus, OpenAiJobStatusApiRes } from "../../helpers/types";

export const helpBrainstormResponse = (jobStatus?: JobStatus): OpenAiJobStatusApiRes => {
    return {
        "response":{
            "openAiResponse": {
                "openAiData": [
                    {
                        "openAiPrompt": {
                            "messages": [
                                {
                                    "role": "system",
                                    "content": "You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2021-09."
                                },
                                {
                                    "role": "user",
                                    "content": "You are a USC Writing Professor. Brainstorm some narrative content about the writer's life experiences that would strengthen the essay below to focus on the emotions and feeling of why this is important. Please list specific emotions and examples.\n\nAI ethics is a critical field of study and practice that aims to ensure that artificial intelligence systems are developed, deployed, and used in a responsible and morally sound manner. It encompasses a range of principles and guidelines to address concerns related to fairness, accountability, transparency, privacy, and bias in AI systems. Central to AI ethics is the need to balance the potential benefits of AI with the potential risks and consequences, while also considering the social, cultural, and legal implications of AI technologies. As AI continues to advance and integrate into various aspects of society, the ethical considerations surrounding its design and use become increasingly important in shaping a future where AI benefits humanity while minimizing harm.\n"
                                }
                            ],
                            "model": "gpt-3.5-turbo-16k"
                        },
                        "openAiResponse": [
                            {
                                "index": 0,
                                "message": {
                                    "role": "assistant",
                                    "content": "Example help brainstorm response."
                                },
                                "finish_reason": "stop"
                            }
                        ]
                    }
                ],
                "answer": "Example help brainstorm response."
            },
            jobStatus: jobStatus || JobStatus.COMPLETE
        }
    }
}