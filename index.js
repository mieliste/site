const nav = document.querySelector(".nav")
const menuIcon = document.querySelector(".menu-icon")
menuIcon.addEventListener('click',()=>{
nav.classList.toggle('mobile-menu')
console.log("salut")
})

/* Image insta  */

const img = document.getElementById('thumb');
img.addEventListener('mouseenter', () => {
  img.src = img.dataset.gif;
});
img.addEventListener('mouseleave', () => {
  img.src = img.dataset.still;
});

/* Pour écrans tactiles : lancer au tap et basculer */

/*img.addEventListener('click', () => {
  img.src = img.src === img.dataset.gif ? img.dataset.still : img.dataset.gif;


});
*/