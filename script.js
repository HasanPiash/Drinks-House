const drinkContainer= document.getElementById('drinkContainer');
const groupList= document.getElementById('groupList');
const groupCount= document.getElementById('groupCount');
const modal= document.getElementById('modal');
const modalOverlay= document.getElementById('modal-overlay');
let groupItems= [];

const fetchDrinkDetails= async(drinkId)=>{
  const url= `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
  try{
    const response= await fetch(url);
    if(!response.ok) throw new Error(`API Error: ${response.status}`);
    const data= await response.json();
    return data.drinks[0];
  }catch(error){
    console.error('Fetch Error:',error);
    return null;
  }
};

const fetchDrinks= async(query='')=>{
  const url= query
    ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`;
  try{
    const response= await fetch(url);
    if(!response.ok) throw new Error(`API Error: ${response.status}`);
    const data= await response.json();
    return data.drinks || [];
  } catch (error){
    console.error('Fetch Error:',error);
    return [];
  }
};

const renderDrinks=async(drinks)=>{
  drinkContainer.innerHTML='';
  if(drinks.length===0){
    drinkContainer.innerHTML='<p>No drinks found.</p>';
    return;
  }
  for(const drink of drinks){
    const details= await fetchDrinkDetails(drink.idDrink);
    if(!details) continue;

    const drinkCard= document.createElement('div');
    drinkCard.className='drink';
    drinkCard.innerHTML= `
      <img src="${details.strDrinkThumb}" alt="${details.strDrink}">
      <strong>${details.strDrink}</strong>
      <p><strong>Category :</strong> ${details.strCategory || 'Unknown Category'}</p>
      <p><strong>Instructions :</strong> ${details.strInstructions?.slice(0,50) || 'No instructions provided.'}...</p>
      <button onclick='showDetails(${JSON.stringify(details)})'>Details</button>
      <button onclick="addToCart('${details.strDrink}')">Add to Cart</button>
    `;
    drinkContainer.appendChild(drinkCard);
  }
};

const addToCart=(drinkName)=>{
  if(groupItems.length>=7){
    alert('You cannot add more than 7 items.');
    return;
  }
  if(groupItems.includes(drinkName)){
    alert('Added in the cart.');
    return;
  }
  groupItems.push(drinkName);
  updateCart();
};

const updateCart=()=>{
  groupList.innerHTML ='';
  groupItems.forEach((item)=>{
    const li= document.createElement('li');
    li.textContent= item;
    groupList.appendChild(li);
  });
  groupCount.textContent=groupItems.length;
};

const showDetails=(drink)=>{
  modal.innerHTML=`
    <button onclick="closeModal()" style="position:absolute; top:10px; right:10px; background:none; border:none; color:white; font-size:18px; cursor:pointer;">&times;</button>
    <h3>Name : ${drink.strDrink}</h3>
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="width:100%; max-width:300px; margin:10px auto; border-radius:10px;">
    <p><strong>Category :</strong> ${drink.strCategory || 'N/A'}</p>
    <p><strong>Glass :</strong> ${drink.strGlass || 'N/A'}</p>
    <p><strong>Instructions :</strong> ${drink.strInstructions || 'N/A'}</p>
  `;
  modal.style.display='block';
  modalOverlay.style.display='block';
};

const closeModal=()=>{
  modal.style.display='none';
  modalOverlay.style.display='none';
};

document.getElementById('searchBtn').addEventListener('click',async()=>{
  const query= document.getElementById('searchBar').value;
  const drinks= await fetchDrinks(query);
  renderDrinks(drinks);
});

window.addEventListener('load',async()=>{
  const drinks= await fetchDrinks();
  renderDrinks(drinks);
});