<script setup>
import {Link, useForm, usePage} from "@inertiajs/inertia-vue3";
import JetDialogModal from "@@/Jetstream/DialogModal.vue";
import JetSecondaryButton from "@@/Jetstream/SecondaryButton.vue";
import JetButton from "@@/Jetstream/Button.vue";
import JetInput from "@@/Jetstream/Input.vue";
import JetInputError from "@@/Jetstream/InputError.vue";
import JetLabel from "@@/Jetstream/Label.vue";
import { Tabs, Tab } from "vue3-tabs-component";
import {computed, onMounted, onUpdated, ref, watch} from "vue";
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
import ViltRepeater from "$$/ViltRepeater.vue";
import ViltSchema from "$$/ViltSchema.vue";
import ViltRich from "$$/ViltRich.vue";
import ViltRelation from "$$/ViltRelation.vue";
import ViltHasOne from "$$/ViltHasOne.vue";
import {Inertia} from "@inertiajs/inertia";
import {createToaster} from "@meforma/vue-toaster";
import {useTrans} from "@@/Composables/useTrans";

const props = defineProps({
    show: Boolean,
    errors: Object,
    edit: Boolean,
    item: Object,
    title: String,
    url: String,
    rows: Array,
    type: {
        String,
        default: "modal",
    },
})

const emit = defineEmits([
    "success",
    "create",
    "update",
    "close"
])

onUpdated(()=>{
    form.value = useForm(props.item);
    showModal.value = props.show
})


/*
Set Data
 */

let isDisabledBtn = ref(false);
let showModal = ref(false);
let form = ref({});
let index = ref(false);
let lastTab = ref(false);
let tabs = ref(null);
const toaster = createToaster({ /* options */});
let {trans} = useTrans();

/*
Computed Methods
 */

const lang = computed(()=>{
    return usePage().props.value.data.trans;
});

let rowFilterCreate = computed(()=>{
    let rows = props.rows;
    let rowValue = [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].create) {
            rowValue.push(rows[i]);
        }
    }

    return rowValue;
});

let rowFilterEdit = computed(()=>{
    let rows = props.rows;
    let rowValue = [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].edit) {
            rowValue.push(rows[i]);
        }
    }

    return rowValue;
});

/*
Disabled Button On Load
 */
onMounted(()=>{
    Inertia.on("start", () => {
        isDisabledBtn.value = true
    });
    Inertia.on("finish", () => {
        isDisabledBtn.value = false
    });
})

/*
Methods
 */
function close(){
    showModal.value = false;
    emit('close');
}
let reactiveItem = computed(() => {
    let reactiveObject = {};
    for(let i =0; i<props.rows.length; i++){
        if(props.rows[i].reactive){
            if(typeof form.value[props.rows[i].reactiveRow] === 'boolean'){
                let checkItem = props.rows[i].reactiveWhere === "1" ? true : false;
                reactiveObject[props.rows[i].name] = checkItem === form.value[props.rows[i].reactiveRow];
            }
            else {
                reactiveObject[props.rows[i].name] = JSON.stringify(props.rows[i].reactiveWhere) === JSON.stringify(form.value[props.rows[i].reactiveRow]);
            }
        }
        else {
            reactiveObject[props.rows[i].name] =  true;
        }
    }

    return reactiveObject;
});
function changeTab(selectedTab) {
    let countActive = 0;
    for (let i = 0; i < props.type.tabs.length; i++) {
        if (props.type.tabs[i].name === selectedTab.tab.computedId) {
            index.value = i;
        }
    }
    if (index.value === props.type.tabs.length - 1) {
        lastTab.value = true;
    } else {
        lastTab.value  = false;
    }
}
function nextTab() {
    index.value += 1;
    tabs.value.selectTab("#" + props.type.tabs[index.value].name);
}
function success(id = null) {
    if (props.edit) {
        emit("update", { form: form.value, id: id });
        isDisabledBtn.value = false;
    } else {
        emit("create", form.value);
        isDisabledBtn.value = false;
    }
}
function saveRecord() {
    Inertia.post( route(props.url + ".store"), form.value, {
        preserveScroll: true,
        onSuccess: () => {
            form.value.reset();
            emit("success");
            isDisabledBtn.value = false;
        },
        onError: () => {
            if (props.type.name === "tabs") {
                for (let r = 0; r < props.rows.length; r++) {
                    if (
                        Object.keys(props.errors)[0] ===
                        props.rows[r].name
                    ) {
                        if (tabs) {
                            tabs.value.selectTab(
                                "#" + props.rows[r].tab
                            );
                        }

                        break;
                    }
                }
            }
            toaster.error(trans("global.error.message"), {
                position: "top",
            });
        },
    });
}
function updateRecord(id) {
    Inertia.post(route(props.url + ".update", id),form.value, {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
            form.value.reset();
            emit("success");
            isDisabledBtn.value = false;
        },
        onError: () => {
            if (props.type.name === "tabs") {
                for (let r = 0; r < props.rows.length; r++) {
                    if (
                        Object.keys(props.errors)[0] ===
                        props.rows[r].name
                    ) {
                        if (tabs) {
                            tabs.value.selectTab(
                                "#" + props.rows[r].tab
                            );
                        }

                        break;
                    }
                }
            }
            toaster.error(trans("global.error.message"), {
                position: "top",
            });
        },
    });
}

