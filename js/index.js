/*

Diffcheck implementation based on Wikipedia's diff checking algorithm.
Wikipedia displays the diff of both texts in a single composite text;
this tool takes the output of Wikipedia's algorithm and displays it in two
separate fields.

TO DO:
* find a way to archive the output
* further testing + customization
* implement moved sections in the refine function

See:
* description of the Wikipedia algorithm: https://en.wikipedia.org/wiki/User:Cacycle/diff
* online test instance of the Wikipedia diff tool: http://cacycle.altervista.org/wikEd-diff-tool.html
* javascript code of the Wikipedia diff tool: https://en.wikipedia.org/w/index.php?title=User:Cacycle/diff.js&action=raw&ctype=text/javascript
*/


////////////////////////// Initialize //////////////////////////////////////////

// example inputs for testing / demonstration purposes:

var inputA = `الي النهروان يوم السبت فاقام به ثمانية ايام وخرج اليه اهل بيته ووجوه اهل بغداد فسلموا عليه فلما كان يوم السبت الاخر دخل الي بغداد وكان قد كتب الي طاهر بن الحسين وكان بالرقة ان يوافيه بالنهروان فقدم طاهر ودخل عليه وامره ان ينزل الخيزرانية هو واصحابة ثم انه تحول فنزل قصره علي شاطء دجلة وامر حميد بن عبد الحميد وعلي بن هشام وكل من-- كان في عساكر هما ان ينزلوا في عسكره قالوا جميعا فكانوا يختلفون الي ال----مامون في كل يوم مسلمين ولباسهم الثياب الخضر ولم يكن احد يدخل عليه---- الا في خضرة-------- ولبس ذلك اهل بغداد---------- اجمعون وكانوا يخرقون كل شء راو-ه من السواد علي ا--حد الا القلانس-- فان------------ الواحد بعد الواحد كان يلبسها متخوفا ووجلا فاما قباء او علم فلم يكن احد يجترء ان يلبس شيءا من ذلك ولا يحمله فمكثوا بذلك ثمانية ايام وتكلم فيها-- بنو هاشم من ولد العباس خاصة وقالوا له  يا امير المءمنين تركت لباس -------اهل بيتك ودولتهم ولبست الخضرة قالوا وكتب اليه في ذلك قواد اهل خراسان`;
var inputB = `الي النهروان وذلك يوم السبت فاقام فيه ثمانية ايام وخرج اليه اهل بيته والقواد ووجوه الناس فسلموا عليه وقد كان كتب الي طاهر بن الحسين من الطريق وهو بالرقة ان يوافيه الي النهروان فوافاه بها فلما كان السبت الاخر دخل بغداد ارتفاع النهار لا-ربع عشرة ليلة بقيت من صفر سنة اربع وماءتين و----لباسه ولباس اصحابه------ اقبيتهم وقلانسهم وطراداتهم واعلامهم كلها الخضرة------ فلما قدم نزل الرصافة وقدم معه طاهر فامره بنزو-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ل الخيزرانية مع -اصحابه ثم---- تحول فنزل قصره علي شط-- دجلة وامر حميد بن عبد الحميد وعلي بن هشام وكل قاءد كان في عس-كر---ه ان ي--قيم في عسكره ------------فكانوا يختلفون الي دار المامون في كل يوم ولم يكن-------------------------------- يدخل عليه احد الا في الثياب الخضر ولبس ذلك اهل بغداد وبنو هاشم اجمعون فكانوا يخرقون كل شء يرونه من السواد علي انسان الا القل-نسوة فانه كان يلبسها الواحد بعد الواحد علي ---------خوف- ووجل- فاما قباء او علم فلم يكن احد يجترء ان يلبس شيءا من ذلك ولا يحمله فمكثوا بذلك ثمانية ايام فتكلم في ذلك بنو هاشم و--ولد العباس خاصة وقالوا له- يا امير المءمنين تركت لباس اباءك واهل بيتك ودولتهم ولبست الخضرة------ وكتب اليه في ذلك قواد اهل خراسان `;

var inputA = `# وبها نخيل وثمار كثيرة، وزروعهم على ماء النيل، تمتد فتعم «1» المزارع من
~~حد أسوان إلى حد الاسكندرية وسائر الريف، فيقيم الماء من «2» عند ابتداء
~~الحر إلى ms051 الخريف، ثم ينصرف فيزرع ثم لا يسقى بعد ذلك، وأرض مصر لا تمطر ولا
~~تثلج،
# وليس بأرض مصر مدينة يجرى فيها الماء «3» دائما غير الفيوم، والفيوم
~~هذه مدينة وسطة، يقال إن يوسف النبي عليه السلام اتخذ لهم مجرى يدوم لهم
~~فيه الماء، وقوم بحجارة وسماء اللاهون.
# وأما النيل فإن ابتداء مائه لا يعلم، وذلك أنه يخرج من مفازة من وراء أرض
~~الزنج لا تسلك، حتى ينتهى إلى حد الزنج، ثم يقطع فى مفاوز وعمارات أرض
~~النوبة، فيجرى على عمارات متصلة إلى أن يقع فى أرض مصر،`
var inputB = `# (15)
~~وبمصر نخيل كثيرة وبساتين وأجنة صالحة وتمتد زروعهم @ALIGN@B@56@ بماء النيل من حد اسوان
~~الى حد الإسكندرية والباطن ويقيم الماء فى أرضهم بالريف والحوف منذ امتداد
~~الحر الى الخريف «11» وينضب على ما @firstP@قدمت ذكره فيزرع ولا يحتاج الى سقى ولا
~~مطر من بعد ذلك، وأرض مصر لا تمطر ولا تثلج، وليس بأرض مصر مدينة ms124 يجرى فيها
~~الماء من غير حاجة الى زيادة النيل إلا الفيوم والفيوم اسم الإقليم
~~وبالفيوم مدينة وسطة ذات جانبين تعرف بالفيوم ويقال أن يوسف النبي عليه
~~السلام اتخذ لهم مجرى وزنه ليدوم لهم دخول الماء فيه وقومه بالحجارة
~~المنضدة وسماه اللاهون «17» ،
# (16) وماء النيل فلا يعلم أحد مبتدأه وذلك
~~أنه يخرج من مفاوز وراء أرض الزنج لا تسلك حتى ينتهى الى حد الزنج ويقطع فى
~~مفاوز النوبة وعماراتهم فيجرى لهم فى عمارات متصلة الى أن يقع فى أرض مصر،`

