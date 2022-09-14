<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <multiselect
            v-if="hasMediaOrDescription"
            v-model="value"
            :options="row.options"
            :multiple="row.multi"
            :track-by="row.trackById"
            :label="row.trackByName"
            :disabled="row.disabled"
            class="mt-2"
            :class="{'border-danger-600 ring-danger-600' : message}"
        >
            <template #singleLabel="props">
                <div class="flex justify-start space-x-2">
                    <img class="option__image w-8" v-if="props.option.media" :src="props.option.media" alt="No Man’s Sky">
                    <span class="option__desc">
                        <span class="option__title">
                            {{ props.option.name }}
                        </span>
                        <br>
                        <span class="option__small text-sm text-gray-400" v-if="props.option.description">
                            {{ props.option.description }}
                        </span>
                    </span>
                </div>
            </template>
            <template #option="props">
                <div class="flex justify-start space-x-2">
                    <img class="option__image w-8" v-if="props.option.media" :src="props.option.media" :alt="props.option.name">
                    <div class="option__desc">
                        <span class="option__title">
                            {{ props.option.name }}
                        </span>
                        <br>
                        <span class="option__small text-sm text-gray-400" v-if="props.option.description">
                            {{ props.option.description }}
                        </span>
                    </div>
                </div>
            </template>
        </multiselect>
        <multiselect
            v-else
            v-model="value"
            :options="row.options"
            :multiple="row.multi"
            :track-by="row.trackById"
            :label="row.trackByName"
            :disabled="row.disabled"
            :class="row.className"
            class="mt-2"
        >
        </multiselect>
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError :message="message" class="mt-2" />
    </div>
    <div class="flex justify-between my-4" v-if="view === 'view' && modelValue">
        <div>
            <p class="font-bold capitalize">{{ row.label ? row.label: row.name }}</p>
        </div>
        <div>
            <p>{{ modelValue[row.trackByName] }}</p>
        </div>
    </div>
    <div v-if="view === 'table' && modelValue">
        <p>{{ modelValue[row.trackByName] }}</p>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetInputError from "@@/Jetstream/InputError.vue";
import Multiselect from "@suadelabs/vue3-multiselect";
import "@suadelabs/vue3-multiselect/dist/vue3-multiselect.css";

export default defineComponent({
    components: {
        JetInputError,
        Multiselect,
    },
    data() {
        return {
            value: "",
        };
    },
    computed:{
        hasMediaOrDescription(){
            return this.row.options.some(option => option.media || option.description);
        },
    },
    beforeUpdate() {
        if (this.row.default) {
            this.value = this.row.default;
        }
    },
    mounted() {
        if (this.modelValue) {
            this.value = this.modelValue;
        }
    },
    watch: {
        value(oldValue, newValue) {
            this.$emit("update:modelValue", this.value);
            this.$emit("change");
        },
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
