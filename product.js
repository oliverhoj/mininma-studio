
const requestedProduct=Number(new URLSearchParams(location.search).get('id') || 1);
const productId=Number.isInteger(requestedProduct) && requestedProduct>=1 && requestedProduct<=12 ? requestedProduct : 1;
const productTypes=['heel','hair','skirt'];
const photoIndex=(productId-1)%3;
const productType=productTypes[photoIndex];
document.title=`vintage ${String(productId).padStart(2,'0')} ${productType} — minima studio`;
document.querySelector('#product-number').textContent=`vintage ${String(productId).padStart(2,'0')}`;
document.querySelector('#product-name').textContent=productType;
document.querySelector('#product-description').textContent='product description coming soon.';
const gallery=document.querySelector('#product-gallery');
// Repeat the current reference photo until individual product photos are supplied.
for(let index=0;index<3;index++){
 const image=document.createElement('img');
 image.src=`assets/hero-${photoIndex+1}.jpg`;
 image.alt=`vintage ${String(productId).padStart(2,'0')} — ${productType}`;
 if(index>0)image.loading='lazy';
 gallery.append(image);
}
