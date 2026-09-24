var table_name = ['',//0
                 'users',//1
                 'categories',//2
                 'tickets',//3
                 'lignes_ticket',//4
                 'products'//5
                ];//5

var idFirstTrProduct = null;

//var currentTable = 'users';

var currentSelected = {
            users: null,
          tickets: null,
    lignes_ticket: null,
       categories: null,
         products: null
};

var mode = {
       connected: null,
    consultation: null,
            edit: null,
           vente: null,
          etat_x: null,
          etat_z: null,
     radioButton: null,
   scrollTickets: null      
};

var newProductAdded = false;
var     currentUser = null;
var currentTicketId = null;
var    currentTable = null;
var  productToAddId = null;

async function feedThermalPaper(lines) {
  try {
    const response = await fetch('feedPos80.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: lines })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'The printer rejected the feed command.');
    }

  } catch (error) {
    console.error('Unable to feed the thermal printer:', error);
  }
}

async function printTicket(idTicket) {
  try {
    const response = await fetch('feedPos80.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idTicket: idTicket })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'The ticket could not be printed.');
    }
  } catch (error) {
    console.error('Unable to print ticket:', error);
  }
}

//          /\
//         //\\
//        ======
//    ===============
//=========================
// =======( TIMING )========
//==========================
function startTime() {
  const today = new Date();
  var h = today.getHours();   
  var m = today.getMinutes(); 
  var s = today.getSeconds();    
  m = checkTime(m);  
  s = checkTime(s);

  var myTime = h + ':' + m + ':' + s;
  
  document.getElementById('displayTime').innerHTML = myTime;
  setTimeout(startTime, 1000);
}//startTime

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}//checkTime 


function  initKeyboardNavigation(){
    
    document.addEventListener('keydown', (event) => {

        if (event.target && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
        return; }

        console.log("event  : "+event.key);

        switch (event.key) { 

            case 'Home':
              event.preventDefault(); 
              
              currentTable = table_name[1];

            break;

            case 'Insert':  
              event.preventDefault();
              
                feedThermalPaper(1);
              

            break;            

            case 'Delete':  
                event.preventDefault();
                if(currentTable == table_name[4] && findSelectedLineTicketId() !== null && findTicketsId() !== null ){  
                deleteItemTicket(currentTicketId,findSelectedLineTicketId())
                } else {                
                  document.querySelector('#captionLineTicket').classList.textContent = 'Selectionner le ticket et la ligne à supprimer';
                  document.getElementById('captionLineTicket').innerHTML = `<div class="text text-center fs-6 fw-bold">
                  <span class="text-bg-danger fs-6 rounded-pill nowrap px-3 py-2">Selectionner le ticket et la ligne à supprimer</span>
                 </div>`;
                } 

            break;                              

            case 'End':  
                event.preventDefault(); 
                if(currentTable == table_name[4] && findTicketsId() !== null && findSelectedLineTicketId() !== null){
                deleteLinesTicket(findTicketsId())                    
                } else {
                  console.log('No ticket selected to delete all lines');
                } 
            break;                  

            case 'Escape':
                event.preventDefault();

                currentTable = table_name[4];

                           
            break;

            case 'Tab':
                event.preventDefault();

                currentTable = table_name[5];
                
            break;            

            case 'PageUp':          
                event.preventDefault();

                if(currentTable == table_name[4] || currentTable == table_name[5] ) {

                  //===================================
                    const idTicket = document.querySelector('#trHeadTicket').dataset.idticket;
                    const   idUser = document.querySelector('#trHeadTicket').dataset.iduser;
                    console.log('PageUp idTicket'+idTicket);
                    console.log('PageUp idUser'+idUser);
                  //===================================
                  window.location = "http://localhost:8000/scrollTickets.php?idUser="+idUser+"&idTicket="+idTicket; 
                }
                        
            break;

            case 'PageDown':
                event.preventDefault();
                  
                var ticketId = currentSelected[table_name[3]];// 'tickets'
                window.location = "http://localhost:8000/changeTicket.php?idTicket="+ticketId;
                displayTicket(ticketId);
                currentTable = table_name[5];                                

                //  readVariables();
            break;  
            
            case 'ArrowUp':
                event.preventDefault();

                if(currentTable == table_name[1]) {//'users'
                  
                  moveUsersSelection(-1); 

                  var idUser = currentSelected[currentTable];
                  displayTickets(idUser,findFirstTicketId(idUser));  
                  document.getElementById("idImgUser").src = document.getElementById("idPhotoUser"+String(idUser)).src; 
                  document.getElementById("idSpanFirstName").innerText = document.getElementById("idNameUser"+String(idUser)).innerText;

                  console.log('User :'+idUser);
                  
                } else if(currentTable == table_name[3]) {//'tickets'

                  moveTicketsSelection(-1);             
                  displayDetailScrollingTickets(currentSelected[table_name[3]]);

                  readVariables();

                
                } else if(currentTable == table_name[4]) { //'lignes_ticket' 
                  moveSelection(-1);
                } else if(currentTable == table_name[5]) {// 'products'
                  moveProductSelection(-4);
                } 
               
            break;

            case 'ArrowDown':      
                event.preventDefault();

                if(currentTable == table_name[1]) {//'users'
                  
                  moveUsersSelection(1); 

                  var idUser = currentSelected[currentTable];
                  displayTickets(idUser,findFirstTicketId(idUser));
                  document.getElementById("idImgUser").src = document.getElementById("idPhotoUser"+String(idUser)).src;
                  document.getElementById("idSpanFirstName").innerText = document.getElementById("idNameUser"+String(idUser)).innerText; 

                                    
                  console.log('User :'+idUser);                  

                } else if(currentTable == table_name[3]) { //'tickets'               

                  moveTicketsSelection(1);
                  displayDetailScrollingTickets(currentSelected[table_name[3]]);                                             

                  readVariables();

                } else if(currentTable == table_name[4]) {                                 
                  moveSelection(1);
                } else if(currentTable == table_name[5]) {
                  moveProductSelection(4);
                }   
            
            break;

            case 'ArrowRight':
              event.preventDefault();

              if(currentTable == table_name[4]) {
             
              getQuantity(findTicketsId(),findSelectedLineTicketId(),1)                         
          
              } else if(currentTable == table_name[5]) {
                moveProductSelection(1);
              } 

            break;             

            case 'ArrowLeft':
              event.preventDefault();
               
              if(currentTable == table_name[4]) {


                getQuantity(findTicketsId(),findSelectedLineTicketId(),0)                         

              } else if(currentTable == table_name[5]) {
                 moveProductSelection(-1);
              } 

            break;
            
            case 'Enter':                  
                event.preventDefault();

                console.log('currentTable :'+currentTable)

                switch (currentTable) { 

                  case table_name[1]://'users'

                    event.preventDefault();
                               
                    var userId = findUserId();

                    findFirstTicketId(userId);

                    currentTable = table_name[3];//'tickets'
              
                  break;                                    

                  case table_name[3]://'tickets'
                    event.preventDefault();
                
                    document.getElementById('aBtnChangeTicket').click();

                  break;                  

                  case table_name[4]://'lignes_ticket'
                    event.preventDefault();



                  break;                  
                  
                  case table_name[5]://'products'
                    event.preventDefault();

                    //productToAddId
                    const rows = document.querySelectorAll('#tbodyProducts .product-card');
                    rows.forEach(row => {
                      if(row.classList.contains("bg-success")){
                        productToAddId = row.dataset.idproduct ;                          
                      }                      
                    })  

                    //ticketsId
                    const ticketsId = document.querySelector('#trHeadTicket').dataset.idticket;
                                                        
                    ChangeQuantityOrAddProduct(ticketsId,productToAddId);

                    console.log('products ticketsId :'+ticketsId);
                    console.log('products productToAddId :'+productToAddId);
                    

                  break;

                 }//switch

            break;//Enter      

            case 'F1':
              event.preventDefault();

            
            break;

            case 'F2':
              event.preventDefault();

            break;

            case 'F3':
              event.preventDefault();
              
            break;

            case 'F4':
                event.preventDefault();                

            break;

            case 'F5':
                event.preventDefault();

            break;

            case 'F6':
                event.preventDefault();
                
            break;                
        
        }//switch                

    });//addEventListener()

    // Handle Mouse Pointer
    // Only rows with the green highlight use the pointer cursor on hover.
    document.addEventListener('mouseover', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = row.classList.contains('bg-success') ? 'pointer' : 'default';
    });

    document.addEventListener('mouseout', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = 'default';
    });

} //initKeyboardNigation()

