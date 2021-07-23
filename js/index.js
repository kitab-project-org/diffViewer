/*

Diffcheck implementation based on Wikipedia's diff checking algorithm.
Wikipedia displays the diff of both texts in a single composite text;
this tool takes the output of Wikipedia's algorithm and displays it in two
separate fields.

TO DO:
* find a way to archive the output
* further testing + customization
* implement options:
  - keep new line characters?

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

/*var inputA = "الي النهروان يوم السبت فاقام به ثمانية ايام"
var inputB = "الي النهروان وذلك يوم السبت فاقام فيه ثمانية ايام"*/

// initialize global variables:

var inputIntro, outputIntro, inputButtons, outputButtons, optionButtons,
calcDiffBtn, inputBtn, optionsBtn, svgBtn, pngBtn, resetButton,
optionsDiv, inputDiv, outputDiv, outputSingleDiv, loadExampleLnk, resizeCont, clearBtn, rowsChk, punctCheck, punct,
ngramInput, refine_n, cleanChk, arCharInp, fontSizeInp, normalizeAlifCheck, normalizeYaCheck, normalizeHaCheck, singleDivCheck,
normalizeAlif, normalizeYa, normalizeHa, singleDiv, intoRows, clean;

var VERBOSE = true;

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

  calcDiffBtn = document.getElementById("calcDiffButton");
  calcDiffBtn.addEventListener("click", calcDiff);

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
  rowsChk = document.getElementById("rowsCheck");
  rowsChk.addEventListener("change",  calcDiffIfVisible);
  fontSizeInp = document.getElementById("fontSizeInput");
  fontSizeInp.addEventListener("change",  changeFontSize);
  arCharInp = document.getElementById("arCharInput");
  arCharInp.addEventListener("change",  calcDiffIfVisible);
  cleanChk = document.getElementById("cleanCheck");
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
});

window.addEventListener('resize', function(){
  if (outputDiv.style.display !== "none"){
    calcDiffIfVisible();
  }
});



//////////////////  Helper functions called by buttons ///////////////////////