//var inputA = `يقال ان يوسف النبي عليه السلام اتخذ لهم مجري يدوم لهم فيه الماء وقوم بحجاره وسماء اللاهون`
//var inputB = `ويقال ان يوسف النبي عليه السلام اتخذ لهم مجري وزنه ليدوم لهم دخول الماء فيه وقومه بالحجاره المنضده وسماه اللاهونن`

/*var inputA = "الي النهروان يوم السبت فاقام به ثمانية ايام"
var inputB = "الي النهروان وذلك يوم السبت فاقام فيه ثمانية ايام"*/

// initialize global variables:

var inputIntro, outputIntro, inputButtons, outputButtons, optionButtons,
loadFromTextareaBtn, uploadBtn, inputBtn, optionsBtn, svgBtn, pngBtn, resetButton,
optionsDiv, inputDiv, outputDiv, outputSingleDiv, loadExampleLnk, resizeCont, clearBtn, highlightDiffBtn, highlightCommonBtn, rowsChk, punctCheck, punct,
ngramInput, refine_n, cleanChk, arCharInp, fontSizeInp, normalizeAlifCheck, normalizeYaCheck, normalizeHaCheck, singleDivCheck,
normalizeAlif, normalizeYa, normalizeHa, singleDiv, intoRows, clean, uploadModal, closeSpan, inputfileBtn, csvTable, rowFilterInp,
csvArray, csvHeader, relevCols, selectRowsControls, selectAllRowsBtn, deselectAllRowsBtn, loadSelectedRowsBtn,
nextPageBtn, prevPageBtn, paginationDiv, currentPageInp, lastPageSpan, downloadAllPngBtn, downloadAllSvgBtn;

var VERBOSE = false;
var inputData = [];
var currentPage = 0;

// add event listeners to buttons etc.:

window.addEventListener('load', function() {
  inputIntro = document.getElementById("inputIntro");
  outputIntro = document.getElementById("outputIntro");
  inputDiv = document.getElementById("inputDiv");
  outputDiv = document.getElementById("outputDiv");
  outputSingleDiv = document.getElementById("outputSingleDiv");
  inputButtons = document.getElementById("inputButtons");
  outputButtons = document.getElementById("outputButtons");
  optionButtons = document.getElementById("optionButtons");

  loadExampleLnk = document.getElementById("loadExample");
  loadExampleLnk.addEventListener("click", loadExample);

  resizeCont = document.getElementsByClassName("resize-container")[0];
  var resizer = document.createElement('div');
  resizer.className = 'resizer';
  resizer.title = "resize the diff";
  resizer.style.width = '10px';
  resizer.style.height = "100%";
  resizer.style.position = 'absolute';
  resizer.style.right = 0;
  resizer.style.bottom = "0";
  resizer.style.cursor = 'col-resize';
  resizer.style.marginLeft = "10px";
  resizer.setAttribute("onmouseover", "this.style.background='lightgrey'");
  resizer.setAttribute("onmouseout", "this.style.background='white'");
  resizeCont.appendChild(resizer);
  //var resizer = document.getElementsByClassName("resizer")[0];
  resizer.addEventListener('mousedown', initResize, false);
  resizer.addEventListener('hover', function(){
    resizer.style.color = "lightgrey";
  })

  loadFromTextareaBtn = document.getElementById("calcDiffButton");
  loadFromTextareaBtn.addEventListener("click", loadFromTextArea);
  uploadModal = document.getElementById("uploadModal");
  uploadBtn = document.getElementById("uploadButton");
  uploadBtn.addEventListener("click", function() {
    uploadModal.style.display = "block";
  });
  closeSpan = document.getElementsByClassName("close")[0];
  closeSpan.addEventListener("click", function() {
    uploadModal.style.display = "none";
  });
  inputfileBtn = document.getElementById("inputfileButton");
  inputfileBtn.addEventListener("change", loadCSV);
  selectRowsControls = document.getElementById("selectRowsControls");
  csvTable = document.getElementById("csvTable");
  rowFilterInp = document.getElementById("rowFilter");
  rowFilterInp.addEventListener("change", displayCSV);
  selectAllRowsBtn = document.getElementById("selectAllRows");
  selectAllRowsBtn.addEventListener("click", selectAllRows);
  deselectAllRowsBtn = document.getElementById("deselectAllRows");
  deselectAllRowsBtn.addEventListener("click", deselectAllRows);
  loadSelectedRowsBtn = document.getElementById("loadSelectedRows");
  loadSelectedRowsBtn.addEventListener("click", loadSelectedRows);

  clearBtn = document.getElementById("clearButton");
  clearBtn.addEventListener("click", clear);


  optionsDiv = document.getElementById("options");
  optionsBtn = document.getElementById("optionsButton");
  optionsBtn.addEventListener("click", function(){
    if (optionsBtn.value === "Options"){
      optionsDiv.style.display = "block";
      optionsBtn.value = "Hide options";
      optionButtons.style.display = "inline-block";
    } else {
      optionsDiv.style.display = "none";
      optionsBtn.value = "Options";
      optionButtons.style.display = "none";
    }
  });

  svgBtn = document.getElementById("svgButton");
  svgBtn.addEventListener("click", downloadSvg);
  pngBtn = document.getElementById("pngButton");
  pngBtn.addEventListener("click", downloadPng);

  resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetOptions);

  highlightDiffBtn = document.getElementById("highlightDiffBtn");
  highlightDiffBtn.addEventListener("click", toggleHighlighting);
  highlightCommonBtn = document.getElementById("highlightCommonBtn");
  highlightCommonBtn.addEventListener("click", toggleHighlighting);
  rowsChk = document.getElementById("rowsCheck");
  rowsChk.addEventListener("change",  calcDiffIfVisible);
  fontSizeInp = document.getElementById("fontSizeInput");
  fontSizeInp.addEventListener("change",  changeFontSize);
  arCharInp = document.getElementById("arCharInput");
  arCharInp.addEventListener("change",  calcDiffIfVisible);
  cleanChk = document.getElementById("cleanCheck");
  cleanChk.addEventListener("change", calcDiffIfVisible);
  punctCheck = document.getElementById("punctCheck");
  punctCheck.addEventListener("change",  calcDiffIfVisible);
  normalizeAlifCheck = document.getElementById("normalizeAlifCheck");
  normalizeAlifCheck.addEventListener("change",  calcDiffIfVisible);
  normalizeYaCheck = document.getElementById("normalizeYaCheck");
  normalizeYaCheck.addEventListener("change",  calcDiffIfVisible);
  normalizeHaCheck = document.getElementById("normalizeHaCheck");
  normalizeHaCheck.addEventListener("change",  calcDiffIfVisible);
  ngramInput = document.getElementById("ngramInput");
  ngramInput.addEventListener("change",  calcDiffIfVisible);
  singleDivCheck = document.getElementById("singleDivCheck");
  singleDivCheck.addEventListener("change",  calcDiffIfVisible);

  inputBtn =  document.getElementById("inputButton");
  inputBtn.addEventListener("click", function(){
    inputDiv.style.display="block";
    inputIntro.style.display="block";
    inputButtons.style.display="inline-block";
    outputDiv.style.display="none";
    outputIntro.style.display="none";
    outputButtons.style.display="none";
  });

  nextPageBtn = document.getElementById("nextPage");
  nextPageBtn.addEventListener("click", nextPage);
  prevPageBtn = document.getElementById("prevPage");
  prevPageBtn.addEventListener("click", prevPage);
  paginationDiv = document.getElementById("pagination");
  currentPageInp = document.getElementById("currentPageInput");
  currentPageInp.addEventListener("change", jumpToPage);
  lastPageSpan = document.getElementById("lastPageSpan");
  downloadAllPngBtn = document.getElementById("downloadAllPngBtn");
  downloadAllPngBtn.addEventListener("click", downloadAllPng);
  downloadAllSvgBtn = document.getElementById("downloadAllSvgBtn");
  downloadAllSvgBtn.addEventListener("click", downloadAllSvg);
});

