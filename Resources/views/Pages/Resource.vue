<script setup>
import {ref, computed, watch, onMounted} from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import {useForm, usePage} from "@inertiajs/inertia-vue3";
import {Inertia} from "@inertiajs/inertia";
import {useGetForm} from "@@/Composables/useGetForm";
import { useResourceStore } from '@@/Stores/resourceStore';
import {storeToRefs} from "pinia/dist/pinia";
import Header from '@@/Layouts/Includes/Header.vue';
import List from '@@/Layouts/Includes/Table.vue';
import Pagination from '@@/Layouts/Includes/Pagination.vue';
import {useTrans} from "@@/Composables/useTrans";
import JetSecondaryButton from '@@/Jetstream/SecondaryButton.vue';
import JetButton from '@@/Jetstream/Button.vue';
import JetDialogModal from '@@/Jetstream/DialogModal.vue';
import CreateModal from '@@/Modals/Create.vue';
import ViewModal from '@@/Modals/View.vue';
import DeleteModal from '@@/Modals/Delete.vue';
import BulkModal from '@@/Modals/Bulk.vue';
import ViltForm from '$$/ViltForm.vue';
import Filters from '@@/Layouts/Includes/Filters.vue';
import Bulk from '@@/Layouts/Includes/Bulk.vue';
import {useReload} from "@@/Composables/useReload";
import {useCookies} from "vue3-cookies";
import {createToaster} from "@meforma/vue-toaster";

const props = defineProps({
    //Load Form Resource
    collection: Object,
    rows: Array,
    roles: Object,
    list: Object,
    render: Object,

    //Load Form Global Data
    data: Object,
    errorBags: Array,
    errors: Object,
    jetstream: Object,
    user: Object,
});

//Load Storage

let {
    goNext,
    goBack,
    search,
    per_page,
    orderBy,
    desc,
    last_page,
    showFilter,
    filters,
    currentPage,
    cols,
} = storeToRefs(useResourceStore());

let store = useResourceStore();


// Set Data

/*
Data To Image Popup
 */
let visible = ref(false);
let images = ref([]);
let index = ref(1);
let form = ref({});
const toaster = createToaster({ /* options */});

/*
Actions / Modals Data
 */
let actionModal = ref({});
let modalAction = ref({});
let selectedID = ref(null);

/*
Bulk Actions Data
 */
let showBlukModal = ref(false);
let bulkModal = ref(false);
let bulkItems = ref({});
let bulkActionTitle = ref("");

/*
Filter Actions Data
 */

let filterItem = ref({});
let filterObj = ref({});
let filtersObj = ref({});
let {reload} = useReload();
const {cookies} = useCookies();

/*
Modals Data
 */
let createModal = ref(false);
let edit = ref(false);
let viewModal = ref(false);
let deleteModal = ref(false);

// Methods
let {formMake} = useGetForm();

function fireAction (name, id = null){
    Inertia.post(route(name), {
        id: id ? id : selectedID.value,
    });
}

function openModal(name, id = null){
    selectedID.value = id;
    actionModal.value[name] = !actionModal.value[name];
}

function modalActionRun(modal, action) {
    if (selectedID.value) {
        modalAction.value[modal].id = selectedID.value;
    }
    let form = useForm(modalAction.value[modal]);
    Inertia.post(route(action), form,{
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            actionModal.value[modal] = false;
            success();
        },
    });
}


function openUrl(url){
    window.open(url);
}

/*
Cookies Handle
 */
function handleCookie() {
    let cookieName = `${props.list.url}-cols`;
    if (!cookies.get(cookieName)) {
        for (let i = 0, ii = props.rows.length; i < ii; i++) {
            if (props.rows[i].list) {
                cols.value[props.rows[i].name] = true;
            }
        }
        store.setCols(cols.value);
        cookies.set(cookieName, cols.value);
    } else {
        store.setCols(cookies.get(cookieName));
    }
}
/*
Filter Handle
 */

function setFilter(filter) {
    filterObj.value = filter;
}

function makeFilter(filterBy, filterValue) {
    let filter = {};
    filter[filterBy] = filterValue;
}

