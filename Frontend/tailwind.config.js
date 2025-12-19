import daisyui from "daisyui"
import themes from "daisyui/theme/object"
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [daisyui], 
    daisyui:{
      themes:["emerald","light","dark","cupcake","retro"]
    }
  }
  