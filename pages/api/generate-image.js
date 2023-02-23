import {StableDiffusionService} from './stable-diffusion-service'

export default async function (req, res) {
  const cardInfo = req.body.cardInfo || '';

  try {
    let imagePrompt = `${cardInfo.type} "${cardInfo.color} ${cardInfo.name}" ${cardInfo.description},  (fantasy) (dark) (painting) (airbrush) (oil) (detail)`
    
    let sdw = new StableDiffusionService()
    const imageInfo = await sdw.createImage({prompt: imagePrompt})
    res.status(200).json({ imageUrl: imageInfo });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with Stable Diffusion API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