function getTableRows(tableName) {
  switch (tableName) {
    case 'users':
      return document.querySelectorAll('#tbodyUsers tr');
    case 'tickets':
      return document.querySelectorAll('#tbodyTickets tr');
    case 'lignes_ticket':
      return document.querySelectorAll('#tbodyTicket tr');
    case 'categories':
      return document.querySelectorAll('#tbodyCategories tr');
    case 'products':
      return document.querySelectorAll('#tbodyProducts .product-card');
    default:
      return [];
  }
}

function getRowId(row, tableName) {
  if (!row) return null;
  switch (tableName) {
    case 'users':
      return row.dataset.iduser ;
    case 'tickets':
      return row.dataset.idticket;
    case 'lignes_ticket':
      currentSelected['tickets'] = row.dataset.idticket;
      return row.dataset.idligneticket;
    case 'categories':
      return row.dataset.idcategory;
    case 'products':
      return row.dataset.idproduct;
    default:
      return null;
  }
}

function highlightRow(tableName, id) {
  var rows = getTableRows(tableName);
  rows.forEach(function(row) {
    row.classList.remove('bg-success');
  });
  var selector = '';
  switch (tableName) {
    case 'users':
      selector = '#tbodyUsers tr[data-iduser="' + id + '"]';
      break;
    case 'tickets':                
      selector = '#tbodyTickets tr[data-idticket="' + id + '"]';
      break;
    case 'lignes_ticket':
      selector = '#tbodyTicket tr[data-idligneticket="' + id + '"]';
      break;
    case 'categories':
      selector = '#tbodyCategories tr[data-idcategory="' + id + '"]';
      break;
    case 'products':
      selector = '#tbodyProducts .product-card[data-idproduct="' + id + '"]';
      break;
  }
  var row = document.querySelector(selector);
  if (row) {
    row.classList.add('bg-success');
    row.focus();
  }
}

function selectRow(tableName, id, activate) {
  if (activate === undefined) activate = false;
  currentTable = tableName;
  currentSelected[tableName] = id;
  highlightRow(tableName, id);
  switch (tableName) {
    case 'users':
      if (activate) { displayUsers(id); }
      break;
    case 'tickets':
      if (activate) { displayTickets(id); }
      break;
    case 'lignes_ticket':
      if (activate) { displayTicket(id); }
      break;      
    case 'categories':
      if (activate) { displayCategories(id); }
      break;
    case 'products':
      if (activate) { displayProducts(id); }
      break;
    case '':
      break;
  }
}

function moveSelection(direction) {
  var allTrBody = document.querySelectorAll('#tbodyTicket tr');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }
}

function moveTicketsSelection(direction) {
  var allTrBody = document.querySelectorAll('#tbodyTickets tr');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }

}//moveTicketsSelection

function moveUsersSelection(direction) {
  var allTrBody = document.querySelectorAll('.trUser');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }

}//moveUsersSelection


