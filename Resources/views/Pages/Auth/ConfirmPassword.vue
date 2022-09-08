<script setup>
import { useForm, Head } from '@inertiajs/inertia-vue3'
import { ref } from 'vue'
import LayoutGuest from '@@/Layouts/LayoutGuest.vue'
import SectionFullScreen from '@@/Themes/AdminOne/SectionFullScreen.vue'
import CardBox from '@@/Themes/AdminOne/CardBox.vue'
import FormControl from '@@/Themes/AdminOne/FormControl.vue'
import FormField from '@@/Themes/AdminOne/FormField.vue'
import BaseDivider from '@@/Themes/AdminOne/BaseDivider.vue'
import BaseButton from '@@/Themes/AdminOne/BaseButton.vue'
import FormValidationErrors from '@@/Themes/AdminOne/FormValidationErrors.vue'
const form = useForm({
    password: ''
})
const passwordInput = ref(null)
const submit = () => {
    form.post(route('password.confirm'), {
        onFinish: () => {
            form.reset()
            passwordInput.value?.focus()
        }
    })
}
</script>
<template>
    <LayoutGuest>
        <Head title="Secure Area" />

        <SectionFullScreen
            v-slot="{ cardClass }"
            bg="purplePink"
        >
            <CardBox
                :class="cardClass"
                is-form
                @submit.prevent="submit"
            >
                <FormValidationErrors />
                <FormField>
                    <div class="mb-4 text-sm text-gray-600">
                        This is a secure area of the application. Please confirm your password before continuing.
                    </div>
                </FormField>
                <FormField
                    label="Password"
                    label-for="password"
                    help="Please enter your password to confirm"
                >
                    <FormControl
                        id="password"
                        @set-ref="passwordInput = $event"
                        v-model="form.password"
                        type="password"
                        required
                        autocomplete="current-password"
                    />
                </FormField>
                <BaseDivider />
                <BaseButton
                    type="submit"
                    color="info"
                    label="Confirm"
                    :class="{ 'opacity-25': form.processing }"
                    :disabled="form.processing"
                />
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
