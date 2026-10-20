const panel=document.querySelector('#panel');
const content=document.querySelector('#panel-content');
const title=document.querySelector('#panel-title');
const views={menu:['menu','<nav><a href="vintage.html">vintage</a><button data-panel="about">about</button><button data-panel="shipping">shipping</button><a href="https://www.instagram.com/minimastudio.dk/" target="_blank" rel="noopener noreferrer">instagram</a><a href="https://www.tiktok.com/@laurabjerremand" target="_blank" rel="noopener noreferrer">tiktok</a><button data-panel="contact">mail</button></nav>'],instagram:['instagram','<p>instagram link coming soon.</p>'],tiktok:['tiktok','<p>tiktok link coming soon.</p>'],about:['About minima studio','<h2>minima studio</h2><p>A considered collection of vintage, clothing and everyday objects. Selected with care, to be worn and kept.</p>'],contact:['Contact','<h2>Let’s get in touch.</h2><p>Contact details for minima studio will be available here soon.</p>'],shipping:['Shipping & Returns','<h2>Shipping & returns</h2><p>Shipping destinations, delivery times and return terms will be available when the shop opens.</p>'],privacy:['Privacy','<h2>Your privacy</h2><p>This preview does not send personal information to a server. Newsletter preferences are stored only in this browser.</p>'],account:['Account','<h2>Welcome to minima studio.</h2><p>Customer accounts will be available when the shop opens.</p>'],cart:['Cart: 0','<h2>Your cart is empty.</h2><a class="panel-action" href="#collection">Explore the collection ↗</a>'],collaborations:['Collaborations','<h2>Shared perspectives.</h2><p>Future collaborations by minima studio will appear here.</p>'],journal:['Journal','<h2>Notes from the studio.</h2><p>Stories, inspiration and new perspectives. Coming soon.</p>'],search:['Search','<label class="sr-only" for="search-input">Search the collection</label><input id="search-input" type="search" placeholder="Search the collection" autocomplete="off"><div class="search-result" role="status">Search vintage, clothing, knitwear or bags.</div>']};
function openPanel(name){const view=name==='cart'?cartView():views[name];if(!view)return;panel.classList.toggle('menu-pocket',name==='menu');title.textContent=view[0];content.innerHTML=view[1];document.querySelectorAll('[aria-expanded]').forEach(e=>e.setAttribute('aria-expanded',String(e.dataset.panel===name)));if(name==='menu'){if(panel.open)panel.close();panel.show()}else{if(panel.open && !panel.matches(':modal'))panel.close();if(!panel.open)panel.showModal()}document.body.style.overflow=name==='menu'?'':'hidden';if(name==='search'){const input=content.querySelector('input');input.focus();input.addEventListener('input',()=>{const query=input.value.trim();content.querySelector('.search-result').textContent=query?`No products available for “${query}” yet. Our next selection is coming soon.`:'Search vintage, clothing, knitwear or bags.'})}}
function closePanel(){panel.close();document.body.style.overflow='';document.querySelectorAll('[aria-expanded]').forEach(e=>e.setAttribute('aria-expanded','false'))}
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-panel]');if(trigger)openPanel(trigger.dataset.panel);if(e.target.closest('#close'))closePanel();if(e.target.closest('#panel a')){closePanel();if(e.target.closest('[data-home]'))window.scrollTo({top:0,behavior:'smooth'})}const category=e.target.closest('[data-category]');if(category)document.querySelector('#collection-message').textContent=`${category.dataset.category} — our next selection is coming soon.`});
panel.addEventListener('close',()=>{document.body.style.overflow=''});panel.addEventListener('click',e=>{if(e.target===panel&&e.clientX<panel.getBoundingClientRect().left)closePanel()});

document.querySelector('#year').textContent=new Date().getFullYear();

const CART_KEY = 'minima-cart';
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  if (Array.isArray(saved)) cart = saved.filter(item => item && typeof item.id === 'string' && typeof item.name === 'string' && Number.isSafeInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.price) && item.price >= 0);
} catch {}
const escapeText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money = amount => new Intl.NumberFormat('da-DK', {style:'currency',currency:'DKK'}).format(amount);
function cartCount(){return cart.reduce((sum,item)=>sum+item.quantity,0)}
function cartView(){
  const rows = cart.map(item => `<li><span>${escapeText(item.name)}<br>${money(item.price)}</span><div class="cart-quantity"><button data-cart-change="-1" data-cart-id="${escapeText(item.id)}" aria-label="remove one">−</button><span>${item.quantity}</span><button data-cart-change="1" data-cart-id="${escapeText(item.id)}" aria-label="add one">+</button></div></li>`).join('');
  return [`cart (${cartCount()})`, cart.length ? `<ul class="cart-items">${rows}</ul><div class="cart-total"><span>subtotal</span><span>${money(cart.reduce((sum,item)=>sum+item.price*item.quantity,0))}</span></div>` : '<p class="cart-empty">your cart is currently empty</p>'];
}
function updateCart(){
  document.querySelector('#count').textContent = cartCount();
  document.querySelector('[data-panel="cart"]').setAttribute('aria-label',`cart (${cartCount()})`);
  try {localStorage.setItem(CART_KEY,JSON.stringify(cart))} catch {}
  if(panel.open && title.textContent.startsWith('cart (')){const view=cartView();title.textContent=view[0];content.innerHTML=view[1]}
}
window.minimaCart = {
  add(product){
    if(!product || typeof product.id !== 'string' || typeof product.name !== 'string' || !Number.isFinite(product.price) || product.price < 0) return;
    const quantity = product.quantity === undefined ? 1 : product.quantity;
    if(!Number.isSafeInteger(quantity) || quantity < 1) return;
    const existing = cart.find(item=>item.id===product.id);
    if(existing) existing.quantity += quantity;
    else cart.push({id:product.id,name:product.name,price:product.price,quantity});
    updateCart();
  },
  get count(){return cartCount()}
};
document.addEventListener('click',event=>{
  const control=event.target.closest('[data-cart-change]');
  if(control){const item=cart.find(item=>item.id===control.dataset.cartId);if(item){item.quantity+=Number(control.dataset.cartChange);cart=cart.filter(item=>item.quantity>0);updateCart()}}
  const add=event.target.closest('[data-add-to-cart]');
  if(add) window.minimaCart.add({id:add.dataset.productId,name:add.dataset.productName,price:Number(add.dataset.productPrice)});
});
updateCart();

document.addEventListener('click',event=>{
  if(panel.open && panel.classList.contains('menu-pocket') && !panel.contains(event.target) && !event.target.closest('[data-panel="menu"]')) closePanel();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && panel.open) closePanel();
});