function moveProductSelection(direction) {
  if (currentTable !== table_name[5]) {
    moveSelection(direction);
    return;
  }

  var cards = Array.from(getTableRows('products'));
  if (cards.length === 0) return;

  var currentId = currentSelected.products;
  var index = cards.findIndex(card => String(card.dataset.idproduct) === String(currentId));
  if (index === -1) index = 0;

  var newIndex = Math.max(0, Math.min(cards.length - 1, index + direction));
  selectRow('products', Number(cards[newIndex].dataset.idproduct), false);
}

//=========================(Init Light Row displayTickets)================================
function colorRowTickets(idTicket){

  if(document.querySelectorAll(".trTicketTable3")){

    var rows = document.querySelectorAll('.trTicketTable3');
    rows.forEach(row => {row.classList.remove('bg-success')});

    //var selector = '#trTicket'+String(idTicket);
    //document.querySelector(selector).classList.add('bg-success'); 
    
    var colorRow = document.querySelector('#trTicket'+String(idTicket))

    if(colorRow){

      colorRow = colorRow.classList.add('bg-success')

    }      
  }  
}

function colorRowUsers(idUser){

  if(document.querySelectorAll(".trUser")){

    var rows = document.querySelectorAll('.trUser');
    rows.forEach(row => {row.classList.remove('bg-success')});
    
    var colorRow = document.querySelector('#trUser'+String(idUser))

    if(colorRow){

      colorRow = colorRow.classList.add('bg-success')

    }      
  }  
}

function colorFirstRowUsers(){
  
  document.querySelector("#tbodyUsers tr").classList.add("bg-success");

}

function colorFirstRowTickets(){
  if(document.querySelector("#tbodyTickets tr")){

    var rows = document.querySelectorAll('#tbodyTickets tr');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyTickets tr").dataset.idticket;
    var selector = '#trTicket'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');

  }  

}//colorFirstRowTickets


function colorFirstRowTicket(){
  if(document.querySelector("#tbodyTicket tr")){

    var rows = document.querySelectorAll('#tbodyTicket tr');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyTicket tr").dataset.idligneticket;
    var selector = '#trDetailTicket'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');

  }  
}

function clearDeletedIndexProductTable5(idProduct,index){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

      const rowProduct = document.querySelector('#idSpanIndexProduct'+String(idProduct));

      rowProduct.textContent="";
      rowProduct.classList.remove("bg-danger");
      rowProduct.parentElement.classList.remove("bg-danger");


      console.log('idProduct :'+idProduct);
      console.log('index :'+index);

    }//200
  }//onload
   xhr.send();   
}//clearDeletedIndexProductTable5


function redAddedIndexProductTable5(idProduct,index){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

      const rowProduct = document.querySelector('#idSpanIndexProduct'+String(idProduct));

      rowProduct.textContent=String(index);           
      rowProduct.classList.add("bg-danger");
      rowProduct.parentElement.classList.add("bg-danger");


      console.log('idProduct :'+idProduct);
      console.log('index :'+index);

    }//200
  }//onload
   xhr.send();   
}//redAddedIndexProductTable5


function colorFirstRowProduct(){

  if(document.querySelector("#tbodyProducts .product-card")){

    var rows = document.querySelectorAll('#tbodyProducts .product-card');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyProducts .product-card").dataset.idproduct;
    var selector = '#productCard'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');
  
  }  
}

function displayProducts(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'loadDataProducts.php', true);

  xhr.onload = function(){
    if(xhr.status !== 200) return;

    var data = JSON.parse(xhr.responseText);
    var table = document.getElementById('idTable5');
    if(!table) return;

    var html = '<caption class="products-caption">All products</caption>';
    html += '<tbody id="tbodyProducts" class="products-grid">';
    var productIndex = 0;
    var currentCategory = null;
    var cardsInRow = 0;

    data.forEach( product => {
      if(product.name_category !== currentCategory){
        if(cardsInRow){ html += '</tr>'; cardsInRow = 0; }
        currentCategory = product.name_category;
        html += '<tr class="category-row"><th colspan="4">' + currentCategory + '</th></tr>';
      }

      if(cardsInRow === 0){
        html += '<tr id="rowsingleproduct" class="product-row">';
      }

      productIndex += 1;

      

      var image = product.imgSrc || 'default_product.png';
      var selected = productIndex === 1 ? ' bg-success' : '';
      html += '<td id="productCard' + product.id_product + '" class="product-card' + selected + '"' +
        ' data-idproduct="' + product.id_product + '" tabindex="0" onclick="selectRow(\'products\', ' + product.id_product + ')">' +
        '<div class="product-card-content">' +  

        '<div class="d-flex flex-column justify-content-center align-items-center gap-0 mt-0">'+
        '<img src="/uploads/products/' + image + '" alt="' + product.name_product + '">' +
        '<h5 class="card-title text-nowrap"><span class="text fw-bold px-3">' + product.name_product + '</span></h5>' +
        '<h4 class="card-text"><span class="product-price badge text-bg-dark rounded-pill fs-5">' + product.price + '</span></h4>' +

        '<h4 class="card-text rounded-pill w-100"><span id="idSpanIndexProduct'+product.id_product+'" class="product-index text fw-bold fs-5"></span></h4>' +        

        '</div>' +               
        '</div></td>';
      cardsInRow += 1;
      if(cardsInRow === 4){
        html += '</tr>';
        cardsInRow = 0;
      }
    });

    if(cardsInRow){ html += '</tr>'; }
    html += '</tbody>';
    table.innerHTML = html;

    colorFirstRowProduct();

    currentTable = table_name[5];

    //testfunction();        


  };//onload

  xhr.send();
}//displayProducts

