<template>
    <div>
        <div v-for="(item, key) in rows" :key="key">
            <ViltText
                v-if="item.vue === 'ViltText.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltEmail
                v-if="item.vue === 'ViltEmail.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltTel
                v-if="item.vue === 'ViltTel.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltTextArea
                v-if="item.vue === 'ViltTextArea.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltNumber
                v-if="item.vue === 'ViltNumber.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltSelect
                v-if="item.vue === 'ViltSelect.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltSwitch
                v-if="item.vue === 'ViltSwitch.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltColor
                v-if="item.vue === 'ViltColor.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltDate
                v-if="item.vue === 'ViltDate.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltDateTime
                v-if="item.vue === 'ViltDateTime.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltTime
                v-if="item.vue === 'ViltTime.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltMedia
                v-if="item.vue === 'ViltMedia.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltRepeater
                v-if="item.vue === 'ViltRepeater.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltSchema
                v-if="item.vue === 'ViltSchema.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltRich
                v-if="item.vue === 'ViltRich.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
            <ViltRelation
                v-if="item.vue === 'ViltRelation.vue'"
                :message="errors[item.name]"
                @update:modelValue="update"
                :row="item"
                v-model="form[item.name]"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import JetInputError from '@@/Jetstream/InputError.vue';
import ViltText from '$$/ViltText.vue';
import ViltTel from '$$/ViltTel.vue';
import ViltTextArea from '$$/ViltTextArea.vue';
import ViltNumber from '$$/ViltNumber.vue';
import ViltSelect from '$$/ViltSelect.vue';
import ViltSwitch from '$$/ViltSwitch.vue';
import ViltColor from '$$/ViltColor.vue';
import ViltEmail from '$$/ViltEmail.vue';
import ViltDate from '$$/ViltDate.vue';
import ViltDateTime from '$$/ViltDateTime.vue';
import ViltTime from '$$/ViltTime.vue';
import ViltMedia from '$$/ViltMedia.vue';
import ViltRepeater from '$$/ViltRepeater.vue';
import ViltSchema from '$$/ViltSchema.vue';
import ViltRich from '$$/ViltRich.vue';
import ViltRelation from '$$/ViltRelation.vue';

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
        ViltRepeater,
        ViltSchema,
        ViltRich,
        ViltRelation,
    },
    data() {
        return {
            form: {},
        };
    },
    props: {
        modelValue: {},
        rows: {
            Array,
            default: [],
        },
        errors: {
            Object,
            default: {},
        },
        edit: {
            Boolean,
            default: false,
        },
        value: {
            Object,
            default: {},
        },
    },
    computed:{
        getRows(){
            let rows = this.$props.rows;
            let getRows = {};
            for (let i = 0; i < rows.length; i++) {
                if(rows[i].default){
                    getRows[rows[i].name] = rows[i].default;
                }
                else {
                    if(rows[i].vue === 'ViltRelation.vue' || rows[i].vue === 'ViltRepeater.vue' || rows[i].vue === 'ViltSchema.vue'){
                        getRows[rows[i].name] = [];
                    }
                    else {
                        getRows[rows[i].name] = "";
                    }
                }
            }

            return getRows;
        }
    },
    mounted() {
        if(Object.keys(this.value).length){
            this.form = this.value;
        }
        else {
            this.form = this.getRows;
        }
    },
    methods: {
        update() {
            if (this.form.hasOwnProperty('errors')) {
                this.$emit('update:modelValue', this.form);
            } else {
                this.$emit('update:modelValue', this.form);
            }
        },
    },
});
</script>
