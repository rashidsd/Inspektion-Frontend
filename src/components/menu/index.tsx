import settingMenu from "./menuSettings";
import inputMenu from "./menuInputs";
import orderMenue from "./menuOrder";
import inspection from "./menuInspections";
import wip from "./menuWip";

const menu = [
  ...settingMenu,
  ...inputMenu,
  ...orderMenue,
  // ...inspection,
  ...wip,
];

export default menu;
