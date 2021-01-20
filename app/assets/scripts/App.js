import "../styles/styles.css";
import "lazysizes"
import MobileMenue from "./modules/MobileMenu";
import RevealOnScroll from "./modules/revealOnScroll";
import StickyHeader from "./modules/StickyHeader";
import Modal from "./modules/Modal";
import ClientArea from "./modules/ClientArea";

new ClientArea();
new Modal();
let stickyHeader = new StickyHeader();
let mobileMenu = new MobileMenue();
let modal
document.querySelectorAll(".open_modal").forEach(el => {
el.addEventListener("click", e =>{
    e.preventDefault()
    if (modal == 'undefined'){
        import('./modules/Modal').then(x => {
            modal = new x.default()
            setTimeout(()=>modal.openTheModal(), 20)
        }).catch(() => console.log("There is a problem!!!"))
    }else{  
        modal.openTheModal()
    }
})    
});
new RevealOnScroll(document.querySelectorAll(".feature-item"),75);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 65);
if(module.hot){
    module.hot.accept();
}
 