</script>

<template>
    <JetDialogModal :show="showModal">
        <template #title>
            {{ title }}
        </template>

        <template #content>
            <div v-if="props.type.name === 'modal'">
                <form
                    class="grid grid-cols-1 gap-3 lg:grid-cols-1"
                    action=""
                    v-if="!props.edit"
                >
                    <slot name="create-top"></slot>

                    <div
                        v-for="(item, key) in rowFilterCreate"
                        :key="key"
                        class=""
                    >
                        <ViltText v-if="item.vue === 'ViltText.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTel v-if="item.vue === 'ViltTel.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltColor v-if="item.vue === 'ViltColor.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDate v-if="item.vue === 'ViltDate.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTime v-if="item.vue === 'ViltTime.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRich v-if="item.vue === 'ViltRich.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.create && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>

                    </div>
                    <slot name="create"></slot>
                </form>
                <form
                    class="grid grid-cols-1 gap-3 md:grid-cols-1"
                    action=""
                    v-else
                >
                    <slot name="edit-top"></slot>
                    <div
                        v-for="(item, key) in rowFilterEdit"
                        :key="key"
                        class=""
                    >
                        <ViltText v-if="item.vue === 'ViltText.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTel v-if="item.vue === 'ViltTel.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltColor v-if="item.vue === 'ViltColor.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDate v-if="item.vue === 'ViltDate.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTime v-if="item.vue === 'ViltTime.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRich v-if="item.vue === 'ViltRich.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.edit && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                    </div>
                    <slot name="edit"></slot>
                </form>
            </div>
            <div v-else-if="props.type.name === 'tabs'">

                <Tabs
                    cache-lifetime="0"
                    :options="{ defaultTabHash: props.type.tabs[0].key }"
                    @changed="changeTab"
                    ref="tabs"
                    nav-class="flex justify-start space-x-2"
                    nav-item-class="py-2 px-4 rounded-lg"
                    nav-item-active-class="bg-main  py-2 px-4 rounded-lg text-white"
                >
                    <Tab
                        v-for="(tab, key) in props.type.tabs"
                        :key="key"
                        :name="tab.label"
                        :id="tab.name"
                        :is-disabled="
                            (!tab.create && !props.edit) || (!tab.edit && props.edit)
                        "
                    >
                        <form
                            class="grid grid-cols-1 lg:grid-cols-1"
                            action=""
                            v-if="!props.edit"
                        >
                            <slot name="create-top"></slot>
                            <div
                                v-for="(item, key) in rowFilterCreate"
                                :key="key"
                                class=""
                            >
                                <ViltText v-if="item.vue === 'ViltText.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTel v-if="item.vue === 'ViltTel.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltColor v-if="item.vue === 'ViltColor.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltDate v-if="item.vue === 'ViltDate.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTime v-if="item.vue === 'ViltTime.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRich v-if="item.vue === 'ViltRich.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.create && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                            </div>
                            <slot name="create"></slot>
                        </form>
                        <form
                            class="grid grid-cols-1 md:grid-cols-1"
                            action=""
                            v-else
                        >
                            <slot name="edit-top"></slot>
                            <div
                                v-for="(item, key) in rowFilterEdit"
                                :key="key"
                                class=""
                            >
                                <ViltText v-if="item.vue === 'ViltText.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTel v-if="item.vue === 'ViltTel.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltColor v-if="item.vue === 'ViltColor.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltDate v-if="item.vue === 'ViltDate.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltTime v-if="item.vue === 'ViltTime.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRich v-if="item.vue === 'ViltRich.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                                <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.edit && item.tab === tab.name && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                            </div>
                            <slot name="edit"></slot>
                        </form>
                    </Tab>
                </Tabs>
                <form
                    class="grid grid-cols-1 lg:grid-cols-1"
                    action=""
                    v-if="!props.edit"
                >
                    <slot name="create-top"></slot>
                    <div
                        v-for="(item, key) in rowFilterCreate"
                        :key="key"
                        class=""
                    >
                        <ViltText v-if="item.vue === 'ViltText.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTel v-if="item.vue === 'ViltTel.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltColor v-if="item.vue === 'ViltColor.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDate v-if="item.vue === 'ViltDate.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTime v-if="item.vue === 'ViltTime.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRich v-if="item.vue === 'ViltRich.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.create && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                    </div>
                    <slot name="create"></slot>
                </form>
                <form class="grid grid-cols-1 md:grid-cols-1" action="" v-else>
                    <slot name="edit-top"></slot>
                    <div
                        v-for="(item, key) in rowFilterEdit"
                        :key="key"
                        class=""
                    >
                        <ViltText v-if="item.vue === 'ViltText.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltEmail v-if="item.vue === 'ViltEmail.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTel v-if="item.vue === 'ViltTel.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTextArea v-if="item.vue === 'ViltTextArea.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltNumber v-if="item.vue === 'ViltNumber.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSelect v-if="item.vue === 'ViltSelect.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSwitch v-if="item.vue === 'ViltSwitch.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltColor v-if="item.vue === 'ViltColor.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDate v-if="item.vue === 'ViltDate.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltDateTime v-if="item.vue === 'ViltDateTime.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltTime v-if="item.vue === 'ViltTime.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltMedia v-if="item.vue === 'ViltMedia.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRepeater v-if="item.vue === 'ViltRepeater.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltSchema v-if="item.vue === 'ViltSchema.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRich v-if="item.vue === 'ViltRich.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltRelation v-if="item.vue === 'ViltRelation.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                        <ViltHasOne v-if="item.vue === 'ViltHasOne.vue' && item.edit && item.tab === null && reactiveItem[item.name]" :message="props.errors[item.name]" :row="item" v-model="form[item.name]"/>
                    </div>
                    <slot name="edit"></slot>
                </form>
            </div>
        </template>

        <template #footer>
            <slot name="footer-button"></slot>

            <div class="flex justify-start gap-2">
                <JetButton
                    :disabled="isDisabledBtn"
                    v-if="props.type.name === 'tabs' && !lastTab"
                    @click.prevent="nextTab()"
                >
                    {{ trans("global.next") }}
                </JetButton>
                <JetButton
                    :disabled="isDisabledBtn"
                    v-if="!props.edit && lastTab && props.type.name === 'tabs'"
                    @click.prevent="saveRecord()"
                >
                    {{ trans("global.save") }}
                </JetButton>
                <JetButton
                    :disabled="isDisabledBtn"
                    v-else-if="!props.edit && props.type.name === 'modal'"
                    @click.prevent="saveRecord()"
                >
                    {{ trans("global.save") }}
                </JetButton>
                <JetButton
                    :disabled="isDisabledBtn"
                    v-else-if="props.edit"
                    @click.prevent="updateRecord(form.id)"
                >
                    {{ trans("global.update") }}
                </JetButton>
                <JetSecondaryButton @click="close">
                    {{ trans("global.close") }}
                </JetSecondaryButton>
            </div>
        </template>
    </JetDialogModal>
</template>
