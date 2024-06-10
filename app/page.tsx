'use client'

import React from "react";
import StepComponent from "@/components/onboarding/StepComponent";
import FrameworkComponent from "@/components/onboarding/FrameworkComponent";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { CopyBlock, dracula } from "react-code-blocks";
import { CODE_TEMPLATES, TEST_MESSAGE } from "@/data/data"

const processCodeTemplate = (code: string, projectName: string, apiKey: string) => {
  return code.replace("{{PROJECT_NAME}}", projectName).replace("{{API_KEY}}", apiKey);
}

export default function Dashboard() {

  const WAIT_PERIOD = 300000; // 5 minutes

  const [projectName, setProjectName] = React.useState("SoulChat");
  const [apiKey, setApiKey] = React.useState("cWV2YnRiM2o4eW5mdm1wMHh3MGgycg==");
  const [platform, setPlatform] = React.useState("python");
  const [code, setCode] = React.useState(processCodeTemplate(CODE_TEMPLATES[platform], projectName, apiKey));

  const [latestEvent, setLatestEvent] = React.useState({} as any);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [testState, setTestState] = React.useState("NOT_STARTED"); // NOT_STARTED, IN_PROGRESS, COMPLETED_OK, COMPLETED_ERROR

  // useEffect to update code when platform, projectName, or apiKey change
  React.useEffect(() => {
    setCode(processCodeTemplate(CODE_TEMPLATES[platform], projectName, apiKey));
  }, [platform, projectName, apiKey]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setTestState('IN_PROGRESS');
        fetch('https://api.honeyhive.ai/projects?name=' + projectName, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
          }
        })
          .then(response => {
            // Handle the response
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Could not get your project.');
            }
          })
          .then(data => {
            // if data = [] then create a project
            if (data.length === 0) {
              fetch('https://api.honeyhive.ai/projects', {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer ' + apiKey,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: projectName,
                })
              })
                .then(response => {
                  // Handle the response
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error('Could not create project.');
                  }
                })
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  // Handle any errors
                  console.error('Error:', error);
                });
            }
          })
          .catch(error => {
            // Handle any errors
            console.error('Error:', error);
          });

        const currentDate = (new Date()).getTime();
        console.log(currentDate);
        const response = await fetch('https://api.honeyhive.ai/events/export', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: projectName,
          }),
        });

        if (response.ok) {
          // If a successful response is received, set receivedResponse to true and stop querying
          const data = await response.json();
          if (!data.events) {
            throw new Error('No events found');
          }

          const recentEvents: Array<any> = data.events.filter((event: any) => {
            return event.event_type === 'model' && currentDate - event.end_time < WAIT_PERIOD
              && TEST_MESSAGE[1].content === event.inputs.chat_history[1].content;
          });

          if (recentEvents.length === 0) {
            throw new Error('No events found in the last 5 minutes. Run your code and click the retry button.');
          }

          // get the latest event
          setLatestEvent(recentEvents.sort((a: any, b: any) => b.end_time - a.end_time)[0]);
          setTestState('COMPLETED_OK');

        } else {
          throw new Error('The API request failed');
        }
      } catch (error: any) {
        setTestState('COMPLETED_ERROR');
        setErrorMessage(error.message);
      }
    };

    if (testState === 'IN_PROGRESS') {
      fetchData();
      const interval = setInterval(fetchData, 60000); // Query every 1 min
      return () => {
        clearInterval(interval); // Clear the interval on component unmount
      };
    }
  }, [testState, projectName, apiKey]);


  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">Set up your HoneyHive Instrumentation in 4 steps</h1>
      <p className="mt-4 max-w-2xl text-sm text-gray-500">
        HoneyHive is a tool that helps you monitor and analyze your AI models in production.
        To set up, first create a project and get an API key. Then, choose your platform and paste the code snippet into your application.
        Finally, run the code and test your integration by getting the latest event.
      </p>
      <div className="mt-10">
        <StepComponent stepNumber={1} stepText="Enter your project name and API key" />
        <p className="mt-4 max-w-2xl text-sm text-gray-500">You can use an existing project or create a new one.</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>Project Name </p>
          <Input
            type="text"
            placeholder="My project"
            className="m-3 mr-3"
            style={{ width: '200px' }}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <p>HoneyHive API Key </p>
          <Input
            type="text"
            placeholder="API Key"
            className="m-3 my-3"
            style={{ width: '400px' }}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-10">

        <div className="mt-4">
          <StepComponent stepNumber={2} stepText="Choose your platform" />
          <FrameworkComponent onValueChange={setPlatform}/>
        </div>
      </div>
      <div className="mt-10">
        <StepComponent stepNumber={3} stepText="Paste this snippet to into your code" />
        <div className="mt-4">
          <CopyBlock
            language='typescript'
            text={code}
            theme={dracula}
            showLineNumbers={false}
            codeBlock
            customStyle={{
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          />
        </div>
      </div>
      <div className="mt-10">
        <StepComponent stepNumber={4} stepText="Test your code" />
        {testState === 'IN_PROGRESS' ?
          <p>Awaiting result...</p>

          : testState === 'NOT_STARTED' ?
            <div>
              <div className="mt-4">
                <p>Click the test button once you have run the code</p>
              </div>
              <Button onClick={() => setTestState('IN_PROGRESS')} className='my-4'>Test</Button>
            </div>
            : testState === 'COMPLETED_OK' ?
              <div>
                <p>Received result! You are all set!</p>
                <div className="my-4">
                  <CopyBlock
                    language='typescript'
                    text={JSON.stringify(latestEvent)}
                    theme={dracula}
                    showLineNumbers={false}
                    codeBlock
                    customStyle={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <Button onClick={() => setTestState('IN_PROGRESS')} className='my-4'>Retry</Button>
              </div>
              : <div>
                <p>Test failed</p>
                <p>{errorMessage}</p>
                <Button onClick={() => setTestState('IN_PROGRESS')} className='my-4'>Retry</Button>
              </div>
        }
      </div>
    </div>
  )
}