import { StableDiffusionService } from './stable-diffusion-service'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {

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
  const useStableDiffusion = req.body.useStableDiffusion || false;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: generatePrompt(animal, chosenColor),
      response_format: { "type": "json_object" },
      temperature: 0.9,
      max_tokens: 1024
    });
    console.log(completion.choices)
    let parsedResult = JSON.parse(completion.choices[0].message.content)

    let imagePrompt = `${parsedResult.type} "${parsedResult.color} ${parsedResult.name}" ${parsedResult.description},  (fantasy) (dark) (painting) (airbrush) (oil) (detail)`

    let imageInfo;

    if (useStableDiffusion) {
      let sdw = new StableDiffusionService()
      imageInfo = await sdw.createImage({ prompt: imagePrompt })
    }
    else {
      let openAIResponse = await openai.createImage({
        prompt: `Magic fantasy, realistic, intimidating: ${parsedResult.type} "${parsedResult.color} ${parsedResult.name}" ${parsedResult.description}, air brushed, ((${parsedResult.type} only))`,
        n: 1,
        size: "512x512",
        response_format: 'b64_json'
      })

      imageInfo = openAIResponse.data.data[0].b64_json
    }


    res.status(200).json({ result: parsedResult, imageUrl: imageInfo });
  } catch (error) {
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
  return [{
    role: 'system', content: `Give details for a magic the gathering card in JSON for example:

{
  "type": "Creature",
  "name": "Elevated Nymph",
  "description": "As long as it's not your turn, spells you cast cost 1 less to cast.",
  "strength": 2,
  "defense": 3,
  "color": "Green",
  "rarity": "Mythic",
  "subType" : "Nymph",
  "abilities": [{"ability": "Toxic", "amount": 2}, {"ability": "Flying", "amount": 1}],
  "counters": [],
  "mana_cost": { "colorless": 4, "blue": 0, "red": 0, "green": 3, "white": 0, "black": 0 }
}`
  },
  {
    role: 'user', content: `Fill in the model properties and return parseable JSON only:
{
  "type": "${cardType}",
  "name": ,
  "description": ,
  "strength": ,
  "defense": ,
  "color": ${chosenColor != '' ? "\"" + chosenColor + "\"" : ''},
  "rarity": ,
  "subType": ,
  "abilities": ,
  "counters": ,
  "mana_cost": {},
}`}];
}
