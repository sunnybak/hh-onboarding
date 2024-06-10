
export const TEST_MESSAGE = [{'role':'system', 'content': 'Be good'}, {'role':'user', 'content': 'What is the meaning of life'}] as Array<{role: string, content: string}>;

export const CODE_TEMPLATES = {
    'python': `
from openai import OpenAI
from honeyhive.tracer import HoneyHiveTracer

# place the code below at the beginning of your application execution
HoneyHiveTracer.init(
    api_key='{{API_KEY}}',
    project='{{PROJECT_NAME}}',
    source='dev', # e.g. "prod", "dev", etc.
    session_name='test',
)

client = OpenAI(api_key='<OPEN_API_KEY>')
completion = client.chat.completions.create(
    model='gpt-3.5-turbo',
    messages=` + JSON.stringify(TEST_MESSAGE) +`
)
print(completion.choices[0].message.content)
    `as string,

    'typescript': `
import { HoneyHiveTracer } from "honeyhive";

// place the code below at the beginning of your application
const tracer = await HoneyHiveTracer.init({
  apiKey: '{{API_KEY}}',
  project: '{{PROJECT_NAME}}',
  source: 'dev', // e.g. "prod", "dev", etc.
  sessionName: 'test',
});

await tracer.trace(async () => {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the meaning of life?" }
        ],
        model: "gpt-3.5-turbo",
      });
    
      console.log(completion.choices[0]);
});
}

main().catch(console.error);


    ` as string
} as { [key: string]: string };