function colortRowTicketTable4(idProduct){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

      const rows  = document.querySelectorAll('.trDetailTicketTable4') ;

       Array.from(rows).forEach(row => { row.classList.remove("bg-success") });

      Array.from(rows).forEach(row => {

        if(row.dataset.idproduct === idProduct){

          row.classList.add("bg-success")

          console.log('color row :'+row.classList);

        }   

      })

      console.log('color row idProduct :'+idProduct);

    }//200
  }//onload
   xhr.send();   
}//colortRowTicketTable4


function displayUsers(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/loadDataUsers.php',true);
  
  xhr.onload = function() {

    if(xhr.status==200){
     
      var data = JSON.parse(xhr.responseText);
      
  //  console.log(data);       
                           //=========( divTab1 )=========//     
                           //=========( table-1 )=========//     
    
      var divTab2El = document.getElementById("divTab2");

      if( divTab2El != null){
        divTab2El.classList.add("border");
        divTab2El.classList.add("border-secondary");
      }    
      
      htmlTable2 = `<caption class="fs-6 fw-bold mx-1" id="captionUsers">List users
                    </caption>                                    
                    <thead id="theadUsers">
                    </thead>                
                    <tbody id="tbodyUsers">
                    </tbody>
                    <tfoot id="tfootUsers">
                    </tfoot>      
                    `;
      document.getElementById("idTable2").innerHTML = htmlTable2;      

          //----------(theadUsers)----------------

          var htmlTheadUsers=`
                            <tr class="border border-danger border-1 w-100">
                              <th class="col-1 text text-center border border-dark border-1">Id</th>         
                              <th class="col-1 text text-center border border-dark border-1">imgSrc</th>
                              <th class="col-2 text text-center border border-dark border-1">User</th>          
                            </tr>
                          `;

          document.getElementById('theadUsers').innerHTML = htmlTheadUsers; 

          //----------(tbodyUsers)---------------- 

          document.getElementById('tbodyUsers').innerHTML=""; 

          data.forEach(element => {
         
          var      idUser = element.id_user; 

          var      imgSrc = element.imgsrc 

          if(imgSrc===""){
          imgSrc = "default_user.png";
            }

          var firstName = element.first_name

//style="cursor:pointer;"

         document.getElementById("idSpanFirstName").innerText = firstName;

          var htmlTbodyUsers=`<tr id="trUser`+idUser+`" class="trUser border border-dark fw-bold"
                                data-iduser ="`+idUser+`" onclick="" tabindex="0"> 
                              
                              <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+idUser+`</td>

                              <td class=" text text-center border border-dark border-1" id="imgProduct">            
                                <img id="idPhotoUser`+idUser+`" class="img img-fluid" src="/uploads/employees/`+imgSrc+`" width="50px"
                                onclick="">
                              </td>

                              <td id="idNameUser`+idUser+`" class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">`+firstName+`</td>
                          
                            </tr>            
                          `

            document.getElementById('tbodyUsers').innerHTML+=htmlTbodyUsers; 

          })//data.forEach

          colorRowUsers(idUser);
             
       //   currentTable = table_name[1] ;//users

       testfunction();        
             
    }//status==200  

  }//xhr.onload

  xhr.send();   

}//displayUsers


// 'tickets',[3]
//
function displayTickets(idUser,idTicket){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/loadDataTickets.php?idUser='+idUser,true);

  xhr.onload = function() {

    //==================( table-3)========================//     
    if(xhr.status==200){

      colorRowUsers(idUser)
      
      document.getElementById('divTab3').classList.add("border");
      document.getElementById('divTab3').classList.add("border-secondary");
      
      var data = JSON.parse(xhr.responseText);

      

       //Caption List tickets
      var nameUser = "";
      if(data[0]){
        console.log('data Tickets :'+data[0].first_name);
         nameUser = "List tickets "+data[0].first_name; }

      htmlTable3 = ` <caption class="fw-bold fs-6 mx-1">
                        <div class="text text-center fs-6 fw-bold">                                         
                         <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">`+nameUser+`</span>
                        </div>               
                      </caption> 
                      <thead id="theadTickets">
                      </thead>
                      <tbody id="tbodyTickets">
                      </tbody>
                      <tfoot id="tfootTickets">
                      </tfoot>                        
                    `;
      document.getElementById("idTable3").innerHTML = htmlTable3;
                 
      //===========( Heads Tickets table)========================//
                          
      var htmlTheadTickets =`
                              <tr class="border border-danger border-1 fw-bold fs-5 w-100">
                                      <th scope="col" class="col-6 text text-center border border-dark border-1">IdTk</th>                
                                      <th scope="col" class="col-12 text text-center border border-dark border-1">NrTk</th>
                                      <th scope="col" class="col-6 text text-center border border-dark border-1">Total</th>                                     
                              </tr>
                            `;

      document.getElementById('theadTickets').innerHTML= htmlTheadTickets ;


      //===========(show Detail Ticket table)========================
      
      //calculate total tickets
      var somTickets = 0; 

      document.getElementById('tbodyTickets').innerHTML=""; 

      data.forEach(element => { 
     
        var       idTicket = element.id_ticket  ;
                //  currentSelected[table_name[3]] = idTicket;

        var       nrTicket = element.nr_ticket ;
        var    totalTicket = element.total_ticket;        
        
          var htmlTbodyTickets =  `
                                    <tr id="trTicket`+idTicket+`" class="trTicketTable3 border border-dark border-1 w-100"
                                        data-idticket="`+idTicket+`" tabindex="0">

                                      <td class="text text-center border border-dark fw-bold">`+idTicket+`</th>
                                      <td class="text text-center border border-dark fw-bold">`+nrTicket+`</th>
                                      <td class="text text-center border border-dark fw-bold">`+totalTicket+`</td>
                                        
                                    </tr>                      
                                  `;

        document.getElementById('tbodyTickets').innerHTML+=htmlTbodyTickets;
        somTickets += parseInt(totalTicket);

      });//forEach  
      
      dataFoot = `
              <tr>
                  <td class="text text-center border border-dark fw-bold">
                      <button class="btn btn-success btn-sm me-1"
                        onclick="ajouterTicket()"> Vente
                        <!--  <i class="fa-solid fa-plus"></i> -->
                      </button>
                  </td>                    

                  <td class="text text-center border border-dark">
                    <span class="badge text-bg-dark fw-bold fs-6">Total</span>
                  </td>

                  <td class="text text-center border border-dark">
                    <span class="text text-center text-dark fw-bold fs-6">`+somTickets.toFixed(2)+`</span>
                  </td>        
                  
              </tr>      
             `;

      var tfootTicketsEl = document.getElementById('tfootTickets') ;

      if(tfootTicketsEl != null){
        tfootTicketsEl.innerHTML=dataFoot; 
      }
      
      colorRowTickets(idTicket);

     // currentTable = table_name[3];      


    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//displayTickets  

function deleteLinesTicket(idTicket){

  var xhr = new XMLHttpRequest();
  
  xhr.open('GET','http://localhost:8000/deleteLinesTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

//      var  data =  JSON.parse(this.response);
      
    displayTicket(idTicket);
    displayTfootTicket(idTicket,0)

    }//status==200
  
  }//xhr.onload 

  xhr.send();

} //deleteLinesTicket


function deleteItemTicket(idTicket,idLigneTicket){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/deleteItemTicket.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);

     //console.log(data);

      displayTicket(idTicket);
      displayTfootTicket(idTicket,0);

    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//deleteItemTicket


function findUserId(){
                                   
                    const rows = document.querySelectorAll('.trUser');

                    rows.forEach(row => {
                      if(row.classList.contains("bg-success")){
                        userId = row.dataset.iduser ;                          
                      }                      
                    })  
                    
                    return userId;
                    
}


//The Id of Ticket in the head table Ticket.
function findTicketsId(){
                    
                    const ticketId = document.querySelector("#trHeadTicket").dataset.idticket ;
                    
                    return ticketId;
                    
}

//table4 (Ticket) => By a click on the line -> the line become green 
function rowSelected(idLigneTicket){

      currentTable = table_name[4];//'lignes_ticket'
  
      currentSelected[currentTable] = idLigneTicket;

      const rows = document.querySelectorAll("#tbodyTicket tr");

      if(rows){

        rows.forEach(row => {row.classList.remove('bg-success')});

        var selector = '#tbodyTicket tr[data-idligneticket="' + idLigneTicket + '"]';

        var row = document.querySelector(selector);

        if(row){  row.classList.add('bg-success');
                  row.focus();
                  productToAddId = row.dataset.idproduct;
          }  
                    
      }//rows


}//rowSelected

function findFirstTicketId(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/findFirstTicketId.php?idUser='+idUser,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);      

      console.log('data :'+data);
      
      displayTickets(idUser,data);

    }//200
  }//onload
   xhr.send();   


}//findFirstTicketId

//table4 Ticket
function findSelectedLineTicketId(){

                    const tbodyTicketEl = document.getElementById("tbodyTicket");
                    const classesTicket = Array.from(tbodyTicketEl.querySelectorAll('tr'))
                    const indexGreenTicket = classesTicket.findIndex(element => element.classList.contains("bg-success")); 
                    const RowTicket = document.querySelectorAll('#tbodyTicket tr')[indexGreenTicket];          
                    const RowTicketId = RowTicket.dataset.idligneticket; 
                    return RowTicketId;
}

function getQuantity(idTicket,idLigneTicket,plusMinus){

  var xhr = new XMLHttpRequest();
    
  xhr.open('GET','http://localhost:8000/getQuantity.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket+'&plusMinus='+plusMinus,true);

  xhr.onload = function() {

   if(xhr.status==200){

     var  data =  JSON.parse(this.response); 
    
     document.querySelector('#quantity'+idLigneTicket).textContent = data.quantity;

     var totalItem = data.quantity * data.price;

     document.querySelector('#spanTotalItem'+idLigneTicket).textContent = totalItem.toFixed(2);

    if(data.total_ticket !== undefined){
     document.querySelector('#spanTotalTicket').textContent = (data.total_ticket*1).toFixed(2);
    }

     
   }//status==200 
    
  }//xhr.onload 

  xhr.send();
   
}//getQuantity 


function displayTheadTicket(idUser,idTicket){

      var divTab4El = document.getElementById("divTab4");         
      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      } 

      var htmlTable4 = ` <caption class="fs-6 fw-bold mx-1" id="captionLineTicket">
                            <div class="text text-center fs-6 fw-bold">                     
                              <span>Ticket Nr:
                                <span class="badge text-bg-dark fw-bold fs-6" id="spanNrTicket"></span>
                              </span>                           
                            </div>               
                          </caption>   
                          <thead id="theadTicket">
                          </thead>  
                          <tbody id="tbodyTicket">
                          </tbody>
                          <tfoot id="tfootTicket">
                          </tfoot>      
                        `;

      document.getElementById("idTable4").innerHTML = htmlTable4;      

  //============( theadTicket )================================
      var htmlTheadTicket = `
                              <tr id="trHeadTicket" data-iduser="`+idUser+`" data-idticket="`+idTicket+`"
                                class="border border-danger border-1 w-100"> 
                                <th class="col-3 text text-center border border-dark border-1">Id</th>         
                                <th class="col-3 text text-center border border-dark border-1">imgSrc</th>
                                <th class="col-8 text text-center border border-dark border-1">Product</th>          
                                <th class="col-12 text text-center border border-dark border-1">Quantite</th> 
                                <th class="col-10 text text-center border border-dark border-1">Prix</th> 
                                <th class="col-10 text text-center border border-dark border-1">Total</th>                             
                              </tr>                                                  
                              ` ;

      document.getElementById("theadTicket").innerHTML = htmlTheadTicket ;

      
}//displayTheadTicket

//table4 Ticket
function rowSelected(idLigneTicket){

      currentTable = table_name[4];
  
      currentSelected[currentTable] = idLigneTicket;

      const rows = document.querySelectorAll("#tbodyTicket tr");

      if(rows){

        rows.forEach(row => {row.classList.remove('bg-success')});

        var selector = '#tbodyTicket tr[data-idligneticket="' + idLigneTicket + '"]';

        var row = document.querySelector(selector);

        if(row){  row.classList.add('bg-success');
                  row.focus();
                  productToAddId = row.dataset.idproduct;
          }  
                    
      }//rows


}//rowSelected

function displayTbodyTicket(dataBodyTicket){
        
  var idLigneTicket = dataBodyTicket.idLigneTicket
  var      idTicket = dataBodyTicket.idTicket;
  var     idProduct = dataBodyTicket.idProduct                                   
  var        imgSrc = dataBodyTicket.imgSrc  
  var         index = dataBodyTicket.index;
  var   nameProduct = dataBodyTicket.nameProduct;
  var      quantity = dataBodyTicket.quantity;
  var         price = dataBodyTicket.price;

  var     totalItem = quantity * price;
//============================================
//=============================================
  if(imgSrc===""){
    imgSrc = "default_product.png";
  }

  var htmlTbodyTicket = `<tr  id="trDetailTicket`+idLigneTicket+`" class="trDetailTicketTable4  border border-dark border-1 w-100"
                                data-idindex="`+index+`"
                                data-idligneticket="`+idLigneTicket+`"
                                data-idproduct="`+idProduct+`"
                                data-idticket="`+idTicket+`"    onclick="rowSelected(`+idLigneTicket+`)" tabindex="0"> 

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+index+`</td>
                                
                                <td class=" text text-center border border-dark border-1">
                                  <img class="img img-fluid imgProduct"  
                                  src="./uploads/products/`+imgSrc+`"  width="50px">                                            
                                </td>

                                <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">`+nameProduct+`</td>

                                <td class=" text text-center border border-dark border-1"><!---Quantity------> 
                    
                                  <div class="d-flex">

                                        <!-- Btn Trash   -->
                                        <button id="supItemCart`+idLigneTicket+`" class="supItemCart btn btn-danger btn-sm mx-1"
                                          onclick="clearDeletedIndexProductTable5(`+idProduct+`,`+index+`);deleteItemTicket(`+idTicket+`,`+idLigneTicket+`)">
                                          <i class="fa-solid fa-trash-can"></i>
                                        </button> 

                                        <!-- Btn minus   -->
                                        <button id="decrementQuantity`+idLigneTicket+`" class="decrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+0+`)">
                                          -
                                        </button>

                                        <!-- Quantity   -->
                                        <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+quantity+`</span>

                                        <!-- Btn plus   -->
                                        <button id="incrementQuantity`+idLigneTicket+`" class="incrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+1+`)">
                                          +
                                        </button> 

                                    </div>
                                </td>

                                <td class="text text-center border border-dark border-1 fs-6 fw-bold">`+price+`</td>

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">
                                <span class="text text-bg-dark fs-6 mx-1" id="spanTotalItem`+idLigneTicket+`">
                                `+totalItem.toFixed(2)+`
                                </span>
                                </td>
                      
                           </tr>`; 
                                                           
                document.getElementById('tbodyTicket').innerHTML += htmlTbodyTicket;

}//displayBodyTicket

function displayTfootTicket(idTicket,totalTicket){
    
  var total =(totalTicket*1).toFixed(2);


  var htmlFootTicket =  ` <tr> 
                              <td class="text text-center border border-dark border-1 fs-6 fw-bold" colspan="3">
                                <div class="d-flex justify-content-center">
                                                      <!-- Btn Trash   -->
                                  <button class="btn btn-danger mx-1"
                                    onclick="deleteLinesTicket(`+idTicket+`)">
                                    <i class="fa-solid fa-trash-can"></i>
                                  </button> 
                                                      <!-- Btn Print   -->
                                  <a class="print btn btn-success mx-1" href="#" onclick="printTicket(`+idTicket+`); return false;">
                                    <i class="fa-solid fa-print"></i>
                                  </a>

                                </div>
                              </td>

                              <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                                <div class="d-flex flex-row justify-content-center fs-6">
                                <span>TTC</span>
                                <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+total+`</span>
                                </div>
                              </td>                            
                            </tr>`;
 
            
  document.getElementById('tfootTicket').innerHTML=htmlFootTicket;           
        
} //displayTfootTicket


function displayTicket(idTicket){
 
  var xhr = new XMLHttpRequest();
 
  xhr.open('GET','http://localhost:8000/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){
   
      var  data =  JSON.parse(this.response);

      var idUser = data[0].idUser;
          
      displayTheadTicket(idUser,idTicket);
                                                        
      var spanNrTicketEl = document.getElementById('spanNrTicket');
      if(spanNrTicketEl != null){
        spanNrTicketEl.textContent = data[0].nrTicket;
      } 

      var totalTicket = data[0].totalTicket;

      data = data.slice(1); // Remove the first element which contains ticket info .

      if(data.length > 0){ 

      data.forEach( element => {

        var dataTicket = {
                        idLigneTicket : element.id_ligne_ticket,
                        idTicket      : element.id_ticket,
                        idProduct     : element.id_product,                              
                        imgSrc        : element.imgSrc,
                        index         : element.indexRowTicket,
                        nameProduct   : element.name_product,
                        quantity      : element.quantity,
                        price         : element.price                 
                        }

      displayTbodyTicket(dataTicket); }); //forEach

     
      }else{
        document.getElementById('tbodyTicket').innerHTML = "";
      } 

      displayTfootTicket(idTicket,totalTicket);
            
      removeRedProductsInTable5(idTicket)
      RedProductsInTable5(idTicket);
            
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayTicket  


function addSingleProductInTicket(idTicket,idProduct){

  var xhr = new XMLHttpRequest();
                                                                        
  xhr.open('GET','http://localhost:8000/addProductToTicket.php?idTicket='+idTicket+'&idProduct='+idProduct,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);
      
      console.log('data  add product :'+data);

      //========================================
      var dataTicket = {
                        idLigneTicket : data.idLigneTicket,
                        idTicket      : data.idTicket,
                        idProduct     : data.idProduct,                              
                        imgSrc        : data.imgSrc,
                        index         : data.index,
                        nameProduct   : data.nameProduct,
                        quantity      : data.quantity,
                        price         : data.price                 
                        }

      displayTbodyTicket(dataTicket);  //forEach

      const rows = document.querySelectorAll(".trDetailTicketTable4");
      Array.from(rows).forEach(row => {
          row.classList.remove("bg-success");
      });
      document.querySelector("#trDetailTicket"+String(data.idLigneTicket)).classList.add("bg-success");

      redAddedIndexProductTable5(data.idProduct,data.index);

      displayTicket(idTicket);

      colortRowTicketTable4(idProduct)
              
    }//200

  }//onload

   xhr.send();   
  
}//addSingleProductInTicket


function ChangeQuantityOrAddProduct(idTicket,idProduct){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

    //var  data =  JSON.parse(this.response);

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('#tbodyTicket tr');

    // Load all index and id product existing already in the current ticket
    // index and id as an object
    rows.forEach(row => {

          redProducts.push({     index: row.dataset.idindex, 
                             productId: row.dataset.idproduct });

    });//forEach

    //==============( New product ?)=================================

    const exists = redProducts.some(element => element.productId === String(idProduct));
    
    if(exists) {
      
     // alert('product exist !');
      colortRowTicketTable4(idProduct)
          
    } else {

      //alert("Le produit id = "+idProduct+"est nouveau");     
      addSingleProductInTicket(idTicket,idProduct);
                    
    }//else

    currentTable = table_name[5];
        
    }//status==200

  }//function

  xhr.send();
   
}//ChangeQuantityOrAddProduct


