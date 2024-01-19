import axios from 'axios'
export class StableDiffusionService {
  async createImage(options: { prompt: string }) {
    let response = await axios.post(
      'http://192.168.0.100:7860/sdapi/v1/txt2img',
      // '{\n  "enable_hr": false,\n  "denoising_strength": 0,\n  "firstphase_width": 0,\n  "firstphase_height": 0,\n  "hr_scale": 2,\n  "hr_upscaler": "string",\n  "hr_second_pass_steps": 0,\n  "hr_resize_x": 0,\n  "hr_resize_y": 0,\n  "prompt": "Blue Creature Flying Fairy (fantasy) (air brush)",\n  "styles": [\n  ],\n  "seed": -1,\n  "subseed": -1,\n  "subseed_strength": 0,\n  "seed_resize_from_h": -1,\n  "seed_resize_from_w": -1,\n  "sampler_name": "Euler",\n  "batch_size": 1,\n  "n_iter": 1,\n  "steps": 50,\n  "cfg_scale": 7,\n  "width": 512,\n  "height": 512,\n  "restore_faces": false,\n  "tiling": false,\n  "negative_prompt": "",\n  "eta": 0,\n  "s_churn": 0,\n  "s_tmax": 0,\n  "s_tmin": 0,\n  "s_noise": 1,\n  "override_settings": {},\n  "override_settings_restore_afterwards": true,\n  "script_args": [],\n  "sampler_index": "Euler",\n  "script_name": null\n}',
      {
          'enable_hr': false,
          'denoising_strength': 0,
          'firstphase_width': 0,
          'firstphase_height': 0,
          'hr_scale': 2,
          'hr_upscaler': 'string',
          'hr_second_pass_steps': 0,
          'hr_resize_x': 0,
          'hr_resize_y': 0,
          'prompt': options.prompt,
          'styles': [],
          'seed': -1,
          'subseed': -1,
          'subseed_strength': 0,
          'seed_resize_from_h': -1,
          'seed_resize_from_w': -1,
          'sampler_name': 'Euler',
          'batch_size': 1,
          'n_iter': 1,
          'steps': 26,
          'cfg_scale': 7,
          'width': 512,
          'height': 384,
          'restore_faces': false,
          'tiling': false,
          'negative_prompt': '(magic the gathering), card, text, word, framed, photo, panel, (nude), naked',
          'eta': 0,
          's_churn': 0,
          's_tmax': 0,
          's_tmin': 0,
          's_noise': 1,
          'override_settings': {},
          'override_settings_restore_afterwards': true,
          'script_args': [],
          'sampler_index': 'Euler',
          'script_name': null
      },
      {
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
          }
      }
  );
  return response.data.images[0]
  }
}