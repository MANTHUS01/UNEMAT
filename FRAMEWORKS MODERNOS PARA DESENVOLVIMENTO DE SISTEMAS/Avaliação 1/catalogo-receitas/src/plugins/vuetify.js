import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4CAF50',
          secondary: '#FF9800',
          background: '#FFFFFF',
        }
      },
      dark: {
        colors: {
          primary: '#2E7D32',
          secondary: '#F57C00',
          background: '#121212',
        }
      }
    }
  }
})