function removeRedProductsInTable5(idTicket){

  const rows = document.querySelectorAll("#idSpanIndexProduct")

  rows.forEach(row => {

    row.textContent = "";

    row.textContent = "";
    var classListSpan = row.classList;
    classListSpan.remove("bg-danger");

    var parentSpan = row.parentElement.classList ;
    parentSpan.remove("bg-danger");
  
  });

  
  
}//removeRedProductsInTable5

function RedProductsInTable5(idTicket){

  var xhr = new XMLHttpRequest();
  xhr.open('GET','',true);

  xhr.onload = function() {
    
    if(xhr.status==200){

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('.trDetailTicketTable4');


    // Load all index and id product existing already in the current ticket
    // index and id in an object
    rows.forEach(row => {

          //console.log('row Ligne Ticket :',row,"index :",row.dataset.idindex,"productId :",row.dataset.idproduct);

          redProducts.push({     index: row.dataset.idindex, 
                             productId: row.dataset.idproduct });

    });//forEach

    redProducts.forEach( element => {

      var productCard = document.querySelector('#idSpanIndexProduct'+String(element.productId));

      if(!productCard) return;

      productCard.textContent = element.index;
      productCard.classList.add("bg-danger");
      productCard.parentElement.classList.add("bg-danger");

    })//forEach
    
    }//status==200 =========

  }//xhr.onload 

  xhr.send();

}//RedProductsInTable5

