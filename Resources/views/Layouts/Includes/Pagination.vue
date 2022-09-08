<script setup>
import { onMounted, watch, useAttrs, ref } from 'vue';
import { useResourceStore } from '@@/Stores/resourceStore';
import { useReload } from '@@/Composables/useReload';
import { useTrans } from '@@/Composables/useTrans';
import { storeToRefs } from 'pinia';

const props = defineProps({
    collection: Object,
});

const emit = defineEmits(['reload']);

const attrs = useAttrs();
let { lang } = attrs;
let { trans } = useTrans();

let { per_page, currentPage } = storeToRefs(useResourceStore());

let { reload } = useReload();

let start_page = ref(0);
let last_page = ref(1);

function makeReload(type, page = 1) {
    switch (type) {
        case 'pageNum':
            currentPage.value = page;
            break;
        case 'perPage':
            currentPage.value = 1;
    }

    reload();
}

function next() {
    return props.collection.current_page === last_page.value
        ? reload(last_page.value)
        : reload(props.collection.current_page + 1);
}

function back() {
    return props.collection.current_page === 1
        ? reload(1)
        : reload(props.collection.current_page - 1);
}

onMounted(() => {
    if (props.collection.total >= 5 && props.collection.current_page > 3) {
        start_page.value = props.collection.current_page - 2;
    } else {
        start_page.value = 1;
    }
    if (props.collection.last_page === props.start_page) {
        props.last_page = props.start_page + 1;
    } else if (props.start_page + 5 <= props.collection.last_page) {
        last_page.value = start_page.value + 5;
    } else {
        let get_last = props.collection.last_page - start_page.value;
        last_page.value = start_page.value + get_last + 1;
    }
});
</script>
<template>
    <nav
        role="navigation"
        aria-label="Pagination Navigation"
        class="flex items-center justify-between filament-tables-pagination"
        v-if="collection.data.length"
    >
        <div
            class="flex items-center justify-center flex-col md:flex-row md:items-center md:justify-between flex-1 mb-0 md:mb-4"
        >
            <div class="flex items-center">
                <div
                    class="text-sm font-normal dark:text-white mt-1 mt-[10px] mb-[20px] md:mt-0 md:mb-0"
                >
                    {{ trans('global.show') }} {{ collection.from }}
                    {{ trans('global.to') }} {{ collection.to }}
                    {{ trans('global.of') }}
                    {{ collection.total }}
                    {{ trans('global.results') }}
                </div>
            </div>
            <div class="flex flex-col items-center md:flex-row">
                <div
                    class="flex items-start space-x-2 rtl:space-x-reverse filament-tables-pagination-records-per-page-selector mb-[20px] md:mb-0"
                >
                    <div class="flex items-center">
                        <select
                            v-model="per_page"
                            id="tableRecordsPerPageSelect"
                            @change="makeReload('perPage')"
                            class="h-[38px] pr-[30px] rtl:pl-[10px] rtl:pr-[30px] text-sm leading-none transition duration-75 border-slate-300 rounded-default shadow-sm focus:border-main focus:ring-1 focus:ring-inset focus:ring-main dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>

                        <label
                            for="tableRecordsPerPageSelect"
                            class="text-sm font-normal mx-2"
                        >
                            {{ trans('global.per_page') }}
                        </label>
                    </div>
                </div>

                <div
                    class="flex items-center justify-end mb-6 ml-0 rtl:ml-0 rtl:mr-3 md:mb-0 md:ml-4"
                    v-if="collection.total > collection.per_page"
                >
                    <div
                        class="py-3 border border-none rounded-default dark:border-none"
                    >
                        <ol
                            class="flex items-center text-sm text-gray-500 dark:text-gray-400"
                        >
                            <li>
                                <!-- v-show="collection.current_page !== 1" -->
                                <button
                                    @click.prevent="back()"
                                    :class="
                                        collection.current_page !== 1
                                            ? ''
                                            : 'text-gray-300 pointer-events-none'
                                    "
                                    type="button"
                                    class="flex items-center justify-center font-normal min-w-[2rem] px-3 py-2 focus:outline-none filament-tables-pagination-item border border-transparent hover:border-main transition-all text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800 focus:outline-none focus:ring-0 border border-slate-300 relative right-[-1px] rtl:right-[0px] rtl:left-[-1px] border-r-transparent rtl:border-r-slate-300 rtl:border-l-transparent rounded-l-default rtl:rounded-l-0 rtl:rounded-r-default dark:hover:bg-main dark:hover:text-white"
                                    aria-label="Previous"
                                    rel="prev"
                                >
                                    {{ trans('pagination.previous') }}
                                </button>
                            </li>
                            <li
                                v-for="(page, key) in collection.links.length -
                                2"
                                :key="key"
                            >
                                <button
                                    v-if="collection.current_page === page"
                                    @click.prevent="makeReload('pageNum', page)"
                                    type="button"
                                    class="flex items-center justify-center font-normal w-[38px] px-3 py-2 focus:outline-none filament-tables-pagination-item transition-all bg-main text-white focus:underline border border-main relative right-[-1px] dark:bg-main dark:text-white"
                                    aria-label="Go to page 1"
                                >
                                    <span>{{ page }}</span>
                                </button>
                                <button
                                    v-else
                                    @click.prevent="makeReload('pageNum', page)"
                                    type="button"
                                    class="flex items-center justify-center font-normal w-[38px] px-3 py-2 focus:outline-none filament-tables-pagination-item border border-transparent text-gray-800 hover:border-main focus:bg-green_white focus:ring-2 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white border-y border-slate-300 border-x-transparent relative right-[-1px] rtl:right-[0px] rtl:left-[-1px] dark:hover:bg-main"
                                    aria-label="Go to page 2"
                                >
                                    <span>{{ page }}</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    @click.prevent="next()"
                                    :class="
                                        collection.current_page !==
                                        collection.last_page
                                            ? ''
                                            : 'text-gray-300 pointer-events-none'
                                    "
                                    type="button"
                                    class="flex items-center justify-center font-normal min-w-[2rem] px-3 py-2 focus:outline-none filament-tables-pagination-item border border-transparent hover:border-main transition-all text-gray-800 dark:border-gray-700 focus:outline-none focus:ring-0 border border-slate-300 border-l-transparent rtl:border-l-slate-300 rtl:border-r-transparent rounded-r-default rtl:rounded-r-0 rtl:rounded-l-default dark:hover:bg-main dark:text-white dark:bg-gray-800"
                                    aria-label="Next"
                                    rel="next"
                                >
                                    {{ trans('pagination.next') }}
                                </button>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