function getSendedFilter() {
    const requestedFilter = JSON.parse(
        JSON.stringify(filtersObj.value[filterObj.value.name])
    )[filterObj.value.name];

    const ids = requestedFilter.map((item) => item.id);
    const sendedFilter = {};
    sendedFilter[filterObj.value.name] = ids;
    return sendedFilter;
}
function resetFilter(){
    reload(1);
}

function searchFilter(search){

}

function filter(filter){

}

/*
Bulk Methods
 */
function bulkAction(action) {
    bulkActionTitle.value = action;
    bulkModal.value = true;
    showBlukModal.value = false;
}
function bulkAll(value) {
    if (!value) {
        bulkItems.value = {};
    } else {
        for (let i = 0; i < props.collection.data.length; i++) {
            bulkItems.value[props.collection.data[i].id] = true;
        }
    }
}
function switchBulk(id) {
    if (bulkItems.value.hasOwnProperty(id)) {
        delete bulkItems.value[id];
    } else {
        bulkItems.value[id] = true;
    }
}

/*
List Methods
 */

function popUp(images){
    visible.value = true;
    images.value = images;
}

function createItem(){
    edit.value = false
    form.value = useForm(formMake);
    createModal.value = !createModal.value;
}

function editItem(item){
    axios.get(route(props.list.url + '.show', item.id)).then((response) => {
        form.value = useForm(response.data.data);
        createModal.value = true;
        edit.value = true;
    });
};

function viewItem(item){
    axios.get(route(props.list.url + '.show', item.id)).then((response) => {
        form.value = useForm(response.data.data);
        viewModal.value = true;
    });
}

function deleteItem(item){
    form.value = useForm(item);
    deleteModal.value = true;
}

function reloadList(){
    reload()
}

/*
Fire Success Response / Error Response
 */

const getMessage = computed({
    get() {
        return props.data.message
    },
    set(value) {
        return value;
    },
});
const success = () => {
    const message = getMessage.value;
    if (typeof message === 'object') {
        if (message.type === 'error') {
            toaster.error(message.message, {
                position: 'top',
            });
        } else if (message.type === 'success') {
            toaster.success(message.message, {
                position: 'top',
            });
        } else {
            toaster.success(message.message, {
                position: 'top',
            });
        }
    } else {
        toaster.success(message, {
            position: 'top',
        });
    }

    edit.value = false;
    createModal.value = false;
    deleteModal.value = false;
    reload(1, 'orderBy', 'id', 'desc');
}

// Load Components
const modals = computed(() => {
    let modalsArray = [];
    if(props.render.components){
        for (let i = 0; i < props.render.components.length; i++) {
            if(props.render.components[i].classType === 'modal'){
                modalsArray.push(props.render.components[i]);
            }
        }
    }

    return modalsArray;
});
const widgets = computed(() => {
    let widgetsArray = [];
    if(props.render.components) {
        for (let i = 0; i < props.render.components.length; i++) {
            if (props.render.components[i].classType === 'widget') {
                widgetsArray.push(props.render.components[i]);
            }
        }
    }
    return widgetsArray;
});
const actions = computed(() => {
    let actionsArray = [];
    if(props.render.components) {
        for (let i = 0; i < props.render.components.length; i++) {
            if (props.render.components[i].classType === 'action') {
                actionsArray.push(props.render.components[i]);
            }
        }
    }
    return actionsArray;
});

// Load Languages
const gLang = computed(
    () => usePage().props.value.data.trans
);
const rLang = computed(
    () => props.render.lang
)

let {trans} = useTrans();

//Load Roles
const roles = props.roles;

// Mounted
onMounted(() => {
    handleCookie();

    //Set Form
    form.value = useForm(formMake());

    //Set Current List Filters
    search.value = props.list.search;
    per_page.value = props.list.per_page;
    orderBy.value = props.list.orderBy;
    filters.value = props.list.filters;
    createModal.value = !!props.list.create;
    props.list.desc === 'asc' ? store.setDesc(false) : store.setDesc(true);
    store.setCurrentUrl(props.list.url);

    //Set Modals
    if(modals.value.length){
        for (let i = 0; i < modals.value.length; i++) {
            actionModal.value[modals.value[i].name] = false;
            let actionModalRows = {};
            for (let j = 0; j < modals.value[i].rows.length; j++) {
                if(modals.value[i].rows[j].default){
                    actionModalRows[modals.value[i].rows[j].name] = modals.value[i].rows[j].default;
                }
                else {
                    if(modals.value[i].rows[j].vue === 'ViltRelation.vue' || modals.value[i].rows[j].vue === 'ViltRepeater.vue' || modals.value[i].rows[j].vue === 'ViltSchema.vue'){
                        actionModalRows[modals.value[i].rows[j].name] = [];
                    }
                    else {
                        actionModalRows[modals.value[i].rows[j].name] = "";
                    }
                }
            }
            modalAction.value[modals.value[i].name] = useForm({});
        }
    }
})