window.addEventListener('resize', function(){
  if (outputDiv.style.display !== "none"){
    calcDiffIfVisible();
  }
});



//////////////////  Helper functions called by buttons ///////////////////////

function prevPage(){
  if (currentPage === 0){
    currentPage = Math.ceil((inputData.length - 1)/2)-1;
  } else {
    currentPage--;
  }
  currentPageInp.value = currentPage+1;
  calcDiff();
}
function nextPage(){
  if (currentPage+1 === Math.ceil((inputData.length - 1)/2)){
    currentPage = 0;
  } else {
    currentPage++;
  }
  currentPageInp.value = currentPage+1;
  calcDiff();
}

function jumpToPage(){
  currentPage = parseInt(currentPageInp.value)-1;
  calcDiff();
}

function loadFromTextArea(){
  let a = document.getElementById("inputA").value;
  let b = document.getElementById("inputB").value;
  if (a === ""){
    document.getElementById("inputA").value = "PLEASE PROVIDE A TEXT HERE";
    return
  } else if (b === ""){
    document.getElementById("inputB").value = "PLEASE PROVIDE A TEXT HERE TOO";
    return
  } else if (a === b){
    window.alert("Two identical texts provided!");
    return
  }
  inputData = [[a, b], ];
  calcDiff();
  paginationDiv.style.display = "none";
}

function calcDiffIfVisible(){
  if (outputDiv.style.display === "block"){
    calcDiff();
  }
}

function loadExample(){
  document.getElementById("inputA").value = inputA;
  document.getElementById("inputB").value = inputB;
}

function clear(){
  document.getElementById("inputA").value = "";
  document.getElementById("inputB").value = "";
}

function parseCSV(r){
  let csvArray = [];
  let tabs = (r.match(/\t/g) || []).length;
  let commas = (r.match(/,/g) || []).length;
  //console.log("tabs: "+tabs, "commas: "+commas);
  if (tabs > commas){
    var csvSeparator = new RegExp("\t", "g");
  } else {
    var csvSeparator = new RegExp(",", "g");
  }
  r.trim().split(/[\r\n]+/g).forEach(function(row){
    let rowArray = [];
    //row.split(/[,\t]/g).forEach(function(cell){
    row.split(csvSeparator).forEach(function(cell){
      rowArray.push(cell);
    })
    csvArray.push(rowArray);
  })
  return csvArray;
}

function displayCSV(){
  var rowFilter = new RegExp(rowFilterInp.value, "g");
  csvTable.innerHTML = "";

  // create column headers:
  var headerRow = document.createElement("tr");
  let headerCell = document.createElement("th");
  headerRow.appendChild(headerCell);
  headerCell.textContent = "select";
  for (let i=0; i<relevCols.length; i++){
    let ind = relevCols[i];
    let headerCell = document.createElement("th");
    headerCell.textContent = csvHeader[ind];
    if (i%2 === 1){
      let headerText = csvArray[0][relevCols[i-1]].replace(/-ara\d|-per\d|\.completed|\.mARkdown|\.ms\d+|_.+/g, "");
      headerCell.textContent = headerText;
    }
    headerRow.appendChild(headerCell);
  }
  csvTable.appendChild(headerRow);

  // create data rows:
  //csvArray.forEach(function(rowData){
  for (let rowno=0; rowno < csvArray.length; rowno++){
    rowData = csvArray[rowno];
    var filterStr = ""
    var row = document.createElement("tr");
    let cell = document.createElement("td");
    let inp = document.createElement("input");
    // add selection checkbox:
    inp.setAttribute("type", "checkbox");
    inp.checked = true;
    cell.appendChild(inp);
    row.appendChild(cell);
    // add relevant columns:
    //relevCols.forEach(function(i){
    for (let i=0; i < relevCols.length; i++){
      col_offset = relevCols[i];
      let cell = document.createElement("td");
      if (i%2 == 0){
        let ms_id = rowData[col_offset].replace(/.+ms|.+_/g, "ms");
        ms_id = ms_id.replace(/(\d+)-\1/g, "$1");
        cell.textContent = ms_id;
      } else {
        cell.textContent = rowData[col_offset].replace(/-+/g, "");
      }
      filterStr += cell.textContent + "\n";
      row.appendChild(cell);
    //});
    }
    if (rowFilter){
      if (filterStr.match(rowFilter)){
        csvTable.appendChild(row);
      }
    } else {
      csvTable.appendChild(row);
    }
    //csvArray[rowno] = [];  // attempt to limit memory use
  //});
  }
}

