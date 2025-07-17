/*
Use the kitabDiff algorithm (js/kitabDiff.js) to display a diff of two text fragments.

TO DO: 
* fix the tiff download
* find a solution for svg export: both dom-to-image and 
  html-to-image (https://github.com/bubkoo/html-to-image) embed the html into 
  an svg file using "foreignobject" - the resulting 
  svg file cannot be displayed in graphical software
*/

import { kitabDiff } from "./kitabDiff.js";

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

// test with example of displaced elements that are insterted in the wrong location:

/*var inputA = `وحزرت هذا الكتاب بعد
تأليفي لغالبه وترتيب ما بقي منه بذهني أن يكون أربع مجلدات كبار فاستطلته
وشرعت في اختصاره وحزرت أن يكون نحو نصف أصله`
var inputB = `ثم إني استطلته بعد تسويدي لأكثره وترتيب ما بقي منه بذهني فاختصرته في مقدار نصف الحجم وسمّيت هذا المختصر`
*/

// initialize global variables:

var inputIntro, outputIntro, inputButtons, outputButtons, optionButtons, editOptionButtons,
loadFromTextareaBtn, uploadBtn, editBtn, inputBtn, optionsBtn, editOptionsBtn, svgBtn, pngBtn, tiffBtn, jpegBtn, resetButton, editResetButton,
optionsDiv, editOptionsDiv, inputDiv, outputDiv, outputSingleDiv, loadExampleLnk, resizeCont, clearBtn, highlightDiffBtn, 
highlightCommonBtn, rowsChk, punctCheck, punct,
ngramInput, refine_n, arChars, cleanChk, arCharInp, fontSizeInp, imgWidthInp, imgHeightInp, imgDpiInp, 
normalizeAlifCheck, normalizeYaCheck, normalizeHaCheck, singleDivCheck,
normalizeAlif, normalizeYa, normalizeHa, singleDiv, intoRows, clean, uploadModal, 
editModal, editOutputDiv, colorpicker, colors, editColorDiv, editColor, highlighter, 
closeUploadBtn, closeEditBtn, inputfileBtn, csvTable, rowFilterInp,
csvArray, csvHeader, relevCols, selectRowsControls, selectAllRowsBtn, deselectAllRowsBtn, loadSelectedRowsBtn,
nextPageBtn, prevPageBtn, paginationDiv, currentPageInp, lastPageSpan, downloadAllPngBtn, downloadAllSvgBtn;

