import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }
  const chosenColor = req.body.color || '';

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal, chosenColor),
      temperature: 0.9,
      max_tokens: 1024
    });
    let parsedResult = JSON.parse(completion.data.choices[0].text)
    const imageInfo = await openai.createImage({
      prompt:`Magic fantasy, realistic, intimidating: ${parsedResult.type} "${parsedResult.color} ${parsedResult.name}" ${parsedResult.description}, air brushed, ((${parsedResult.type} only))`,
      n:1,
      size:"512x512"
    })
    res.status(200).json({ result: parsedResult, imageUrl: imageInfo.data.data[0].url });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(cardType, chosenColor) {
  return `Give details for a magic the gathering card in JSON for example:

{
  "type": "Creature",
  "name": "Elevated Nymph",
  "description": "As long as it's not your turn, spells you cast cost 1 less to cast.",
  "strength": 2,
  "defense": 3,
  "color": "Green",
  "rarity": "Mythic",
  "subType" : "Nymph",
  "abilities": [{"ability": "Toxic", "amount": 2}, {"ability": "Flying", amount: 1}],
  "counters": [],
  "mana_cost": { "colorless": 4, "blue": 0, "red": 0, "green": 3, "white": 0, "black": 0 }
}

Fill in the model properties and return parseable JSON only:
{
  "type": "${cardType}",
  "name": ,
  "description": ,
  "strength": ,
  "defense": ,
  "color": ${chosenColor!=''?"\""+chosenColor+"\"":''},
  "rarity": ,
  "subType": ,
  "abilities": ,
  "counters": ,
  "mana_cost": {},
}`;
}
