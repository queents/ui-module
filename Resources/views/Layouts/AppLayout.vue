<script setup>
import {mdiForwardburger, mdiBackburger, mdiMenu} from '@mdi/js';
import {ref, computed, watch, onMounted, useAttrs} from 'vue';
import BaseIcon from '@@/Themes/AdminOne/BaseIcon.vue';
import NavBar from '@@/Themes/AdminOne/NavBar.vue';
import NavBarItemPlain from '@@/Themes/AdminOne/NavBarItemPlain.vue';
import AsideMenu from '@@/Themes/AdminOne/AsideMenu.vue';
import FooterBar from '@@/Themes/AdminOne/FooterBar.vue';
import {Inertia} from "@inertiajs/inertia";
import {useLayoutStore} from '@@/Stores/layout.js';
import {useStyleStore} from '@@/Stores/style.js';
import {useResourceStore} from '@@/Stores/resourceStore';

import {storeToRefs} from "pinia/dist/pinia";

const attrs = useAttrs();

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
    edit,
    orderBy,
    desc,
    last_page,
    showFilter,
    filters,
    currentPage,
    cols,
} = storeToRefs(useResourceStore());

let store = useResourceStore();

// Check if The Sidebar is expanded or not
const layoutStore = useLayoutStore();
Inertia.on('navigate', () => {
    layoutStore.isAsideMobileExpanded = false;
    layoutStore.isAsideLgActive = false;
});


// Load Style form the storage
const styleStore = useStyleStore();
// Set Layout Padding
const layoutAsidePadding = 'rtl:xl:pr-60 ltr:xl:pl-60 ';


// Load Menus
const dashboardMenu = props.data.menus.dashboard;

const navMenu = props.data.menus.profile;

// Set menu click actions
const menuClick = (event, item) => {
    if (item.isChangeLanguage) {
        Inertia.post(
            route("translations.switch"),
            {language: JSON.parse(localStorage.getItem("lang"))},
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    let htmlEl = document.querySelector("html");

                    if (
                        JSON.parse(localStorage.getItem("lang")).id === "ar"
                    ) {
                        htmlEl.setAttribute("dir", "rtl");
                        localStorage.setItem(
                            "lang",
                            JSON.stringify({
                                id: "en",
                                name: "English",
                            })
                        );
                    } else {
                        htmlEl.setAttribute("dir", "ltr");
                        localStorage.setItem(
                            "lang",
                            JSON.stringify({
                                id: "ar",
                                name: "Arabic",
                            })
                        );
                    }
                },
            }
        );
    }
    if (item.isToggleLightDark) {
        styleStore.setDarkMode();
    }
    if (item.isLogout) {
        // Add:
        Inertia.post(route('logout'));
    }
};

// Mounted
onMounted(() => {
    // Set Lang on local
    if (!localStorage.getItem("lang")) {
        localStorage.setItem(
            "lang",
            JSON.stringify({
                id: "ar",
                name: "Arabic",
            })
        );
    }
});

</script>

<template>
    <div
        v-cloak
        :class="{
      dark: styleStore.darkMode,
      'overflow-hidden lg:overflow-visible': layoutStore.isAsideMobileExpanded,
    }"
    >
        <div
            :class="[
        layoutAsidePadding,
        { 'ltr:ml-60 ltr:lg:ml-0 rtl:mr-60 rtl:lg:mr-0 ': layoutStore.isAsideMobileExpanded },
      ]"
            class="pt-14 min-h-screen w-screen  text-gray-800 transition-position lg:w-auto bg-gray-100 dark:bg-slate-800 dark:text-slate-100"
        >
            <NavBar
                :menu="navMenu"
                :class="[
                    layoutAsidePadding,
                    { 'ltr:ml-60 ltr:lg:ml-0 rtl:mr-60 rtl:lg:mr-0': layoutStore.isAsideMobileExpanded },
                ]"
                @menu-click="menuClick"
            >
                <NavBarItemPlain
                    display="flex lg:hidden"
                    @click.prevent="layoutStore.asideMobileToggle()"
                >
                    <BaseIcon
                        :path="
                            layoutStore.isAsideMobileExpanded
                                ? mdiBackburger
                                : mdiForwardburger
                        "
                        size="24"
                    />
                </NavBarItemPlain>
                <NavBarItemPlain
                    display="hidden lg:flex xl:hidden"
                    @click.prevent="layoutStore.isAsideLgActive = true"
                >
                    <BaseIcon :path="mdiMenu" size="24" />
                </NavBarItemPlain>
            </NavBar>
            <AsideMenu :menu="dashboardMenu" @menu-click="menuClick" />
            <slot :props="props" />
            <FooterBar>
                Github
                <a
                    href="https://www.github.com"
                    target="_blank"
                    class="text-blue-600"
                >Docs</a
                >
            </FooterBar>
        </div>
    </div>

</template>
