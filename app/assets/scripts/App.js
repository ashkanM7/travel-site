import "../styles/styles.css";
import MobileMenue from "./modules/MobileMenu";
import RevealOnScroll from "./modules/revealOnScroll";
let mobileMenu = new MobileMenue();
new RevealOnScroll(document.querySelectorAll(".feature-item"),75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 65);
if(module.hot){
    module.hot.accept();
}
 