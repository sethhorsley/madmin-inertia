// Page components for the madmin_inertia gem; register them under the names the gem renders.
export { default as Resource } from "./app/javascript/pages/resource"
export { buttonClass, inputClass } from "./app/javascript/pages/ui"
import Resource from "./app/javascript/pages/resource"
export const pages = (extra = {}) => ({ "Madmin/Resource": Resource, ...extra })
