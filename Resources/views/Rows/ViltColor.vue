<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <br>
        <VSwatches v-model="value" show-fallback fallback-input-type="color" popover-x="left" :disabled="row.disabled"></VSwatches>
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError :message="message" class="mt-2" />
    </div>
    <div class="flex justify-between my-4" v-if="view === 'view'">
        <div>
            <p class="font-bold">{{ row.label ? row.label: row.name }}</p>
        </div>
        <div>
            <div class="py-2 px-2 rounded-full w-8 h-8 mx-auto capitalize" :style="'background-color: '+modelValue"></div>
        </div>
    </div>
    <div v-if="view === 'table'">
        <div>
            <div class="py-2 px-2 rounded-full w-8 h-8 mx-auto" :style="'background-color: '+modelValue"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetInputError from "@@/Jetstream/InputError.vue";
import VSwatches from "vue3-swatches";

export default defineComponent({
    components: {
        JetInputError,
        VSwatches,
    },
    data() {
        return {
            value: "",
        };
    },
    mounted() {
        if (this.modelValue) {
            this.value = this.modelValue;
        }
        if (this.row.default) {
            this.value = this.row.default;
        }
    },
    watch:{
        value(oldValue, newValue){
            this.$emit('update:modelValue', this.value)
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
});
</script>
