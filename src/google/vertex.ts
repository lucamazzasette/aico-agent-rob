import { GoogleAuth } from 'google-auth-library';
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

// Path to your service account key file
const keyFilePath = process.env.Google_APPLICATION_CREDENTIALS;
const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;

// Create an auth client with the service account key file
async function authorize() {
  const authClient = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  // Get the authorization client
  await authClient.getClient();

  // Use the client to access Vertex AI
  const vertexAIClient = new VertexAI({
    project: projectId,
    location: 'us-europe',
  });

  // Example: Create a generative model and start a chat
  const model = 'gemini-1.5-flash-002';
  const generativeModel = vertexAIClient.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      'maxOutputTokens': 8192,
      'temperature': 1,
      'topP': 0.95,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      }
    ],
    tools: [
      {
        retrieval: {
          vertexAiSearch: {
            datastore: 'projects/enterprise-search-402309/locations/global/collections/default_collection/dataStores/agent-robotics_1732363078115',
          }
        },
      },
    ],
  });

  const chat = generativeModel.startChat({});
  console.log('Chat started:', chat);
}

authorize().catch(console.error);
