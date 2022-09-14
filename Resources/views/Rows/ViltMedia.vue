<template>
    <div class="py-2 px-2" v-if="view === 'input'">
        <label v-if="row.name" :for="row.name" class="text-sm font-normal capitalize dark:text-gray-100" :class="{'text-red-600': message}">{{
                row.label ? row.label : row.name
            }}
            <span v-if="row.required" class="text-red-600 text-bold">*</span>
        </label>
        <div class="">
            <file-pond
                :allowReorder="true"
                :name="row.name"
                :max-files="row.max"
                :ref="row.name"
                :required="row.required"
                :disabled="row.disabled"
                styleImageEditButtonEditItemPosition="center"
                :class="{'border-danger-600 ring-danger-600' : message}"
                :allow-drop="true"
                :label-idle="`
                <div class='filepond-placeholder'>
                    <div>
                        <i class='bx bx-upload bx-sm'></i>
                    </div>
                    <div>
                        <span>`+(row.placeholder ? row.placeholder : row.name)+`</span>
                    </div>
                </div>
            `"
                v-bind:allow-multiple="row.multi"
                :accepted-file-types="row.type === 'image' ? 'image/jpeg, image/png' : null"
                v-bind:files="value"
                v-on:init="handleFilePondInit"
                @addfile="addNewFile"
                @removefile="removeFile"
            />
        </div>
        <small v-if="row.hint" class="text-gray-400 mx-2">{{row.hint}}</small>
        <JetInputError v-if="message" :message="message" class="mt-2" />
    </div>
    <div
        class="flex justify-between py-2 my-4"
        v-if="view === 'view'"
    >
        <div>
            <p class="font-bold capitalize">{{ row.label ? row.label : row.name }}</p>
        </div>
        <div>
            <div v-if="value" v-lazy-container="{ selector: 'img' }">
                <div v-if="value && row.multi">
                    <div v-for="(item, key) in value" :key="key">
                        <img
                            @click.prevent="popUp"
                            :data-src="item"
                            class="object-cover w-20 h-20 mx-auto rounded-full"
                        />
                    </div>
                </div>
                <div v-else>
                    <img
                        @click.prevent="popUp"
                        :data-src="value"
                        class="object-cover w-20 h-20 rounded-full border"
                    />
                </div>
            </div>
            <div  v-else>
                <img
                    v-lazy="$page.props.data.appUrl + '/placeholder.webp'"
                    class="object-cover w-20 h-20 rounded-full border"
                />
            </div>
        </div>
    </div>
    <div v-if="view === 'table'" class="p-4" v-lazy-container="{ selector: 'img' }">
        <div v-if="value"  @click.prevent="popUp">
            <img
                :data-src="value"
                class="object-cover w-20 h-20 mx-auto rounded-full border"
            />
        </div>
        <div v-else>
            <img
                v-lazy="$page.props.data.appUrl + '/placeholder.webp'"
                class="object-cover w-20 h-20 mx-auto rounded-full border"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately



// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import JetInputError from "@@/Jetstream/InputError.vue";

// // Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
);

export default defineComponent({
    components: {
        JetInputError,
        FilePond,
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
    data() {
        return {
            value: [],
            images: []
        };
    },
    mounted() {
        if(this.modelValue){
            this.value = this.modelValue;
        }
        else if(!this.modelValue && (this.view === 'table' || this.view === 'view')) {
            this.value = false;
        }
        if (this.row.default) {
            this.value = this.row.default;
        }
    },
    methods: {
        handleFilePondInit: function () {
            this.$refs[this.row.name].getFiles();
        },
        addNewFile(error,file){
            this.images.push(file.file);
            this.$emit("update:modelValue", this.images);
        },
        removeFile(error,file){
            this.images.splice(this.images.indexOf(file.file), 1);
        },
        popUp(){
            this.$emit('popUp', this.value)
        }
    },
});
</script>
