<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-medium leading-4 text-gray-700 dark:text-gray-300 capitalize" :class="{'text-red-600': message}">{{
            row.label ? row.label : row.name
        }}
        <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <input
            :type="row.type? row.type: 'text'"
            :name="row.name"
            :id="row.name"
            :disabled="row.disabled"
            :value="modelValue"
            v-model="value"
            :placeholder="row.placeholder"
            @input="$emit('update:modelValue', value)"
            class="block my-2 w-full transition duration-75 rounded-lg shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-inset focus:ring-primary-500 disabled:opacity-70 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 border-gray-300 dark:border-gray-600"
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
            <p>{{ modelValue }}</p>
        </div>
    </div>
    <div v-if="view === 'table'">
        <p>{{ modelValue }}</p>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetInputError from "@@/Jetstream/InputError.vue";

export default defineComponent({
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
    components: {
        JetInputError,
    },
    data(){
        return {
            value: ""
        }
    },
    mounted(){
        if(this.modelValue){
            this.value = this.modelValue
        }
        if(this.row.default && !this.modelValue){
            this.value = this.row.default
        }
    },
});
</script>