var VERBOSE = false;
var inputData = [];
var currentPage = 0;
var defaultImgDpi = 300;
var imgDpi = 300;
var defaultImgWidth = 120;
var imgWidth = 0;
var defaultImgHeight = 180;
var imgHeight = 0;
var defaultFontSize = 20;
const inch = 25.4;



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
  editOptionButtons = document.getElementById("editOptionButtons");

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
  resizer.addEventListener('mousedown', initResize, false);

  loadFromTextareaBtn = document.getElementById("calcDiffButton");
  loadFromTextareaBtn.addEventListener("click", loadFromTextArea);
  uploadModal = document.getElementById("uploadModal");
  uploadBtn = document.getElementById("uploadButton");
  uploadBtn.addEventListener("click", function() {
    uploadModal.style.display = "block";
  });
  closeUploadBtn = document.getElementById("closeUploadBtn");
  closeUploadBtn.addEventListener("click", function() {
    uploadModal.style.display = "none";
  });

  editModal = document.getElementById("editModal");
  editBtn = document.getElementById("editButton");
  editOutputDiv = document.getElementById("editOutputDiv");
  editBtn.addEventListener("click", function() {
    // copy the output table to the edit pane:
    editOutputDiv.innerHTML = outputDiv.innerHTML;
    // replace the classes with the color style:
    let classColors = {
      "common": "white", 
      "removed": "lightblue", 
      "added": "lightgreen", 
      "moved": "PaleGoldenRod"
    };
    let spans = editOutputDiv.getElementsByTagName("span");
    for (const span of spans){
      span.style.backgroundColor = classColors[span.className];
      span.className = "highlighted";
    }
    // make the table resizable: 
    resizer = editOutputDiv.getElementsByClassName("resizer")[0];
    resizer.addEventListener('mousedown', initResize, false);
    // display the modal:
    editModal.style.display = "block";
  });
  closeEditBtn = document.getElementById("closeEditBtn");
  closeEditBtn.addEventListener("click", function() {
    editModal.style.display = "none";
  });
  // configure the color picker for the edit panel:  
  colorpicker = document.getElementById("colorpicker");
  colors = new ColorPicker(colorpicker);
  highlighter = new TextHighlighter(editOutputDiv, {onAfterHighlight: () => postProcessSpans(editOutputDiv)});
  colors.onColorChange(function (color) {
    highlighter.setColor(color);
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

  editOptionsDiv = document.getElementById("editOptions");
  editOptionsBtn = document.getElementById("editOptionsButton");
  editOptionsBtn.addEventListener("click", function(){
    if (editOptionsBtn.value === "Options"){
      editOptionsDiv.style.display = "block";
      editOptionsBtn.value = "Hide options";
      editOptionButtons.style.display = "inline-block";
    } else {
      editOptionsDiv.style.display = "none";
      editOptionsBtn.value = "Options";
      editOptionButtons.style.display = "none";
    }
  });

  /*svgBtn = document.getElementById("svgButton");
  svgBtn.addEventListener("click", downloadSvg);*/
  pngBtn = document.getElementById("pngButton");
  pngBtn.addEventListener("click", downloadPng);
  /*tiffBtn = document.getElementById("tiffButton");
  tiffBtn.addEventListener("click", downloadTiff);*/
  jpegBtn = document.getElementById("jpegButton");
  jpegBtn.addEventListener("click", downloadJpeg);


  resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetOptions);

  editResetButton = document.getElementById("editResetButton");
  editResetButton.addEventListener("click", resetEditOptions);

  highlightDiffBtn = document.getElementById("highlightDiffBtn");
  highlightDiffBtn.addEventListener("click", toggleHighlighting);
  highlightCommonBtn = document.getElementById("highlightCommonBtn");
  highlightCommonBtn.addEventListener("click", toggleHighlighting);
  rowsChk = document.getElementById("rowsCheck");
  rowsChk.addEventListener("change",  calcDiffIfVisible);
  fontSizeInp = document.getElementById("fontSizeInput");
  fontSizeInp.addEventListener("change",  changeFontSize);
  let fs = parseInt(fontSizeInp.value);
  document.documentElement.style.setProperty("--ar-chars-font-size", `${fs}px`);
  imgWidthInp = document.getElementById("imgWidthInput");
  imgWidthInp.addEventListener("change",  changeImgWidth);
  imgHeightInp = document.getElementById("imgHeightInput");
  imgHeightInp.addEventListener("change",  changeImgHeight);
  imgDpiInp = document.getElementById("imgDpiInput");
  imgDpiInp.addEventListener("change",  changeImgDpi);
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
  if (outputDiv.style.display !== "none" && editOutputDiv.style.display === "none"){
    calcDiffIfVisible();
  }
});



//////////////////  Helper functions called by buttons ///////////////////////

/**
 * Move to previous diff (in batch mode)
 */
function prevPage(){
  if (currentPage === 0){
    currentPage = Math.ceil((inputData.length - 1)/2)-1;
  } else {
    currentPage--;
  }
  currentPageInp.value = currentPage+1;
  calcDiff();
}
/**
 * Move to next diff (in batch mode)
 */
function nextPage(){
  if (currentPage+1 === Math.ceil((inputData.length - 1)/2)){
    currentPage = 0;
  } else {
    currentPage++;
  }
  currentPageInp.value = currentPage+1;
  calcDiff();
}
/**
 * Move to specific diff (in batch mode)
 */
function jumpToPage(){
  currentPage = parseInt(currentPageInp.value)-1;
  calcDiff();
}
/**
 * Load both texts from text input
 */
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
/**
 * Calculate the diff if the output pane is not hidden
 */
function calcDiffIfVisible(){
  if (outputDiv.style.display === "block"){
    calcDiff();
  }
}

/**
 * Load sample texts into the text inputs
 */
function loadExample(){
  document.getElementById("inputA").value = inputA;
  document.getElementById("inputB").value = inputB;
}
/**
 * Clear both text inputs
 */
function clear(){
  document.getElementById("inputA").value = "";
  document.getElementById("inputB").value = "";
}

/**
 * Parse uploaded csv file
 * @param {String} r text string loaded from csv/tsv file 
 * @return {Array}   csv parsed as array
 */
