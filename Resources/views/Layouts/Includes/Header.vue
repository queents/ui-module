<script setup>
import { useTrans } from '@@/Composables/useTrans';
const props = defineProps({
    title: String,
    button: String,
    url: String,
    canCreate: Boolean
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
                {{ title }}
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
                <li class="mr-2">
                    <span>/</span>
                </li>
                <li class="mr-2">
                    <Link
                        class="text-main dark:text-dark_green_color"
                        :href="route(props.url)"
                    >
                        <span>{{title}}</span>
                    </Link>
                </li>
            </ol>
        </div>
        <div class="flex items-start space-x-2 justify-end md:justify-start md:items-end">
            <slot></slot>
            <a
                v-if="props.canCreate"
                @click.prevent="emit('createItem')"
                class="relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-primary-600 rounded group active:bg-blue-500 focus:outline-none focus:ring"
                href="#"
            >
                <span
                    class="absolute left-0 transition-transform -translate-x-full group-hover:translate-x-4"
                >
                    <i class="bx bx-sm mt-2 bx-plus"></i>
                </span>

                <span
                    class="text-sm font-medium transition-all group-hover:ml-4"
                >
                    {{ button }}
                </span>
            </a>
        </div>
    </div>
</template>