function loadCSV() {
  console.log("file received");
  selectRowsControls.style.display="block";
  var fn = this.value;
  //fn = fn.replace(/.*[\/\\]/, ''); // remove the fake path before the filename
  var fr=new FileReader();
  fr.onload=function(){
    console.log("file loaded");

    csvArray = parseCSV(fr.result);
    csvHeader = csvArray.shift();
    if (csvHeader.includes("idDoc1")){
      var idColName = "idDoc";  // for aggregated data
    } else {
      var idColName = "id";     // for non-aggregated data
    }

    relevCols = [0,0,0,0];
    for (i in csvHeader){
      if (csvHeader[i] == idColName+"1"){
        relevCols[0] = i;
      } else if (csvHeader[i] == "s1"){
        relevCols[1] = i;
      } else if (csvHeader[i] == idColName+"2"){
        relevCols[2] = i;
      } else if (csvHeader[i] == "s2"){
        relevCols[3] = i;
      }
    }
    displayCSV();

  }
  fr.readAsText(this.files[0]);
}

function resetOptions(){
  cleanChk.checked = true;
  punctCheck.checked = true;
  normalizeAlifCheck.checked = true;
  normalizeYaCheck.checked = true;
  normalizeHaCheck.checked = true;
  fontSizeInp.value = "16";
  ngramInput.value = "3";
  rowsCheck.checked = false;
  arCharInp.value = "20";
  singleDivCheck.checked = false;
  changeFontSize();
}

function toggleHighlighting(){
  if (highlightDiffBtn.checked){
    document.documentElement.style.setProperty("--bg-col-a", "lightgreen");
    document.documentElement.style.setProperty("--bg-col-b", "lightblue");
    document.documentElement.style.setProperty("--bg-col-c", "transparent");
    let outputIntroText = `
      <p>
        Color coding:
        <span class="removed">only in text A</span>
        <span> - </span>
        <span class="added">only in text B</span>
        <span> - </span>
        <span class="moved">in text A and B but in different position</span>
        <span> - </span>
        (not highlighted: in texts A and B)
      </p>`;
    document.getElementById("outputIntro").innerHTML = outputIntroText;
  } else {
    document.documentElement.style.setProperty("--bg-col-a", "white");
    document.documentElement.style.setProperty("--bg-col-b", "white");
    document.documentElement.style.setProperty("--bg-col-c", "lightblue");
    let outputIntroText = `
      <p>
        Color coding:
        <span class="common">common text in text A and text B</span>
        <span> - </span>
        <span class="moved">in text A and B but in different position</span>
        <span> - </span>
        (not highlighted: different in texts A and B)
      </p>`;
    document.getElementById("outputIntro").innerHTML = outputIntroText;
  }
}

function changeFontSize(){
  let fs = parseInt(fontSizeInp.value);
  document.documentElement.style.setProperty("--ar-chars-font-size", `${fs}px`);
  calcDiffIfVisible();
}

// allow resizing the output container: code from https://jsfiddle.net/RainStudios/mw786v1w/
function initResize(e) {
   window.addEventListener('mousemove', Resize, false);
   window.addEventListener('mouseup', stopResize, false);
}
function Resize(e) {
   resizeCont.style.width = (e.clientX - resizeCont.offsetLeft) + 'px';
}
function stopResize(e) {
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    calcDiffIfVisible();
}

function selectAllRows(){
  let inputs = csvTable.getElementsByTagName("input");
  [...inputs].forEach(function(inp){
    inp.checked = true;
  });
}

function deselectAllRows(){
  let inputs = csvTable.getElementsByTagName("input");
  [...inputs].forEach(function(inp){
    inp.checked = false;
  });
}

function loadSelectedRows(){
  inputData = [];
  let rows = Array.from(csvTable.getElementsByTagName("tr"));
  let header = rows.shift(); // disregard the header
  rows.forEach(function(row){
    let inp = row.getElementsByTagName("input")[0];
    if (inp.checked) {
      a = header.getElementsByTagName("th")[2].textContent;
      a += "."+row.getElementsByTagName("td")[1].textContent;
      b = header.getElementsByTagName("th")[4].textContent;
      b += "."+row.getElementsByTagName("td")[3].textContent;
      inputData.push([a, b]);
      a = row.getElementsByTagName("td")[2].textContent;
      b = row.getElementsByTagName("td")[4].textContent;
      inputData.push([a, b]);
    }
  });
  currentPage = 0;
  currentPageInp.value = 1;
  lastPageSpan.textContent = inputData.length / 2;
  calcDiff();
  uploadModal.style.display = "none";
  paginationDiv.style.display = "block";
}


////////////////////// helper functions for main functions /////////////////////


// count the number of Arabic characters in a string using OpenITI character regex
function charLength(s){
  if (s) {
    return charCount(s, arCharExtRegex);
  } else {
    return 0;
  }
}

function getLineOffsets(s){
  var offsets = [];
  for (let i=0; i<s.length; i++){
    if (s[i] === "\n"){
      offsets.push(i);
    }
  }
  return offsets
}

function displayDiff(aHtml, bHtml){
  // remove empty tags:
  aHtml = aHtml.replace(/<span class="\w+"><\/span>/g, "");
  bHtml = bHtml.replace(/<span class="\w+"><\/span>/g, "");
  // merge neighboring tags of the same class:
  aHtml = aHtml.replace(/(?<=<span class="(\w+)">)([^<]+)<\/span><span class="\1">/g, '$2');
  bHtml = bHtml.replace(/(?<=<span class="(\w+)">)([^<]+)<\/span><span class="\1">/g, '$2');
  let newRow = document.getElementById("outputTable").insertRow(-1);
  let cellA = newRow.insertCell(0);
  cellA.innerHTML = aHtml.replace(/¶/g, "<br>");
  let cellB = newRow.insertCell(1);
  cellB.innerHTML = bHtml.replace(/¶/g, "<br>");
  if (VERBOSE) {console.log("row inserted");}
}

