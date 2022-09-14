import { defineStore } from "pinia";

let getFromStorage = localStorage.getItem('AsideLgActive') === "1";
let getFromStorageGroup = JSON.parse(localStorage.getItem('AsideMenuGroup'));

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isAsideMobileExpanded: false,
    isAsideLgActive: getFromStorage ? getFromStorage : false,
    isNotificationActive: false,
    isProfileMenuActive: false,
    AsideMenuGroup: getFromStorageGroup ? getFromStorageGroup : {},
    Breadcrumbs: [],
      isOverflow: false
  }),

  actions: {
      overflowToggle(){
          this.isOverflow = !this.isOverflow;
      },
      asideMobileToggle() {
        this.isAsideMobileExpanded = !this.isAsideMobileExpanded;
      },
      asideExpandToggle(){
          this.isAsideLgActive = !this.isAsideLgActive
          localStorage.setItem('AsideLgActive', this.isAsideLgActive ? "1" : "0");
      },
      asideNotificationToggle(){
        this.isNotificationActive = !this.isNotificationActive;
      },
      asideProfileToggle(){
        this.isProfileMenuActive = !this.isProfileMenuActive;
      },
      setAsideMenuGroup(key){
          this.AsideMenuGroup[key] = this.AsideMenuGroup.hasOwnProperty(key) ? !this.AsideMenuGroup[key] : true;
          localStorage.setItem('AsideMenuGroup', JSON.stringify(this.AsideMenuGroup));
      },
      setBreadcrumbs(item){
          this.Breadcrumbs.push(item);
      }
  },
});
