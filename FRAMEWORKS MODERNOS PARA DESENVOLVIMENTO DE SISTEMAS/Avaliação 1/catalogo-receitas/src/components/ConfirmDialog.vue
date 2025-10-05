<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        <v-icon 
          :color="type === 'delete' ? 'error' : 'warning'" 
          class="mr-2"
        >
          {{ type === 'delete' ? 'mdi-alert-circle' : 'mdi-information' }}
        </v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="grey" 
          variant="text" 
          @click="cancel"
        >
          Cancelar
        </v-btn>
        <v-btn 
          :color="type === 'delete' ? 'error' : 'primary'" 
          variant="flat" 
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmação'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'confirm',
      validator: (value) => ['confirm', 'delete'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm')
      this.dialog = false
    },
    cancel() {
      this.$emit('cancel')
      this.dialog = false
    }
  }
}
</script>