function productsInTicket(idTicket){

  var xhr = new XMLHttpRequest();
                                      
  xhr.open('GET','http://localhost:8000/loadProductsInTicket.php?idTicket='+idTicket,true);
  
  xhr.onloadend = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);
      
      var firstTds = document.querySelectorAll("#tbodyProducts tr td:first-child")

      Array.from(firstTds).map(td =>
        {
          data.forEach( element => {
            if(td.parentElement.dataset.idproduct == element.id_product ){

              td.textContent = element.indexRowTicket;
              td.classList.add('bg-danger')

            }
           
          })
          
        });
     
    }//200

  }//onload

  xhr.send();

}//productsInTicket

//============================= ( displayDetailScrollingTickets )===========================================
function displayDetailScrollingTickets(idTicket){
 
  var xhr = new XMLHttpRequest();

  
  xhr.open('GET','http://localhost:8000/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){
   
      var  data =  JSON.parse(this.response);
      
      colorRowTickets(idTicket);
    
      displayTheadScrollTickets();
                                                        
      var spanNrTicketEl = document.getElementById('spanNrTicket');
      if(spanNrTicketEl != null){
        spanNrTicketEl.textContent = data[0].nrTicket;
      } 

      var totalTicket = data[0].totalTicket;

      data = data.slice(1); // Remove the first element which contains ticket info .

      if(data.length > 0){ 

      data.forEach( element => {

        var dataTicket = {
                        idLigneTicket : element.id_ligne_ticket,
                        idTicket      : element.id_ticket,
                        idProduct     : element.id_product,                              
                        imgSrc        : element.imgSrc,
                        index         : element.indexRowTicket,
                        nameProduct   : element.name_product,
                        quantity      : element.quantity,
                        price         : element.price                 
                        }

      displayTbodyScrollTickets(dataTicket); }); //forEach

     // colorFirstRowTicket();

      }else{
        document.getElementById('tbodyTicket').innerHTML = "";
      } 

      displayTfootScrollTickets(idTicket,totalTicket);

      removeRedProductsInTable5(idTicket)
      RedProductsInTable5(idTicket);
            
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayDetailScrollingTickets  


//========================================================================
function displayTheadScrollTickets(){

      var divTab4El = document.getElementById("divTab4");         
      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      } 

      var htmlTable4 = ` <caption class="fs-6 fw-bold mx-1" id="captionLineTicket">
                            <div class="text text-center fs-6 fw-bold">                     
                              <span>Ticket Nr:
                                <span class="badge text-bg-dark fw-bold fs-6" id="spanNrTicket"></span>
                              </span>                           
                            </div>               
                          </caption>   
                          <thead id="theadTicket">
                          </thead>  
                          <tbody id="tbodyTicket">
                          </tbody>
                          <tfoot id="tfootTicket">
                          </tfoot>      
                        `;

      document.getElementById("idTable4").innerHTML = htmlTable4;      

  //============( theadTicket )================================
      var htmlTheadTicket = `
                              <tr id="trHeadTicket" class="border border-danger border-1 w-100"> <!-- table row--->                             
                                <th class="col-3 text text-center border border-dark border-1">imgSrc</th>
                                <th class="col-8 text text-center border border-dark border-1">Product</th>          
                                <th class="col-12 text text-center border border-dark border-1">Qu.</th> 
                                <th class="col-10 text text-center border border-dark border-1">Prix</th> 
                                <th class="col-10 text text-center border border-dark border-1">Total</th>                             
                              </tr>                                                  
                              ` ;

      document.getElementById("theadTicket").innerHTML = htmlTheadTicket ;


}//displayTheadScrollTickets

function displayTbodyScrollTickets(dataBodyTicket){
        
  var idLigneTicket = dataBodyTicket.idLigneTicket
  var      idTicket = dataBodyTicket.idTicket;
  var     idProduct = dataBodyTicket.idProduct                                   
  var        imgSrc = dataBodyTicket.imgSrc  
  var         index = dataBodyTicket.index;
  var   nameProduct = dataBodyTicket.nameProduct;
  var      quantity = dataBodyTicket.quantity;
  var         price = dataBodyTicket.price;

  var     totalItem = quantity * price;
//============================================
//=============================================
  if(imgSrc===""){
    imgSrc = "default_product.png";
  }

  var htmlTbodyTicket = `<tr  id="trDetailTicket`+idLigneTicket+`" class="border border-dark border-1 w-100"
                                data-idindex="`+index+`"
                                data-idligneticket="`+idLigneTicket+`"
                                data-idproduct="`+idProduct+`"
                                data-idticket="`+idTicket+`"    onclick="rowSelected(`+idLigneTicket+`)" tabindex="0"> 
                                                            
                                <td class=" text text-center border border-dark border-1">
                                  <img class="img img-fluid imgProduct"  
                                  src="./uploads/products/`+imgSrc+`"  width="50px">                                            
                                </td>

                                <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">`+nameProduct+`</td>

                                <td class=" text text-center border border-dark border-1"><!---Quantity------> 

                                  <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+quantity+`</span>

                                </td>

                                <td class="text text-center border border-dark border-1 fs-6 fw-bold">`+price+`</td>

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">
                                <span class="text text-bg-dark fs-6 mx-1" id="spanTotalItem`+idLigneTicket+`">
                                `+totalItem.toFixed(2)+`
                                </span>
                                </td>
                      
                           </tr>`; 
                                                           
                document.getElementById('tbodyTicket').innerHTML += htmlTbodyTicket;

}//displayTbodyScrollTickets

function displayTfootScrollTickets(idTicket,totalTicket){
    
 var total =(totalTicket*1).toFixed(2);

  
 var htmlFootTicket =  ` <tr> 
                              <td class="text text-center border border-dark border-1 fs-3 fw-bold" colspan="3"> 
                              
                                <a id="aBtnChangeTicket" data-idticket=`+idTicket+` href="http://localhost:8000/changeTicket.php?idTicket=`+idTicket+`" class="btn mx-1">
                                <div class="badge text-bg-success fw-bold fs-4" >
                                <i class="fa-solid fa-pencil"></i>                                
                                </div>
                                </a>                                                                                     
                             
                              </td>

                              <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                                <div class="d-flex flex-row justify-content-center fs-6">
                                <span>TTC</span>
                                <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+total+`</span>
                                </div>
                              </td>                            
                            </tr>`;    
          
  document.getElementById('tfootTicket').innerHTML=htmlFootTicket;           
        
}

function readVariables(){

  console.log('currentTable :'+currentTable);
  console.log('currentSelected[table_name[3]] :'+currentSelected[table_name[3]]);
 
}

function scrollTickets(idUser,idTicket){

  startTime();
  displayUsers(idUser);
  displayTickets(idUser,idTicket);  

  currentSelected[table_name[1]] =idUser;//The selected ticket
  currentSelected[table_name[3]] =idTicket;//The selected ticket

 
  console.log('scrollTickets idUser :'+idUser);
  console.log('scrollTickets idTicket :'+idTicket);


  //displayTickets(idUser);
   
}//scrollTickets

//products [5]
function changeTicket(idTicket){

  displayTicket(idTicket);                           
  displayProducts();

}

function modelRequest(idArgument){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/modelRequest.php?idArgument='+idArgument,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);      
      //console.log('data :' + JSON.stringify(data));

      //>
      //>
      //>
      //>      
    }//200
  }//onload
   xhr.send();   
}//modelRaquest

/////////////////////( test function )///////////////////////////////////////////////////:
function testfunction(){

console.log("Ici test function !")


document.getElementById("idImgUser").src="/uploads/employees/6780d515c22b9default_employe.png";


     
}//testfunction