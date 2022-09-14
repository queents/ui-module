<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>

        <div>
            <div
                class="p-4 my-4 border rounded-lg"
            >
                <div v-for="(item, key) in row.options">
                    <ViltText v-if="item.vue === 'ViltText.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltEmail v-if="item.vue === 'ViltEmail.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltTel v-if="item.vue === 'ViltTel.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltTextArea v-if="item.vue === 'ViltTextArea.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltNumber v-if="item.vue === 'ViltNumber.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltSelect v-if="item.vue === 'ViltSelect.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltSwitch v-if="item.vue === 'ViltSwitch.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltColor v-if="item.vue === 'ViltColor.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltDate v-if="item.vue === 'ViltDate.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltDateTime v-if="item.vue === 'ViltDateTime.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltTime v-if="item.vue === 'ViltTime.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                    <ViltMedia v-if="item.vue === 'ViltMedia.vue'" :row="item" v-model="main[item.name]" @update:modelValue="update"/>
                </div>
            </div>
        </div>
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError v-if="message" :message="message" class="mt-2" />
    </div>

    <div v-if="view === 'view'">
        <div class="flex justify-between my-4">
            <div>
                <p class="font-bold capitalize">{{ row.label }}</p>
            </div>
            <div></div>
        </div>
        <div class="border rounded-lg py-2 px-2">
            <div
                v-for="(item, key) in row.options"
                :key="key"
                :class="{ 'border-b': key !== row.options.length - 1 }"
                class="py-4 flex justify-between"
            >
                <div>
                    <p class="font-bold">{{ item.label }}</p>
                </div>

                <div v-if="item.vue === 'ViltMedia.vue'">
                    <img :src="main[item.name]" alt="" class="w-16" />
                </div>
                <div v-else>
                    <p>{{ main[item.name] }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetInputError from "@@/Jetstream/InputError.vue";
import ViltText from '$$/ViltText.vue'
import ViltTel from '$$/ViltTel.vue'
import ViltTextArea from "$$/ViltTextArea.vue";
import ViltNumber from "$$/ViltNumber.vue";
import ViltSelect from "$$/ViltSelect.vue";
import ViltSwitch from "$$/ViltSwitch.vue";
import ViltColor from "$$/ViltColor.vue";
import ViltEmail from "$$/ViltEmail.vue";
import ViltDate from "$$/ViltDate.vue";
import ViltDateTime from "$$/ViltDateTime.vue";
import ViltTime from "$$/ViltTime.vue";
import ViltMedia from "$$/ViltMedia.vue";

export default defineComponent({
    components: {
        JetInputError,
        ViltTextArea,
        ViltText,
        ViltTel,
        ViltNumber,
        ViltSelect,
        ViltSwitch,
        ViltColor,
        ViltEmail,
        ViltDate,
        ViltDateTime,
        ViltTime,
        ViltMedia,
    },
    data() {
        return {
            main: [],
        };
    },
    mounted() {
        if (this.row.default && !this.modelValue) {
            this.main = this.row.default;
        }
        if (this.modelValue) {
            this.main = this.modelValue;
        }
        else {
            this.main = this.optionRows;
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
    computed:{
        optionRows(){
            let rows = {};
            for(let i=0; i<this.row.options.length; i++){
                if(this.row.options[i].default){
                    rows[this.row.options[i].name] = this.row.options[i].default;
                }
                else {
                    if(this.row.options[i].vue === 'ViltSwitch.vue'){
                        rows[this.row.options[i].name] = false;
                    }
                    else if(this.row.options[i].vue === 'ViltColor.vue'){
                        rows[this.row.options[i].name] = "#000000";
                    }
                    else {
                        rows[this.row.options[i].name] = "";
                    }
                }
            }
            return rows;
        }

    },
    methods: {
        update() {
            this.$emit("update:modelValue", this.main);
        },
    },
});
</script>
