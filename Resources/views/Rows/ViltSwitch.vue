<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <br>
        <Toggle
            :name="row.name"
            :id="row.name"
            v-model="value"
            @change="$emit('update:modelValue', value)"
            :classes="{
              container: 'inline-block rounded-full outline-none focus:ring focus:ring-'+row.color+'-500 focus:ring-opacity-30',
              toggle: 'flex w-12 h-5 rounded-full relative cursor-pointer transition items-center box-content border-2 text-xs leading-none',
              toggleOn: 'bg-'+row.color+'-500 border-'+row.color+'-500 justify-start text-white',
              toggleOff: 'bg-gray-200 border-gray-200 justify-end text-gray-700',
              toggleOnDisabled: 'bg-gray-300 border-gray-300 justify-start text-gray-400 cursor-not-allowed',
              toggleOffDisabled: 'bg-gray-200 border-gray-200 justify-end text-gray-400 cursor-not-allowed',
              handle: 'inline-block bg-white w-5 h-5 top-0 rounded-full absolute transition-all',
              handleOn: 'left-full transform -translate-x-full',
              handleOff: 'left-0',
              handleOnDisabled: 'bg-gray-100 left-full transform -translate-x-full',
              handleOffDisabled: 'bg-gray-100 left-0',
              label: 'text-center w-8 border-box whitespace-nowrap select-none',
            }"
            :disabled="row.disabled"
        />
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError :message="message" class="mt-2" />
    </div>
    <div v-if="view === 'view'" class="flex justify-between my-4">
        <div>
            <p class="font-bold capitalize">{{ row.label ? row.label : row.name }}</p>
        </div>
        <div>
            <div v-if="modelValue == 1" class="filament-tables-boolean-column px-4 py-3">
                <svg class="w-6 h-6 text-success-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>

            <div v-else class="filament-tables-boolean-column px-4 py-3">
                <svg class="w-6 h-6 text-danger-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
    </div>
    <div v-if="view === 'table'" class="flex justify-between my-4">
        <div v-if="modelValue == 1" class="filament-tables-boolean-column px-4 py-3">
            <svg class="w-6 h-6 text-success-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>

        <div v-else class="filament-tables-boolean-column px-4 py-3">
            <svg class="w-6 h-6 text-danger-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";
import Toggle from "@vueform/toggle";
import JetInputError from "@@/Jetstream/InputError.vue";
import JetLabel from "@@/Jetstream/Label.vue";
import '@vueform/toggle/themes/default.css';

export default defineComponent({
    components: {
        Toggle,
        JetInputError,
        JetLabel,
    },
    data() {
        return {
            value: false
        }
    },
    mounted(){
        if(this.row.default){
            this.value = this.row.default
        }
    },
    beforeUpdate() {
        if(this.modelValue){
            this.value = this.modelValue
            if(this.modelValue == "1"){
                this.value = true;
            }

        }
    },
    props: {
        modelValue: false,
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
});
</script>