function calcDiffIfVisible(){
  if (outputDiv.style.display === "block"){
    console.log([outputDiv.style]);
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
  calcDiffIfVisible();
}

function changeFontSize(){
  let fs = parseInt(fontSizeInp.value);
  document.documentElement.style.setProperty("--ar-chars-font-size", `${fs}px`);
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
  let newRow = document.getElementById("outputTable").insertRow(-1);
  let cellA = newRow.insertCell(0);
  cellA.innerHTML = aHtml;
  let cellB = newRow.insertCell(1);
  cellB.innerHTML = bHtml;
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
  let dataUrl = document.getElementById("svgDataUrl").innerHTML;
  downloadFile(dataUrl, "diff.svg");
}

function downloadPng(){
  let dataUrl = document.getElementById("pngDataUrl").innerHTML;
  downloadFile(dataUrl, "diff.png");
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

function markupHeckelArrays(O, N, OArr, NArr, aHtml, bHtml, n){
  let inDel = false;
  let usedChars = 0;
  for (let i=0; i<O.length; i++){
    var token = O[i];
    //console.log(i + " token: "+[token]);
    //console.log("usedChars: "+usedChars);
    if (typeof OArr[i] === "string") { // no equivalent found in other string N
      //console.log("= deletion: ")
      if (! inDel) {
        //console.log("not yet in del section");
        if (i > n) {
          aHtml += token.substring(usedChars, n-1) + '<span class="removed">' ;
          //console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          usedChars = n-1;
        } else {
          aHtml += '<span class="removed">' ;
        }
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
        aHtml += '</span>' ;
        inDel = false;
      }
      if (usedChars == 0) {
        aHtml += token[0];
      } else {
        usedChars--;
      }
    }
  }
  aHtml += token.substring(1+usedChars,n);
  if (inDel) {
    aHtml += '</span>'
  }

  let inAdd = false;
  usedChars = 0;
  for (let i=0; i<N.length; i++){
    var token = N[i];
    console.log(i + " token: "+[token]);
    console.log("usedChars: "+usedChars);
    if (typeof NArr[i] === "string") { // no equivalent found in other string N
      if (! inAdd) {
        console.log("not yet in del section");
        if (i > n) {
          bHtml += token.substring(usedChars, n-1) + '<span class="added">' ;
          console.log("Adding these character before new tag: "+token.substring(usedChars, n-1))
          usedChars = n-1;
        } else {
          bHtml += '<span class="added">' ;
        }
        inAdd = true;
      }
      if (usedChars == 0) {
        bHtml += token[0];
      } else {
        usedChars--;
      }
    } else {
      console.log(" = Common words");
      let j = NArr[i];  // the index of the equivalent token in the other string
      if (inAdd) {
        bHtml += '</span>' ;
        inAdd = false;
      }
      if (usedChars == 0) {
        bHtml += token[0];
      } else {
        usedChars--;
      }
    }
  }
  bHtml += token.substring(1+usedChars,n);
  if (inAdd) {
    bHtml += '</span>'
  }
  return [aHtml, bHtml];
}

/*
 * Partial implementation of the algorithm described in Heckel 1978, pp. 265f.:
 * in this implementation a list of tokens (can be words, lines, ngrams, ...)
 * is provided for the old (O) and new (N) strings.
 * If lists shingled character ngrams are provided, provide the n of the ngram.
 * Moved clusters are not implemented here because they seem unnecessary for post-processing.
 *
 */

function heckel(O, N){
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

  // STEP2:count the number of times each token is in the new string N:
  // populating the OArr array and the OC (old count) and OLNO (old number)
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
  // these will become the anchors for the rest of the Algorithm.
  // In OArr and NArr, replace the selected tokens by their position in the other array

  let maxVal = 1;
  for (const token in ST) {
    if (ST[token].OC === 1 && ST[token].NC === 1) {
      OArr[OArr.indexOf(token)] = NArr.indexOf(token)
      NArr[NArr.indexOf(token)] = ST[token].OLNO;
    } else {
      maxVal = Math.max(maxVal, ST[token].OC, ST[token].NC);
    }
  }

  // Steps 4 and 5 only make sense if some tokens are present more than once!
  if (maxVal > 1) {

    // STEP 4: go through the NArr in ascending order and for those items that
    // have been replaced with the index in the other array, check if the next
    // item in both arrays is the same token (that is, an token that is present
    // more than once in at least one of the strings).
    // If so, replace both with the index of that item in the other array:

    for (let i=0; i<NArr.length; i++) {
      let token = NArr[i];
      if (!ST.hasOwnProperty(token)) {
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
        let j = OArr.indexOf(i);
        // if a preceding item exists and is not a number, check if it is identical as the preceding token in OArr:
        if (i>0 && (ST.hasOwnProperty(NArr[i-1])) && j>0 && (NArr[i-1] === OArr[j-1])) {
          NArr[i-1] = j-1;
          OArr[j-1] = i-1;
         }
      }
    }
  }

  // STEP6: piece the string back together, inserting html tags: in separate funtion.

  return [OArr, NArr];
}


// refine the output of the algorithm by using shingled n-grams on
// last added and deleted section
function refine(O, N, aHtml, bHtml){
  if (O.length < refine_n || N.length < refine_n) {
    console.log("too short?");
    console.log(O);
    console.log(N);
    aHtml += '<span class="removed">'+ O +'</span>';
    bHtml += '<span class="added">'+ N +'</span>';
  } else {
    // go through the 6 steps of the algorithm in Heckel 1978, with shingled ngrams:
    console.log("refining");
    let Oshingles = shingle(O, refine_n);
    let Nshingles = shingle(N, refine_n);
    let [OArr, NArr] = heckel(Oshingles, Nshingles);
    [aHtml, bHtml] = markupHeckelArrays(Oshingles, Nshingles, OArr, NArr, aHtml, bHtml, refine_n);
  }
  if (intoRows && (charLength(aHtml) > ARCHARS || charLength(bHtml) > ARCHARS) && aHtml.substring(aHtml.length-2, aHtml.length-1) != " " && bHtml.substring(bHtml.length-2, bHtml.length-1) != " "){
    displayDiff(aHtml, bHtml);
    aHtml = "";
    bHtml = "";
  }
  return [aHtml, bHtml];
}

// parse the wikiEdDiff html into two separate strings
function parseDiffHtml(diffHtml){
  //document.getElementsByClassName("container")[0].innerHTML = "";
  document.getElementById("outputTable").innerHTML = "";
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
      [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml);
      pos_changes = {"Old" : "", "New" : ""};
      aHtml += c.textContent;
      bHtml += c.textContent;
    } else if (c.classList.contains("wikEdDiffInsert")) {
      if (VERBOSE) {console.log("MARK IN B (INSERTION)");}
      pos_changes["New"] += c.textContent;
      //bHtml += '<span class="added">'+c.textContent+'</span>';
      /*if (c.querySelector(".wikEdDiffNewline") != null){
        bHtml += "<br>"
      }*/
    } else if (c.classList.contains("wikEdDiffDelete")) {
      if (VERBOSE) {console.log("MARK IN A (DELETION) "+c.textContent);}
      pos_changes["Old"] += c.textContent;
      //aHtml += '<span class="removed">'+c.textContent+'</span>';
      /*if (c.querySelector(".wikEdDiffNewline") != null){
        aHtml += "<br>"
      }*/
    } else if (c.classList.contains("wikEdDiffBlock")) {
      if (VERBOSE) {console.log("MOVED, B "+c.textContent);}
      if (c.textContent.length > 1){
        [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml);
        pos_changes = {"Old" : "", "New" : ""};
        bHtml += '<span class="moved">'+c.textContent+'</span>';
      } else {
        //bHtml += '<span class="added">'+c.textContent+'</span>';
        pos_changes["New"] += c.textContent;
      }
    } else if (c.classList.contains("wikEdDiffMarkLeft")) {
      if (VERBOSE) {console.log("MOVED, A "+c.getAttribute('title'));}
      if (c.getAttribute('title').length > 1){
        [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml);
        pos_changes = {"Old" : "", "New" : ""};
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        //aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
        pos_changes["Old"] += c.getAttribute('title');
      }
    } else if (c.classList.contains("wikEdDiffMarkRight")) {
      if (VERBOSE) {console.log("MOVED, A "+c.getAttribute('title'));}
      if (c.getAttribute('title').length > 1){
        [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml);
        pos_changes = {"Old" : "", "New" : ""};
        aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
      } else {
        //aHtml += '<span class="removed">'+c.getAttribute('title')+'</span>';
        pos_changes["Old"] += c.getAttribute('title');
      }
    }
  }

  // display the difs:
  displayDiff(aHtml, bHtml);
  document.getElementById("cDiff").innerHTML = diffHtml;
  if (singleDiv){
    document.getElementById("cDiff").style.display = "block";
  } else {
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
  domtoimage.toPng(document.getElementById("outputTable")).then(dataUrl => {
      /*let downloadLink = document.getElementById("pngDownloadLink");
      downloadLink.setAttribute('href', dataUrl);
      downloadLink.setAttribute("download", "diff.png");*/
      //console.log(dataUrl);
      let dataUrlHidingPlace = document.getElementById("pngDataUrl");
      dataUrlHidingPlace.innerHTML = dataUrl;
  });
  domtoimage.toSvg(document.getElementById("outputTable")).then(dataUrl => {
      /*let downloadLink = document.getElementById("svgDownloadLink");
      downloadLink.setAttribute('href', dataUrl);
      downloadLink.setAttribute("download", "diff.svg");*/
      //console.log(dataUrl);
      let dataUrlHidingPlace = document.getElementById("svgDataUrl");
      dataUrlHidingPlace.innerHTML = dataUrl;
  });

}

function calcDiff() {
  // load variables from inputs:
  var a = document.getElementById("inputA").value;
  var b = document.getElementById("inputB").value;
  intoRows = rowsChk.checked;
  clean = cleanChk.checked;
  punct = punctCheck.checked;
  normalizeAlif = normalizeAlifCheck.checked;
  normalizeHa = normalizeHaCheck.checked;
  normalizeYa = normalizeYaCheck.checked;
  singleDiv = singleDivCheck.checked;
  refine_n = parseInt(ngramInput.value);
  ARCHARS = parseInt(arCharInp.value);
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

  // clean both strings:
  a = cleanText(a);
  console.log([a]);
  b = cleanText(b);


  // create the diff:
  var wikEdDiff = new WikEdDiff();
  // experiment with special regexes for Arabic words and characters:
  wikEdDiff.config.regExp.split.word = arTokExtRegex;
  wikEdDiff.config.regExp.countWords = arTokExtRegex;
  //wikEdDiff.config.regExp.split.character = arCharExtRegex;
  var diffHtml =  wikEdDiff.diff(a, b);
  if (VERBOSE) {console.log(diffHtml);}
  parseDiffHtml(diffHtml);
}