function parseCSV(r){
  let csvArray = [];
  // Find out whether the input file is csv or tsv:
  let tabs = (r.match(/\t/g) || []).length;
  let commas = (r.match(/,/g) || []).length;
  //console.log("tabs: "+tabs, "commas: "+commas);
  if (tabs > commas){
    var csvSeparator = new RegExp("\t", "g");
  } else {
    var csvSeparator = new RegExp(",", "g");
  }
  // Parse the csv/tsv file using the relevant delimiter:
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

/**
 * Display input csv file as html so that user can select relevant rows
 */
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
  for (let rowno=0; rowno < csvArray.length; rowno++){
    const rowData = csvArray[rowno];
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
    for (let i=0; i < relevCols.length; i++){
      const col_offset = relevCols[i];
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
    }
    if (rowFilter){
      if (filterStr.match(rowFilter)){
        csvTable.appendChild(row);
      }
    } else {
      csvTable.appendChild(row);
    }
  }
}


/**
 * Upload csv file with input strings
 */
function loadCSV() {
  if (VERBOSE) console.log("file received");
  selectRowsControls.style.display="block";
  var fn = this.value;
  //fn = fn.replace(/.*[\/\\]/, ''); // remove the fake path before the filename
  var fr=new FileReader();
  fr.onload=function(){
    if (VERBOSE) console.log("file loaded");

    csvArray = parseCSV(fr.result);
    csvHeader = csvArray.shift();
    if (VERBOSE) console.log(csvHeader);

    // define ID column name for different srt data inputs:
    if (csvHeader.includes("idDoc1")){
      var idColName = "idDoc";  // for aggregated data
    } else {
      var idColName = "id";     // for non-aggregated data
    }

    relevCols = [0,0,0,0];
    for (let i in csvHeader){
      if (csvHeader[i] == idColName+"1" || csvHeader[i] == idColName){
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

/**
 * Reset all display options to default
 */
function resetOptions(){
  cleanChk.checked = true;
  punctCheck.checked = true;
  normalizeAlifCheck.checked = true;
  normalizeYaCheck.checked = true;
  normalizeHaCheck.checked = true;
  /*fontSizeInp.value = "16";
  imgWidthInp.value = String(defaultImgWidth);
  imgDpiInp.value = String(defaultImgDpi);*/
  ngramInput.value = "3";
  rowsCheck.checked = false;
  arCharInp.value = "20";
  singleDivCheck.checked = false;
  changeFontSize();
}

/**
 * Reset all edit options to default
 */
function resetEditOptions(){
  imgWidthInp.value = String(defaultImgWidth);
  imgHeightInp.value = String(defaultImgHeight);
  imgDpiInp.value = String(defaultImgDpi);
  ngramInput.value = "3";
  changeFontSize();
}

/**
 * Decide to highlight the common or different text
 */
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


/**
 * Change the font size of the diff text
 */
function changeFontSize(){
  let fs = parseInt(fontSizeInp.value);
  if (isNaN(fs)) {
    fs = defaultFontSize;
    fontSizeInp.value = defaultFontSize;
  }
  document.documentElement.style.setProperty("--ar-chars-font-size", `${fs}px`);
  calcDiffIfVisible();
}


/**
 * Change the width of the output image
 */
function changeImgWidth(){
  let w = parseInt(imgWidthInp.value);
  if (isNaN(w)){
    imgWidth = 0;
  } else {
    imgWidth = w;
  }
  if (VERBOSE) console.log("(Maximum) image width set to "+imgWidth);
}

/**
 * Change the (maximum) height of the output image
 */
function changeImgHeight(){
  let h = parseInt(imgHeightInp.value);
  if (isNaN(h)){
    imgHeight = 0;
  } else {
    imgHeight = h;
  }
  if (VERBOSE) console.log("(Maximum) image height set to "+imgHeight);
}

/**
 * Change the image resolution (DPI) of the output image
 */
function changeImgDpi(){
  let d = parseInt(imgDpiInp.value);
  if (!isNaN(d)){
    imgDpi = d;
  } else {
    imgDpi = defaultImgDpi;
  }
  if (VERBOSE) console.log("dpi changed to: "+imgDpi);
}


// allow resizing the output container: 
// code from https://jsfiddle.net/RainStudios/mw786v1w/

/**
 * Make the target element resizable
 * @param {Event} e event
 */
function initResize(e) {
   window.resizeContainer = e.target.parentElement;
   window.addEventListener('mousemove', Resize, false);
   window.addEventListener('mouseup', stopResize, false);
}

/**
 * Change the width of the element
* @param {Event} e event
 */
function Resize(e) {
   if (VERBOSE) {console.log(resizeContainer);}
   if (VERBOSE) {console.log(resizeContainer.style.width);}
   resizeContainer.style.width = (e.clientX - resizeContainer.offsetLeft) + 'px';
   if (VERBOSE) {console.log(resizeContainer.style.width);}
   //resizeCont.style.width = (e.clientX - resizeCont.offsetLeft) + 'px';
}

/**
 * Stop resizing the element
 * @param {Event} e event
 */
function stopResize(e) {
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    //calcDiffIfVisible();
}


/**
 * Select all rows in the batch input screen
 */
function selectAllRows(){
  let inputs = csvTable.getElementsByTagName("input");
  [...inputs].forEach(function(inp){
    inp.checked = true;
  });
}

/**
 * Deselect all rows in the batch input screen
 */
function deselectAllRows(){
  let inputs = csvTable.getElementsByTagName("input");
  [...inputs].forEach(function(inp){
    inp.checked = false;
  });
}

/**
 * Load all selected rows in the batch input screen
 */
function loadSelectedRows(){
  inputData = [];
  let rows = Array.from(csvTable.getElementsByTagName("tr"));
  let header = rows.shift(); // disregard the header
  rows.forEach(function(row){
    let inp = row.getElementsByTagName("input")[0];
    if (inp.checked) {
      let a = header.getElementsByTagName("th")[2].textContent;
      a += "."+row.getElementsByTagName("td")[1].textContent;
      let b = header.getElementsByTagName("th")[4].textContent;
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
  editModal.style.display = "none";
  paginationDiv.style.display = "block";
}


////////////////////// helper functions for main functions /////////////////////

function removeEmptySpans(node) {
  const spans = node.querySelectorAll("span");
  spans.forEach(span => {
    const isEmpty =
      span.childNodes.length === 0 ||
      (span.childNodes.length === 1 &&
        span.firstChild.nodeType === Node.TEXT_NODE &&
        //span.textContent.trim() === '');
        span.textContent === '');

    if (isEmpty) {
      span.remove();
    }
  });
}

/**
 * Flatten the nested spans created by the highlighter
 * @param {Node} rootElement The element in whose descendents we will flatten the nested spans
 */
function flattenNestedSpansWithSameClass(rootElement) {
  function createSpan(text, className, style) {
    const span = document.createElement("span");
    span.className = className;
    if (style) span.setAttribute("style", style);
    span.textContent = text;
    return span;
  }

  function flatten(span, className, style) {
    const result = [];
    let buffer = '';

    span.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
          buffer += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "SPAN") {
        // Flush buffered text before nested span
        if (buffer) {
          result.push(createSpan(buffer, className, style));
        }
        buffer = '';

        // Recursively flatten nested span
        const nested = flatten(child, child.className, child.getAttribute("style"));
        result.push(...nested);
      } else {
        result.push(child);
      }
    });

    // Flush trailing buffer
    if (buffer) {
      result.push(createSpan(buffer, className, style));
    }
    return result;
  }

  function recurse(node) {
      const spans = Array.from(node.querySelectorAll("span"));
      spans.reverse(); // Process deepest spans first

      for (const span of spans) {
      const flatSpans = flatten(span, span.className, span.getAttribute("style"));
      flatSpans.forEach(s => span.parentNode.insertBefore(s, span));
      span.remove();
      }
  }

  recurse(rootElement);
}

/**
 * Merge spans that have the same class and style
 */
function mergeAdjacentSpans(root) {
  function isSameStyle(span1, span2) {
    return (
      span1.className === span2.className &&
      (span1.getAttribute("style") || "") === (span2.getAttribute("style") || "")
    );
  }

  function isIgnorableTextNode(node) {
    //return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
    return node.nodeType === Node.TEXT_NODE && node.textContent === '';
  }

  function getNextMeaningfulSibling(node) {
    let next = node.nextSibling;
    while (next && isIgnorableTextNode(next)) {
      const toRemove = next;
      next = next.nextSibling;
      toRemove.remove(); // Clean whitespace
    }
    return next;
  }

  function mergeSiblingsIn(parent) {
    let child = parent.firstChild;

    while (child) {
      const next = getNextMeaningfulSibling(child);

      if (
        child.nodeType === Node.ELEMENT_NODE &&
        next &&
        next.nodeType === Node.ELEMENT_NODE &&
        child.tagName === "SPAN" &&
        next.tagName === "SPAN" &&
        isSameStyle(child, next)
      ) {
        // Merge next span into current one
        child.textContent += next.textContent;
        next.remove();
        continue; // re-check from the current child
      }

      // Recurse inside element children
      if (child.nodeType === Node.ELEMENT_NODE) {
        mergeSiblingsIn(child);
      }

      child = child.nextSibling;
    }
  }

  mergeSiblingsIn(root);
}

function postProcessSpans(root){
  console.log("post-processing...");
  flattenNestedSpansWithSameClass(root);
  mergeAdjacentSpans(root);
}

/**
 * Add the calculated diff html strings to the output table
 * NB: the splitter "###NEW_ROW###" is sometimes inserted 
 * to allow splitting the diff into fragments that are easier to compare;
 * these will be displayed in separate table rows. 
 *  
 * @param {String} aHtml text A with diff html tags
 * @param {String} bHtml text B with diff html tags
 */
function displayDiff(aHtml, bHtml){
  // split the html strings on the splitter into fragments:
  let aHtmlSplit = aHtml.split("###NEW_ROW###");
  let bHtmlSplit = bHtml.split("###NEW_ROW###");
  // display each fragment in separate table rows for easier comparison: 
  for (let i=0; i<aHtmlSplit.length; i++) {
    let a = aHtmlSplit[i];
    let b = bHtmlSplit[i];
    // add the html to the output:
    let newRow = outputDiv.getElementsByClassName("outputTable")[0].insertRow(-1);
    let cellA = newRow.insertCell(0);
    cellA.innerHTML = a; 
    let cellB = newRow.insertCell(1);
    cellB.innerHTML = b; 
    if (VERBOSE) {console.log("row inserted");}
  }
}

/**
 * Normalize text by removing tags and confusing characters
 * @param {String} text input text
 */
function cleanText(text){
  if (clean) {
    // remove carriage returns:
    text = text.replace(/\r/g, "");
    // remove OpenITI mARkdown structural tags:
    text = text.replace(/### \|+ /g, "");
    text = text.replace(/\n# /g, "\n");
    text = text.replace(/^# /g, "\n");
    text = text.replace(/-+/g, "");
    text = text.replace(/\n+~~/g, " ");
    text = text.replace(/~~/g, "");
    // remove milestone and page number tags:
    text = text.replace(/[\n ]*ms\d+[\n ]*/g, " ");
    text = text.replace(/[\n ]*PageV[^P]+P\d+[a-bA-B]?[\n ]*/g, " ");
    // remove footnote markers:
    text = text.replace(/[«\(\[/]\d+[»\)\]/]/g, "");
    // remove OpenITI mARkdown semantic tags:
    text = text.replace(/@[a-zA-Z@\d]+/g, "");
  }
  if (normalizeAlif){
    // normalize alif+madda/wasla/hamza to simple alif:
    text = text.replace(/[أإآٱ]/g, "ا");
  }
  if (normalizeYa){
    // normalize Persian ya and alif maqsura to Arabic ya:
    text = text.replace(/[یى]/g, "ي");
  }
  if (normalizeHa){
    // normalize ta marbuta to ha:
    text = text.replace(/ة/g, "ه");
  }
  if (punct) {
    // remove punctuation:
    text = text.replace(/[.?!:،,’]/g, "")
  }
  // strip whitespace:
  text = text.replace(/^[\r\n ]+|[\r\n ]+$/g, '');
  return text
}


/**
 * Convert millimeters to pixels
 * @param {Number} mm  measurement in millimeters
 * @param {Number} dpi desired resolution (dots per inch)
 */
function mmToPix(mm, dpi=300){
  return mm * dpi / inch;
}

/**
 * Get measurement of an html element in pixels
 * @param {Node} node            html element
 * @param {String} styleProperty css style property
 * @return {Number}              measurement in pixels
 */
function px(node, styleProperty) {
  // from dom-to-image.js
  var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
  return parseFloat(value.replace('px', ''));
}

/**
 * Get width of an html element in pixels
 * @param {Node} node            html element
 * @return {Number}              measurement in pixels
 */
function getNodeWidth(node) {
  // from dom-to-image.js
  var leftBorder = px(node, 'border-left-width');
  var rightBorder = px(node, 'border-right-width');
  return node.scrollWidth + leftBorder + rightBorder;
  // from ChatGPT:
  //return node.offsetWidth;
}

/**
 * Get width of an html element in pixels
 * @param {Node} node            html element
 * @return {Number}              measurement in pixels
 */
function getNodeHeight(node) {
  // from dom-to-image.js
  var topBorder = px(node, 'border-top-width');
  var bottomBorder = px(node, 'border-bottom-width');
  return node.scrollHeight + topBorder + bottomBorder;
  //return node.offsetHeight;
}

/**
 * Download output table as svg image
 */
async function downloadSvg(){
  //domtoimage.toSvg(document.getElementById("outputTable"), { bgcolor: 'white' }).then(dataUrl => {
  let tableEl = editOutputDiv.getElementsByClassName("outputTable")[0];
  domtoimage.toSvg(tableEl, { bgcolor: 'white' }).then(dataUrl => {
    downloadFile(dataUrl, "diff.svg");
  });
}


/**
 * Download output table as raster image
 * @param {String} outputType Image type (png, tiff, jpeg)
 */
async function downloadRaster(outputType){
  // update the values for the image width and dpi from the Options field:
  changeImgWidth();
  changeImgHeight();
  changeImgDpi();

  if (imgWidth === 0 && imgHeight === 0) {
    if (VERBOSE) console.log("Max image height and width were not set - using defaults to determine output size!")
    imgWidth = defaultImgWidth;
    imgHeight = defaultImgHeight;
    console.log(`Use default output size: imgWidth set to ${imgWidth}, imgHeight to ${imgHeight}`);
  }

  // get the current width and height of the table, in pixels:
  //let tableEl = editOutputDiv.getElementsByClassName("outputTable")[0]
  let tableEl
  if (editModal.style.display == "block") {
    tableEl = editOutputDiv.getElementsByClassName("outputTable")[0]
  } else {
    tableEl = outputDiv.getElementsByClassName("outputTable")[0]
  }
  let nodeWidth = getNodeWidth(tableEl);
  let nodeHeight = getNodeHeight(tableEl);
  console.log("Original image size: "+nodeWidth+" x "+nodeHeight+" px");

  // calculate the output width and height, in pixels:
  let outputPixelWidth = mmToPix(imgWidth, imgDpi);
  let outputPixelHeight = mmToPix(imgHeight, imgDpi);
  if (VERBOSE) console.log(`Max output width: ${outputPixelWidth} px; Max output height: ${outputPixelHeight} px; `)

  // check if the output pixel height would be larger than the maximum allowed pixel height:
  let scaleFactor = 1;
  if (imgHeight === 0) {
    if (VERBOSE) console.log("Max image height was not set - using image width to determine output size!")
    scaleFactor = outputPixelWidth / nodeWidth;
  } else if (imgWidth === 0){
    if (VERBOSE) console.log("Max image width was not set - using image height to determine output size!")
    scaleFactor = outputPixelHeight / nodeHeight;
  } else {
    if (VERBOSE) console.log("Max image width and height set - check which one does not violate the other!")
    let widthScaleFactor = outputPixelWidth / nodeWidth;
    let theoreticalOutputHeight = nodeHeight * widthScaleFactor;
    if (VERBOSE) console.log(`taking width as base: output file will be ${outputPixelWidth} x ${theoreticalOutputHeight} px`);
    if (theoreticalOutputHeight <= outputPixelHeight) {
      if (VERBOSE) console.log("-> this is within the bounds of the maximum output size, so we'll use this factor: " + widthScaleFactor); 
      scaleFactor = widthScaleFactor;
    } else {
      if (VERBOSE) console.log("-> this is larger than the maximum output height!"); 
      let heightScaleFactor = outputPixelHeight / nodeHeight;
      let theoreticalOutputWidth = nodeWidth * heightScaleFactor;
      if (VERBOSE) console.log(`taking height as base: output file will be ${theoreticalOutputWidth} x ${outputPixelHeight} px`);
      if (theoreticalOutputWidth <= outputPixelHeight) {
        if (VERBOSE) console.log("-> this is within the bounds of the maximum output size, so we'll use this factor: " + heightScaleFactor); 
        scaleFactor = heightScaleFactor;
      } else {
        console.log("Error: neither width nor height result in an acceptable factor");
      }
    }
  }
  
  console.log(`Output image size: ${Math.ceil(nodeWidth*scaleFactor)} x ${Math.ceil(nodeHeight*scaleFactor)} px`);

  if (outputType==="png"){
    console.log("Downloading png file");
    // using snapdom's download function
    await snapdom.download(tableEl, {
        format: "png",
        name: "diff",
        scale: scaleFactor,
        embedFonts: true
      }
    );
  } else if (outputType==="jpeg"){
    console.log("Downloading jpeg file");
    // using snapdom's download function
    await snapdom.download(tableEl, {
        format: "jpg",
        name: "diff",
        scale: scaleFactor,
        embedFonts: true
      }
    );
  } else if (outputType==="tiff"){
    console.log("Tiff output is currently not working");
    /*// THIS IS NOT CURRENTLY WORKING! Uses https://github.com/motiz88/canvas-to-tiff
    //   CanvasToTIFF.toObjectURL is not returning anything...
    console.log("Downloading tiff");
    //CanvasToTIFF.toObjectURL(document.getElementById("outputTable"),
    CanvasToTIFF.toObjectURL(tableEl,
                           function(dataUrl) {
                             console.log("Really downloading tiff now");
                             downloadFile(dataUrl, "diff.tiff");
                             console.log("Tiff downloaded");
                           },
                           options);*/
  }
}

/**
 * Download output table as png image
 */
async function downloadPng(){
  downloadRaster("png");
}

/**
 * Download output table as tiff image
 */
async function downloadTiff(){
  downloadRaster("tiff");
}

/**
 * Download output table as jpeg image
 */
async function downloadJpeg(){
  downloadRaster("jpeg");
}

/**
 * Download all output tables  as image files (in batch mode)
 * @param {String} fileType type of output image file (png, svg, tiff)
 */
async function downloadAll(fileType){
  var lastPage = parseInt(lastPageSpan.textContent);
  for (let i=0; i < lastPage; i++){
    currentPage = i;
    const r = await calcDiff();
    if (fileType === "png"){
      await downloadPng();
      console.log('wait one second');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    } else if (fileType === "svg") {
      await downloadSvg();
      console.log('wait one second');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    } else if (fileType === "tiff") {
      await downloadTiff();
      console.log('wait one second');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Download all output tables  as png images (in batch mode)
 */
async function downloadAllPng(){
  downloadAll("png");
}

/**
 * Download all output tables  as svg images (in batch mode)
 */
async function downloadAllSvg(){
  downloadAll("svg");
}

/**
 * Download image data url as file
 * @param {String} dataUrl image encoded as data url
 * @param {String} fn      filename of the output image file 
 */
function downloadFile(dataUrl, fn){
  let link = document.createElement("a");
  link.download = fn;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // free up memory by deleting the link after the click:
  // delete link;  // this does not work in strict mode, see https://webtips.dev/solutions/fix-delete-of-an-unqualified-identifier-errors?utm_content=cmp-true
  link = null; 
}



//////////////////////// MAIN FUNCTION ///////////////////////////////////////

/** 
 * Calculate the diff between two input texts and display it
 */
async function calcDiff() {
  // empty the existing output table:
  //document.getElementById("outputTable").innerHTML = "";
  outputDiv.getElementsByClassName("outputTable")[0].innerHTML = "";

  // load variables from inputs:
  intoRows = rowsChk.checked;
  clean = cleanChk.checked;
  punct = punctCheck.checked;
  normalizeAlif = normalizeAlifCheck.checked;
  normalizeHa = normalizeHaCheck.checked;
  normalizeYa = normalizeYaCheck.checked;
  singleDiv = singleDivCheck.checked;
  refine_n = parseInt(ngramInput.value);
  arChars = parseInt(arCharInp.value);

  //update the image width and font size from the options:
  changeImgWidth();

  // Enable both batch display and single pair display:
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
      b = cleanText(b);

      // let [aHtml, bHtml] = 
      let resp = await kitabDiff(a, b, intoRows=intoRows, arChars=arChars, refine_n=refine_n);
      let [diffHtml, aHtml, bHtml] = resp;

      // insert the diffs in the output elements:
      displayDiff(aHtml, bHtml);

      // make sure the relevant elements are displayed:
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

    } else { //
      displayDiff(a, b);
    }
  }
}