function cleanText(text){
  if (clean) {
    text = text.replace(/\r/g, "");
    text = text.replace(/### \|+ /g, "");
    text = text.replace(/\n# /g, "\n");
    text = text.replace(/^# /g, "\n");
    text = text.replace(/-+/g, "");
    text = text.replace(/\n+~~/g, " ");
    text = text.replace(/~~/g, "");
    text = text.replace(/[\n ]*ms\d+[\n ]*/g, " ");
    text = text.replace(/[\n ]*PageV[^P]+P\d+[a-bA-B]?[\n ]*/g, " ");
    text = text.replace(/[«\(\[/]\d+[»\)\]/]/g, "");
    text = text.replace(/@[a-zA-Z@\d]+/g, "");
  }
  if (normalizeAlif){
    text = text.replace(/[أإآ]/g, "ا");
  }
  if (normalizeYa){
    text = text.replace(/[یى]/g, "ي");
  }
  if (normalizeHa){
    text = text.replace(/ة/g, "ه");
  }
  if (punct) {
    text = text.replace(/[.?!:،,’]/g, "")
  }
  text = text.replace(/^[\r\n ]+|[\r\n ]+$/g, '');
  return text
}

function downloadSvg(){
  domtoimage.toSvg(document.getElementById("outputTable"), { bgcolor: 'white' }).then(dataUrl => {
    downloadFile(dataUrl, "diff.svg");
  });
}

function downloadPng(){
  domtoimage.toPng(document.getElementById("outputTable"), { bgcolor: 'white' }).then(dataUrl => {
    downloadFile(dataUrl, "diff.png");
  });
}

async function downloadAll(fileType){
  var lastPage = parseInt(lastPageSpan.textContent);
  for (let i=0; i < lastPage; i++){
    currentPage = i;
    const r = await calcDiff();
    if (fileType === "png"){
      downloadPng();
    } else if (fileType === "svg") {
      downloadSvg();
    }
  }

  /*(function(next){
    for (let i=0; i < lastPage; i++){
      currentPage = i;
      console.log(currentPage);
      calcDiff();
      next();
    }
  }(function (){
    if (fileType === "png"){
      downloadPng();
    } else if (fileType === "svg") {
      downloadSvg();
    }
  }));*/
}

function downloadAllPng(){
  downloadAll("png");
}

function downloadAllSvg(){
  downloadAll("svg");
}

function downloadFile(dataUrl, fn){
  let link = document.createElement("a");
  link.download = fn;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


function shingle(s, n){
  if (s.length<n) {
    return [];
  }
  let shingles = [];
  for (let i=0; i<(s.length+1)-n; i++){
    shingles.push(s.substring(i,i+n));
  }
  return shingles;
}

//////////////////////// MAIN FUNCTIONS ///////////////////////////////////////

/*function markupHeckelArrays(O, N, OArr, NArr, aHtml, bHtml, n){
  let inDel = false;
  let inCommon = false;
  let usedChars = 0;
  for (let i=0; i<O.length; i++){
    var token = O[i];
    //console.log(i + " token: "+[token]);
    //console.log("usedChars: "+usedChars);
    if (typeof OArr[i] === "string") { // no equivalent found in other string N
      //console.log("= deletion: ")
      // deal with first characters of first n-gram
      if (i === 0){
        let j = 0;
        let commonChars = "";
        while (j<n){
          if (OArr[0][j] === NArr[0][j]) {
            //bHtml += NArr[0][j];
            commonChars += OArr[0][j];
            j++;
            //usedChars = j;
          } else {
            break;
          }
        }
        if (commonChars){
          aHtml += '<span class="common">'+commonChars+'</span>';
          usedChars = j;
        }
      }
      if (! inDel) {
        //console.log("not yet in del section");
        if (i >= n) {
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          if (inCommon){
            aHtml += token.substring(usedChars, n-1)+'</span>';
            inCommon = false;
          } else {
            aHtml += '<span class="common">'+token.substring(usedChars, n-1)+'</span>';
          }
          usedChars = n-1;
        }
        aHtml += '<span class="removed">' ;
        inDel = true;
      }
      if (usedChars == 0) {
        //console.log("Adding first character of ngram to tagged deleted section");
        aHtml += token[0];
      } else {
        usedChars--;
      }
    } else {
      //console.log(" = Common words");
      let j = OArr[i];  // the index of the equivalent token in the other string
      if (inDel) {
        aHtml += '</span><span class="common">' ;
        inDel = false;
        inCommon = true;
      }
      if (! inCommon){
        aHtml += '<span class="common">' ;
        inCommon = true;
      }
      if (usedChars == 0) {
        aHtml += token[0];
      } else {
        usedChars--;
      }
    }
  }
  aHtml += token.substring(1+usedChars,n);
  if (inDel || inCommon) {
    aHtml += '</span>'
  }

  let inAdd = false;
  inCommon = false;
  usedChars = 0;
  for (let i=0; i<N.length; i++){
    var token = N[i];
    console.log(i + " token: "+[token]);
    console.log("usedChars: "+usedChars);
    if (typeof NArr[i] === "string") { // no equivalent found in other string N
      // deal with first characters of first n-gram
      if (i === 0){
        let j = 0;
        let commonChars = "";
        while (j<n){
          if (OArr[0][j] === NArr[0][j]) {
            //bHtml += NArr[0][j];
            commonChars += NArr[0][j];
            j++;
            //usedChars = j;
          } else {
            break;
          }
        }
        if (commonChars){
          bHtml += '<span class="common">'+commonChars+'</span>';
          usedChars = j;
        }
      }
      if (! inAdd) {
        //console.log("not yet in del section");
        if (i >= n) {
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          if (inCommon){
            bHtml += token.substring(usedChars, n-1) + '</span>' ;
            inCommon = false;
          } else {
            bHtml += '<span class="common">'+token.substring(usedChars, n-1)+'</span>';
          }
          usedChars = n-1;
        }
        bHtml += '<span class="added">' ;
        inAdd = true;
      }
      if (usedChars == 0) {
        bHtml += token[0];
      } else {
        usedChars--;
      }
    } else {
      //console.log(" = Common words");
      let j = NArr[i];  // the index of the equivalent token in the other string

      if (! inCommon) {
        //console.log("not yet in del section");
        if (i > n) {
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          if (inAdd){
            bHtml += '</span>' ;
            inAdd = false;
          }
        }
        if (inAdd){
          bHtml += '</span>';
          inAdd = false;
        }
        bHtml += '<span class="common">' ;
        inCommon = true;
      }

      if (usedChars == 0) {
        bHtml += token[0];
      } else {  // characters have already been added to the previous tag!
        usedChars--;
      }
    }
  }
  bHtml += token.substring(1+usedChars,n);
  if (inAdd || inCommon) {
    bHtml += '</span>'
  }
  return [aHtml, bHtml];
}*/

/*
  * Mark up the Heckel array `toksArr` and add it to the `xHtml string`.

  * @param {array} toks: shingled n-gram tokens of the string to be refined.
  * @param {array} toksArr: contains for each n-gram token, its index position in the other Heckel array, or the token itself if it was not found in the other array.
  * @param {array} otherArr: contains for each n-gram token in the other string, its index position in the other Heckel array, or the token itself if it was not found in the other array.
  * @param {string} xHtml: html string to which the marked up string should be appended.
  * @param {number} n: n-gram class
  * @param {string} spanClass: name of the class ("added" / "removed") of the spans to which the parts of the string that differ from the other should be added.
*/
function markupHeckelArray(toks, toksArr, otherArr, xHtml, n, spanClass){
  let inDiff = false;
  let inCommon = false;
  let usedChars = 0;

  for (let i=0; i<toks.length; i++){
    var token = toks[i];
    console.log(i + " token: "+[token]);
    console.log("usedChars: "+usedChars);
    if (typeof toksArr[i] === "string") { // no equivalent found in other string N
      // deal with first characters of first n-gram
      if (i === 0){
        let j = 0;
        let commonChars = "";
        while (j<n){
          if (toksArr[0][j] === otherArr[0][j]) {
            //bHtml += NArr[0][j];
            commonChars += toksArr[0][j];
            j++;
            //usedChars = j;
          } else {
            break;
          }
        }
        if (commonChars){
          xHtml += '<span class="common">'+commonChars+'</span>';
          usedChars = j;
        }
      }
      if (! inDiff) {
        //console.log("not yet in del section");
        if (i >= n-1) {
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          if (inCommon){
            xHtml += token.substring(usedChars, n-1) + '</span>' ;
            inCommon = false;
          } else {
            xHtml += '<span class="common">'+token.substring(usedChars, n-1)+'</span>';
          }
          usedChars = n-1;
        }
        if (inCommon){
          xHtml += '</span>' ;
          inCommon = false;
        }
        xHtml += '<span class="'+spanClass+'">' ;//'<span class="added">' ;
        inDiff = true;
      }
      if (usedChars == 0) {
        xHtml += token[0];
      } else {
        usedChars--;
      }
    } else {
      //console.log(" = Common words");
      if (! inCommon) {
        //console.log("not yet in del section");
        if (i > n) {
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          if (inDiff){
            xHtml += '</span>' ;
            inDiff = false;
          }
        }
        if (inDiff){
          xHtml += '</span>';
          inDiff = false;
        }
        xHtml += '<span class="common">' ;
        inCommon = true;
      }

      if (usedChars == 0) {
        xHtml += token[0];
      } else {  // characters have already been added to the previous tag!
        usedChars--;
      }
    }
  }
  xHtml += token.substring(1+usedChars,n);
  if (inDiff || inCommon) {
    xHtml += '</span>'
  }
  return xHtml;
}

/*
 * Partial implementation of the algorithm described in Heckel 1978, pp. 265f.:
 * in this implementation a list of tokens (can be words, lines, ngrams, ...)
 * is provided for the old (O) and new (N) strings.
 * Moved clusters are not implemented here because they seem unnecessary for post-processing.
 */

function heckel(O, N){
  O = ["START", ...O, "END"];
  N = ["START", ...N, "END"];
  var ST = new Object();  // symbol table
  var OArr = new Array();   // array of Old string
  var NArr = new Array();  // array of New string

  // STEP1: count the number of times each token is in the new string N:
  // populating the NArr array and the NC (new count) value in the symbol table ST:

  for (let i=0; i<N.length; i++){
    let token = N[i];
    NArr.push(token);
    if (!ST.hasOwnProperty(token)) {
      ST[token] = {OC: 0, NC: 0, OLNO: null};
    }
    ST[token].NC += 1;
  }

  // STEP2:count the number of times each token is in the old string O:
  // populating the OArr array and the OC (old count) and OLNO
  // (old number: offset of the token in the old string)
  // values in the symbol table ST:

  for (let i=0; i<O.length; i++){
    let token = O[i];
    OArr.push(token);
    if (!ST.hasOwnProperty(token)) {
      ST[token] = {OC: 0, NC: 0, OLNO: null};
    }
    ST[token].OC += 1;
    ST[token].OLNO = i;
  }

  // STEP3: identify tokens that are only once in both O and N;
  // these will become the anchors for the rest of the algorithm.
  // In OArr and NArr, replace the selected tokens by their position in the other array

  let maxVal = 1;
  for (const token in ST) {
    if (ST[token].OC === 1 && ST[token].NC === 1) {
      OArr[OArr.indexOf(token)] = NArr.indexOf(token)
      NArr[NArr.indexOf(token)] = ST[token].OLNO;
    } else {
      // check how many times the most repeated token is in either of the strings:
      maxVal = Math.max(maxVal, ST[token].OC, ST[token].NC);
    }
  }

  // Steps 4 and 5 only make sense if some tokens are present more than once!
  if (maxVal > 1) {

    // STEP 4: go through the NArr in ascending order and for those items that
    // have been replaced with the index in the other array, check if the next
    // item in both arrays is the same token (that is, a token that is present
    // more than once in at least one of the strings).
    // If so, replace both with the index of that item in the other array:

    for (let i=0; i<NArr.length; i++) {
      let token = NArr[i];
      if (!ST.hasOwnProperty(token)) {
      //if (ST.hasOwnProperty(token)) {
        let j = OArr.indexOf(i);
        // if a following item exists and is not a number, check if it is identical as the following token in OArr:
        if (i+1<NArr.length && (ST.hasOwnProperty(NArr[i+1])) && j+1<OArr.length && (NArr[i+1] === OArr[j+1])) {
          NArr[i+1] = j+1;
          OArr[j+1] = i+1;
         }
      }
    }

    // STEP5: like step 4, but in descending order:

    for (let i=NArr.length; i>=0; i--) {
      let token = NArr[i];
      if (!ST.hasOwnProperty(token)) {
      //if (ST.hasOwnProperty(token)) {
        let j = OArr.indexOf(i);
        // if a preceding item exists and is not a number, check if it is identical as the preceding token in OArr:
        if (i>0 && (ST.hasOwnProperty(NArr[i-1])) && j>0 && (NArr[i-1] === OArr[j-1])) {
          NArr[i-1] = j-1;
          OArr[j-1] = i-1;
         }
      }
    }
  }
  // remove START and END indications:
  OArr = OArr.slice(1, -1);
  NArr = NArr.slice(1, -1);
  // STEP6: piece the string back together, inserting html tags: in separate funtion.

  return [OArr, NArr];
}


// refine the output of the algorithm by using shingled n-grams on
// last added and deleted section
function refine(O, N, aHtml, bHtml, nextChars){
  //console.log("O: '"+O+"'");
  //console.log("N: '"+N+"'");


  if (O.length < refine_n || N.length < refine_n) {
    //console.log("too short?");
    aHtml += '<span class="removed">'+ O +'</span>';
    bHtml += '<span class="added">'+ N +'</span>';
  } else {
    // go through the 6 steps of the algorithm in Heckel 1978, with shingled ngrams:
    //console.log("refining");
    let Oshingles = shingle(O, refine_n);
    let Nshingles = shingle(N, refine_n);
    //console.log("N: "+N);
    //console.log("N shingled: "+Nshingles);
    let [OArr, NArr] = heckel(Oshingles, Nshingles);
    //[aHtml, bHtml] = markupHeckelArrays(Oshingles, Nshingles, OArr, NArr, aHtml, bHtml, refine_n);
    aHtml = markupHeckelArray(Oshingles, OArr, NArr, aHtml, refine_n, "removed");
    bHtml = markupHeckelArray(Nshingles, NArr, OArr, bHtml, refine_n, "added");
  }
  //console.log("aHtml.substring(aHtml.length-5, aHtml.length-1): "+aHtml.substring(aHtml.length-5, aHtml.length-1));

  var aHtmlStripped = aHtml.replace(/<[^>]+>/g, "");
  var bHtmlStripped = bHtml.replace(/<[^>]+>/g, "");
  //console.log("aHtml: "+aHtml);
  //console.log("aHtmlStripped: "+aHtmlStripped);
  var aLastChar = aHtmlStripped.substring(aHtmlStripped.length-1);
  var bLastChar = bHtmlStripped.substring(bHtmlStripped.length-1);
  var aLastChars = aHtmlStripped.substring(aHtmlStripped.length-5);
  var bLastChars = bHtmlStripped.substring(bHtmlStripped.length-5);

  /*console.log("aLastChar: '"+aLastChar+"'; bLastChar: '"+bLastChar+"'");
  console.log("aLastChars: '"+aLastChars+"'; bLastChars: '"+bLastChars+"'");
  console.log("nextChar: '"+nextChars[0]+"'");
  console.log("more than ARCHARS: "+(charLength(aHtml) > ARCHARS || charLength(bHtml) > ARCHARS));
  console.log('nextChars[0] === " ": '+(nextChars && nextChars[0] === " "));
  console.log('aLastChar === " ": '+(aLastChar === " "));
  console.log('bLastChar === " ": '+(bLastChar === " "));*/

  if (intoRows && (charLength(aHtml) > ARCHARS || charLength(bHtml) > ARCHARS)
      //&& aHtml.substring(aHtml.length-2, aHtml.length-1) != " "
      //&& bHtml.substring(bHtml.length-2, bHtml.length-1) != " "
      && ((nextChars && nextChars[0] === " ") || (aLastChar === " " && bLastChar === " " ))){
    //console.log("=>NEW ROW!");
    displayDiff(aHtml, bHtml);
    aHtml = "";
    bHtml = "";
  }
  return [aHtml, bHtml];
}

// parse the wikiEdDiff html into two separate strings
function parseDiffHtml(diffHtml){
  //document.getElementsByClassName("container")[0].innerHTML = "";
  var parser = new DOMParser();
  var wikiHtml = parser.parseFromString(diffHtml, "text/html");
  if (VERBOSE) {console.log(wikiHtml);}
  var rootNode = wikiHtml.getElementsByTagName("pre")[0]
  if (VERBOSE) {console.log(rootNode);}
  var aHtml = "";
  var bHtml = "";
  let pos = 0;
  let pos_changes = {"Old" : "", "New" : ""};

  for (var i = 0; i < rootNode.childNodes.length; i++) {
    var c = rootNode.childNodes[i];

    if (VERBOSE) {console.log(c);}
    if (c.nodeType === Node.TEXT_NODE){
      if (VERBOSE) {console.log("UNMARKED: COMMON TEXT "+c.textContent);}
      //if (intoRows && (charLength(aHtml) > ARCHARS || charLength(bHtml) > ARCHARS) && aHtml.substring(aHtml.length-2, aHtml.length-1) != " " && bHtml.substring(bHtml.length-2, bHtml.length-1) != " "){
        //displayDiff(aHtml, bHtml);

      [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, c.textContent);
      console.log(pos_changes);
      pos_changes = {"Old" : "", "New" : ""};
      aHtml += '<span class="common">' + c.textContent + '</span>';
      bHtml += '<span class="common">' + c.textContent + '</span>';
    } else if (c.classList.contains("wikEdDiffInsert")) {
      if (VERBOSE) {console.log("MARK IN B (INSERTION)");}
      //pos_changes["New"] += c.textContent;
      var children = Array.from(c.childNodes);
      children.forEach(function(child){
        if (child.classList && child.classList.contains("wikEdDiffNewline")){
          pos_changes["New"] += "¶"  // "<br>";
        } else {
          pos_changes["New"] += child.textContent;
        }
      });

      //bHtml += '<span class="added">'+c.textContent+'</span>';
      /*if (c.querySelector(".wikEdDiffNewline") != null){
        bHtml += "<br>"
      }*/
    } else if (c.classList.contains("wikEdDiffDelete")) {
      if (VERBOSE) {console.log("MARK IN A (DELETION) "+c.textContent);}
      //pos_changes["Old"] += c.textContent;
      var children = Array.from(c.childNodes);
      children.forEach(function(child){
        if (child.classList && child.classList.contains("wikEdDiffNewline")){
          pos_changes["Old"] += "¶"  // "<br>";
        } else {
          pos_changes["Old"] += child.textContent;
        }
      });

      //aHtml += '<span class="removed">'+c.textContent+'</span>';
      /*if (c.querySelector(".wikEdDiffNewline") != null){
        aHtml += "<br>"
      }*/
    } else if (c.classList.contains("wikEdDiffBlock")) {
      if (VERBOSE) {console.log("MOVED, B "+c.textContent);}
      if (c.textContent.length > 1){
        //[aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml);
        //pos_changes = {"Old" : "", "New" : ""};
        bHtml += '<span class="moved">'+c.textContent+'</span>';
      } else {
        //bHtml += '<span class="added">'+c.textContent+'</span>';
        pos_changes["New"] += c.textContent;
      }
    } else if (c.classList.contains("wikEdDiffMarkLeft")) {
      if (VERBOSE) {console.log("MOVED, A "+c.getAttribute('title'));}
      if (c.getAttribute('title').length > 1){
        //[aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, nextChars);
        //pos_changes = {"Old" : "", "New" : ""};
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        //aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
        pos_changes["Old"] += c.getAttribute('title');
      }
    } else if (c.classList.contains("wikEdDiffMarkRight")) {
      if (VERBOSE) {console.log("MOVED, A "+c.getAttribute('title'));}
      if (c.getAttribute('title').length > 1){
        //[aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, nextChars);
        //pos_changes = {"Old" : "", "New" : ""};
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        //aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
        pos_changes["Old"] += c.getAttribute('title');
      }
    }
  }
  //console.log("pos_changes at end:");
  //console.log(pos_changes);
  [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, " ");

  // display the difs:
  displayDiff(aHtml, bHtml);
  document.getElementById("cDiff").innerHTML = diffHtml;
  if (singleDiv){
    document.getElementById("outputSingleDiv").style.display = "block";
    document.getElementById("cDiff").style.display = "block";
  } else {
    document.getElementById("outputSingleDiv").style.display = "none";
    document.getElementById("cDiff").style.display = "none";
  }

  if (VERBOSE) {console.log(aHtml);}
  if (VERBOSE) {console.log(bHtml);}
  outputDiv.style.display="block";
  outputIntro.style.display="block";
  outputButtons.style.display="inline-block";
  inputDiv.style.display="none";
  inputIntro.style.display="none";
  inputButtons.style.display="none";
  // create download link:
  /*
  // svg approach: does not work well (not whole table, no highlighting)
  let table = document.getElementById("outputTable").innerHTML;
  let svg = `<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <foreignObject x="10" y="10" width="100" height="150">
    <body xmlns="http://www.w3.org/1999/xhtml">
      ${table}
    </body>
  </foreignObject>
</svg>`
  if (VERBOSE) {console.log(svg);}
  let href = 'data:text/plain;charset=utf-8,'+svg;
  */
  /*
  // png download using html2canvas: does not work well: parts of text missing!
  html2canvas(document.getElementById("outputTable")).then(canvas => {
      let img = canvas.toDataURL("image/png");
      let href =  img.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      let downloadLink = document.getElementById("downloadLink");
      downloadLink.setAttribute('href', href);
      downloadLink.setAttribute("download", "diff.png");
      if (VERBOSE) {console.log(href);}
  });
  */
  // png download using dom-to-image (https://github.com/tsayen/dom-to-image):
  //domtoimage.toPng(document.getElementById("outputTable")).then(dataUrl => {
  //    /*let downloadLink = document.getElementById("pngDownloadLink");
  //    downloadLink.setAttribute('href', dataUrl);
  //    downloadLink.setAttribute("download", "diff.png");*/
  //    //console.log(dataUrl);
  //    let dataUrlHidingPlace = document.getElementById("pngDataUrl");
  //    dataUrlHidingPlace.innerHTML = dataUrl;
  //});
  //domtoimage.toSvg(document.getElementById("outputTable")).then(dataUrl => {
  //    /*let downloadLink = document.getElementById("svgDownloadLink");
  //    downloadLink.setAttribute('href', dataUrl);
  //    downloadLink.setAttribute("download", "diff.svg");*/
  //    //console.log(dataUrl);
  //    let dataUrlHidingPlace = document.getElementById("svgDataUrl");
  //    dataUrlHidingPlace.innerHTML = dataUrl;
  //});

}

async function calcDiff() {
  // empty the existing output table:
  document.getElementById("outputTable").innerHTML = "";

  // load variables from inputs:
  intoRows = rowsChk.checked;
  clean = cleanChk.checked;
  punct = punctCheck.checked;
  normalizeAlif = normalizeAlifCheck.checked;
  normalizeHa = normalizeHaCheck.checked;
  normalizeYa = normalizeYaCheck.checked;
  singleDiv = singleDivCheck.checked;
  refine_n = parseInt(ngramInput.value);
  ARCHARS = parseInt(arCharInp.value);
  //console.log("currentPage: "+currentPage);
  if (inputData.length === 1){
    var toBeDisplayed = [["", ""], inputData[currentPage]];
  } else {
    var toBeDisplayed = [inputData[2*currentPage], inputData[(2*currentPage)+1]]
  }
  for (let i in toBeDisplayed){
    var a = toBeDisplayed[i][0];
    var b = toBeDisplayed[i][1];
    if (i%2 !== 0){
      // clean both strings:
      a = cleanText(a);
      //console.log(a);
      b = cleanText(b);

      // create the diff:
      var wikEdDiff = new WikEdDiff();
      // experiment with special regexes for Arabic words and characters:
      //wikEdDiff.config.regExp.split.word = arTokExtRegex;
      //wikEdDiff.config.regExp.countWords = arTokExtRegex;
      //wikEdDiff.config.regExp.split.character = arCharExtRegex;
      var diffHtml =  wikEdDiff.diff(a, b);
      if (VERBOSE) {console.log(diffHtml);}
      parseDiffHtml(diffHtml);
    } else { //
      displayDiff(a, b);
    }
  }
}