watch(
    filtersObj,
    () => {
        let routeObj = route().params;
        let sendedFilter = getSendedFilter();
        store.setFilters(sendedFilter);

        Inertia.get(route(props.list.url + ".index"), {
            ...routeObj,
            ...sendedFilter,
        }, {
            preserveScroll: true,
            preserveState: true
        });
    },
    {
        deep: true,
    }
);

</script>

<template>
    <div>
        <!-- Images Light Box -->
        <vue-easy-lightbox
            ref="lightbox"
            :visible="visible"
            :imgs="images"
            :index="index"
            @hide="visible = !visible"
        ></vue-easy-lightbox>
        <div class="px-6 pt-6 mx-auto">
            <!-- Main Resource Header -->
            <Header
                v-if="rLang"
                :canCreate="roles.create ? roles.create : false"
                :title="rLang ? rLang.index : ''"
                :button="rLang ? rLang.create: ''"
                :url="props.list.url+'.index'"
                @createItem="createItem"
            >
                <!-- Actions Generator -->
                <a
                    v-for="(action, index) in actions"
                    :key="index"
                    :href="action.url ? action.url : '#'"
                    @click.prevent="
                            !action.url
                                ? action.modal
                                    ? openModal(action.modal)
                                    : fireAction(action.action)
                                : openUrl(action.url)
                        "
                    class="relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-main rounded group active:bg-blue-500 focus:outline-none focus:ring"
                >
                        <span
                            class="absolute left-0 transition-transform -translate-x-full group-hover:translate-x-4"
                        >
                            <i class="bx-sm mt-2" :class="action.icon"></i>
                        </span>

                    <span
                        class="text-sm font-medium transition-all group-hover:ml-4"
                    >
                            {{ action.label }}
                        </span>
                </a>
            </Header>

            <!-- Widgets Generator -->
            <div v-if="widgets.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-4">
                <div
                    v-for="(item, key) in widgets"
                    :class="{
                            'col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4': widgets.length === 1,
                            'col-span-4 lg:col-span-2 md:col-span-2 sm:col-span-2': widgets.length === 2,
                            'bg-success-500': item.type === 'success',
                            'bg-danger-500': item.type === 'danger',
                            'bg-blue-700': item.type === 'primary',
                            'bg-warning-500': item.type === 'warning',
                        }"
                    class="w-full bg-blue-500 rounded-lg text-center py-4 px-2 text-white">

                    <i class="bx-lg" :class="item.icon"></i>
                    <h1 class="text-2xl font-bold">{{ item.label }}</h1>
                    <p>{{ item.value }}</p>
                </div>
            </div>
        </div>

        <!-- Filters & Bulk Actions -->
        <div class="flex justify-between p-4">
            <Bulk
                :bulk="bulkItems"
                :show="showBlukModal"
                :collection="props.collection"
                @close="showBlukModal = !showBlukModal"
            >
                <button
                    v-if="roles.deleteAny"
                    type="button"
                    class="flex items-center w-full h-8 px-3 text-sm font-normal text-danger bg-danger group whitespace-nowrap focus:outline-none"
                    @click="bulkAction('delete')"
                >
                    <svg
                        class="flex-shrink-0 w-6 h-6 mr-2 -ml-1 rtl:ml-2 rtl:-mr-1 group-hover:text-white group-focus:text-white text-danger-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                    </svg>
                    <span class="truncate">
                        {{ rLang.bulk }}
                    </span>
                </button>
            </Bulk>
            <Filters
                :showFilter="
                (props.render.table.filters &&
                props.render.table.filters.length)? true : false
            "
                :setSearch="search"
                :rows="rows"
                :url="props.list.url"
                @reset="resetFilter"
            >
                <ViltForm
                    v-for="(filter, key) in props.render.table.filters"
                    v-model="filtersObj[filter.name]"
                    :rows="filter.rows"
                    :key="key"
                    @update:modelValue="setFilter(filter)"
                />
            </Filters>
        </div>

        <!-- Table -->
        <div class="px-6 pt-6 mx-auto">
            <div
                class="bg-white dark:bg-gray-800 dark:border-gray-600 rounded-lg border"
            >

                <div class="relative overflow-y-auto dark:border-gray-800">
                    <List
                        @media="popUp"
                        :roles="roles"
                        :table="props.render.table"
                        :rows="props.rows"
                        :collection="props.collection"
                        :bulk="bulkItems"
                        :url="props.list.url"
                        :desc="desc"
                        @reload="reloadList"
                        @view="viewItem"
                        @edit="editItem"
                        @delete="deleteItem"
                        @all="bulkAll"
                        @switch="switchBulk"
                    >
                        <template #actions="{ id }">
                            <div v-for="(action, index) in props.render.table.actions" :key="index">
                                <button
                                    v-if="action.can"
                                    @click.prevent="
                                        !action.url
                                          ? action.modal
                                            ? openModal(action.modal, id)
                                            : fireAction(action.action, id)
                                          : openUrl(action.url)
                                      "
                                    style="padding: 5px 8px"
                                    class="inline-flex items-center justify-center text-sm font-normal filament-tables-link filament-tables-link-action"
                                    :class="'text-' + action.type + '-700 hover:text-' + action.type + '-600'"
                                    role="button"
                                >
                                    <i class="text-[16px]" :class="action.icon"></i>
                                    <div class="table_tooltip">
                                        {{ action.label }}
                                    </div>
                                </button>
                            </div>
                        </template>
                    </List>
                </div>
                <div class="p-2 border-t">
                    <Pagination :collection="props.collection"/>
                </div>
            </div>
        </div>
        <!-- Actions Modals -->
        <br/>
        <br/>
        <CreateModal
            :url="props.list.url"
            :title="edit.value ? rLang.edit_title : rLang.create_title"
            :show="createModal"
            :edit="edit"
            :item="form"
            :rows="props.rows"
            :type="props.render.form"
            @close="createModal = !createModal"
            @success="success"
        />
        <ViewModal
            @media="popUp"
            :title="rLang.view_title"
            :show="viewModal"
            :item="form"
            :rows="props.rows"
            @close="viewModal = !viewModal"
        />
        <DeleteModal
            :url="props.list.url"
            :title="rLang.delete_title"
            :show="deleteModal"
            :item="form"
            @close="deleteModal = !deleteModal"
            @success="success"
        />
        <BulkModal
            :url="props.list.url"
            :title="rLang.bulk_title"
            :action="bulkActionTitle"
            :bulk="bulkItems"
            :show="bulkModal"
            @close="bulkModal = !bulkModal"
            @success="success"
        />

        <!-- Modals Generator -->
        <JetDialogModal
            v-for="(item, key) in modals"
            :key="key"
            :show="actionModal[item.name]"
        >
            <template #title>
                <div class="flex justify-between">
                    {{ item.label }}
                </div>
            </template>

            <template #content>
                <form action="" enctype="multipart/form-data">
                    <ViltForm
                        v-model="modalAction[item.name]"
                        :rows="item.rows"
                        :errors="modalAction[item.name].errors"
                    />
                </form>
            </template>

            <template #footer>
                <JetButton
                    v-for="(button, key) in item.buttons"
                    :key="key"
                    @click.prevent="modalActionRun(item.name, button.action)"
                    class="mx-2"
                >{{ button.label }}
                </JetButton>
                <JetSecondaryButton
                    @click="actionModal[item.name] = !actionModal[item.name]"
                >
                    {{ trans('global.close') }}
                </JetSecondaryButton>
            </template>
        </JetDialogModal>
    </div>
</template>

<script>
import AppLayout from "@@/Layouts/AppLayout.vue"

export default {
    layout: AppLayout
};
</script>
