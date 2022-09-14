<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <VueEditor
            v-model="value"
            :id="row.name"
            :disabled="row.disabled"
            :placeholder="row.placeholder"
            @text-change="$emit('update:modelValue', value)"
            :class="{'border-danger-600 ring-danger-600' : message}"
        />
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError v-if="message" :message="message" class="mt-2" />
    </div>
    <div class="flex justify-between my-4" v-if="view === 'view'">
        <div>
            <p class="font-bold capitalize">{{ row.label ? row.label: row.name }}</p>
        </div>
        <div>
            <div v-html="modelValue"></div>
        </div>
    </div>
    <div v-if="view === 'table'">
        <div v-html="modelValue"></div>
    </div>
</template>

<script>
import JetInputError from "@@/Jetstream/InputError.vue";
// Basic Use - Covers most scenarios
import { VueEditor } from "vue3-editor";

export default {
    components: {
        JetInputError,
        VueEditor
    },
    data() {
        return {
            value: "",
        };
    },
    created() {
        if (this.modelValue) {
            this.value = this.modelValue
        }

    },
    mounted() {
        if (this.row.default) {
            this.value = this.row.default
        }
    },
    props: {
        modelValue: {},
        row: {
            Object,
            default: {},
        },
        view: {
            String,
            default: "input",
        },
        message: {
            String,
            default: null,
        },
    },
};
</script>
