<script setup>
import { useTrans } from '@@/Composables/useTrans';
const props = defineProps({
    title: String,
    parent: String,
    parentUrl: String,
});
let { trans } = useTrans();
let emit = defineEmits(['createItem']);
</script>

<template>
    <div
        class="flex flex-col justify-start md:flex-row md:justify-between w-full mb-6"
    >
        <div>
            <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                {{ props.title }}
            </h2>
            <ol class="flex mt-2 text-gray-500 dark:text-white">
                <li class="mr-2">
                    <Link
                        class="flex items-center hover:text-main dark:hover:text-dark_green_color"
                        :href="route('dashboard')"
                    >
                        <i class="mr-1 bx bx-home rtl:mr-0 rtl:ml-1"></i>
                        <span>{{ trans('global.home') }}</span>
                    </Link>
                </li>
                <li class="mr-2" v-if="props.parentUrl && props.parent">
                    <span>/</span>
                </li>
                <li class="mr-2" v-if="props.parentUrl && props.parent">
                    <Link
                        class="text-main dark:text-dark_green_color"
                        :href="route(props.parentUrl)"
                    >
                        <span>{{props.parent}}</span>
                    </Link>
                </li>
                <li class="mr-2">
                    <span>/</span>
                </li>
                <li class="mr-2">
                    <span
                        class="text-main dark:text-dark_green_color"
                    >
                        <span>{{title}}</span>
                    </span>
                </li>
            </ol>
        </div>
        <div class="flex items-start space-x-2 justify-end md:justify-start md:items-end">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>
