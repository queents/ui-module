<script setup>
import NavBarItem from "@@/Themes/AdminOne/NavBarItem.vue";
import {mdiLogout, mdiThemeLightDark, mdiTranslate} from "@mdi/js";

defineProps({
  menu: {
    type: Object,
    default: () => [],
  },
});

const emit = defineEmits(["menu-click"]);



const menuClick = (event, item) => {
  emit("menu-click", event, item);
};
</script>

<template>
      <NavBarItem
        v-for="(item, index) in menu"
        :key="index"
        :item="item"
        @menu-click="menuClick"
      />
</template>
