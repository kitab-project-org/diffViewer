/*
Diffcheck implementation based on Wikipedia's diff checking algorithm.
Wikipedia displays the diff of both texts in a single composite text;
this tool takes the output of Wikipedia's algorithm and displays it in two
separate fields and then refines the diff using the Heckel algorithm 
to make it work better with Arabic pre- and suffixes.

Usage: 

```
import { kitabDiff} from "./kitabDiff.js"

// simple: create two html strings detailing the differences between two strings 
let [wikEdDiffHtml, aHtml, bHtml] = await kitabDiff(strA, strB, refine_n=3);
// NB: wikEdDiffHtml is the original (single-string) output of the WikEdDiff algorithm;
// aHtml and bHtml are versions of the input strings in which differences are marked with HTML tags


// advanced: split aHtml and bHtml into rows for better readability:
let [wikEdDiffHtml, aHtml, bHtml] = await kitabDiff(strA, strB, intoRows=true, arChars=20, refine_n=3);
// NB: arChars defines how many Arabic characters the two strings must have in common
//     before a line of text can be broken into two rows.
let aHtmlSplit = aHtml.split("###NEW_ROW###");
let bHtmlSplit = bHtml.split("###NEW_ROW###");
for (let i=0; i<aHtmlSplit.length; i++) {
  let a = aHtmlSplit[i];
  let b = bHtmlSplit[i];
  // add the html to the output:
  let newRow = document.getElementById("outputTable").insertRow(-1);
  let cellA = newRow.insertCell(0);
  cellA.innerHTML = a; //aHtml;
  let cellB = newRow.insertCell(1);
  cellB.innerHTML = b; //bHtml;
  }
}
```

TO DO:
* further testing + customization
* implement moved sections in the refine function

See:
* description of the Wikipedia algorithm: https://en.wikipedia.org/wiki/User:Cacycle/diff
* online test instance of the Wikipedia diff tool: http://cacycle.altervista.org/wikEd-diff-tool.html
* javascript code of the Wikipedia diff tool: https://en.wikipedia.org/w/index.php?title=User:Cacycle/diff.js&action=raw&ctype=text/javascript
*/


export { kitabDiff };
import { WikEdDiff } from "./wikEdDiff.js";
import { countChars, arCharExtRegex, arTokExtRegex } from "./openITI.js";

const VERBOSE = false;

/**
 * count the number of Arabic characters in a string using OpenITI character regex
 * @param {String} s input string
 * @return {Number}  number of characters
 */
function countArChars(s){
  if (s) {
    return countChars(s, arCharExtRegex);
  } else {
    return 0;
  }
}

/**
 * Clean the diff html string by removing empty tags and merging neighbouring tags of the same class
 * @param {String} s input string
 * @return {String}  cleaned string
 */
function cleanDiffHtml(s) {
    // remove empty tags:
    s = s.replace(/<span class="\w+"><\/span>/g, "");
    // merge neighboring tags of the same class:
    s = s.replace(/(?<=<span class="(\w+)">)([^<]+)<\/span><span class="\1">/g, '$2');
    // Replace line ending placeholders with <br> tags:
    s = s.replace(/¶/g, "<br>");
    return s;
  }


/**
 * Convert string into array of overlapping n-grams
 * @param {String} s input string
 * @param {Number} n number of tokens in each n-gram
 * @return {Array}   array of ngrams
 */
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


/**
 * Partial implementation of the algorithm described in Heckel 1978, pp. 265f.:
 * in this implementation a list of tokens (can be words, lines, ngrams, ...)
 * is provided for the old (O) and new (N) strings.
 * Moved clusters are not implemented here because they seem unnecessary for post-processing.
 * @param {Array} O Array of tokens for the old string
 * @param {Array} N Array of tokens for the new string 
 * @return {Array}  Array of Arrays (one for the old string, one for the new)
 */
function heckel(O, N){
    var ST = new Object();    // symbol table
    var OArr = new Array();   // array of Old string
    var NArr = new Array();   // array of New string
  
    // add "START" and "END" markers to both arrays:
    O = ["START", ...O, "END"];
    N = ["START", ...N, "END"];
  
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


/**
 * Mark up the Heckel array `toksArr` and add it to the `xHtml string`.
 * @param {Array} toks:       shingled n-gram tokens of the string to be refined.
 * @param {Array} toksArr:    contains for each n-gram token, its index position in the other Heckel array, or the token itself if it was not found in the other array.
 * @param {Array} otherArr:   contains for each n-gram token in the other string, its index position in the other Heckel array, or the token itself if it was not found in the other array.
 * @param {String} xHtml:     html string to which the marked up string should be appended.
 * @param {Number} n:         n-gram class
 * @param {String} spanClass: name of the class ("added" / "removed") of the spans to which the parts of the string that differ from the other should be added.
 * @return {String}           xHtml string to which the new tokens are appended
 */
function markupHeckelArray(toks, toksArr, otherArr, xHtml, n, spanClass){
    let inDiff = false;
    let inCommon = false;
    let usedChars = 0;
  
    for (let i=0; i<toks.length; i++){
      var token = toks[i];
      if (VERBOSE) {console.log(i + " token: "+[token]);}
      if (VERBOSE) {console.log("usedChars: "+usedChars);}
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
  
  
  


/**
 * refine the output of the WikEdDiff algorithm by using shingled n-grams on
 * last added and deleted section
 * @param {Array} O          Array of tokens for the old string
 * @param {Array} N          Array of tokens for the new string
 * @param {String} aHtml     text A with diff html tags
 * @param {String} bHtml     text B with diff html tags
 * @param {String} nextChars text content of the following html element
 * @param {Boolean} intoRows if true, the diff text will be divided into rows for easier comparison
 * @param {Int} arChars      Minimum number of shared characters per line before starting new row
 * @param {Number} refine_n:  N-grams to use for refining the wikEdDiff output. Default: 3 (that is, use character trigrams)
 * @return {Array}           Array containing 2 html strings (aHtml and bHtml)
 */
function refine(O, N, aHtml, bHtml, nextChars, intoRows, arChars, refine_n){
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
    var aLastChar = aHtmlStripped.substring(aHtmlStripped.length-1);
    var bLastChar = bHtmlStripped.substring(bHtmlStripped.length-1);

    // Add a splitter to make comparing texts easier:
    if (intoRows && (countArChars(aHtml) > arChars || countArChars(bHtml) > arChars)
        //&& aHtml.substring(aHtml.length-2, aHtml.length-1) != " "
        //&& bHtml.substring(bHtml.length-2, bHtml.length-1) != " "
        && ((nextChars && nextChars[0] === " ") || (aLastChar === " " && bLastChar === " " ))){
      //console.log("=>NEW ROW!");
      aHtml += "###NEW_ROW###";  // aHtml string can be split later and each section put into a new row in a table
      bHtml += "###NEW_ROW###";  // bHtml string can be split later and each section put into a new row in a table
    }

    return [aHtml, bHtml];
  }


/**
 * parse the wikiEdDiff html into two separate strings
 * @param {String} diffHtml:  output of the wikEdDiff algorithm
 * @param {Boolean} intoRows: if true, the diff text will be divided into rows for easier comparison
 * @param {Number} arChars:   Minimum number of shared characters per line before starting new row
 * @param {Number} refine_n:  N-grams to use for refining the wikEdDiff output. Default: 3 (that is, use character trigrams)
 * @return {Array}            (aHtml, bHtml: both texts marked up with span tags)
*/
function parseDiffHtml(diffHtml, intoRows, arChars, refine_n){
    var aHtml = "";
    var bHtml = "";
    let pos_changes = {"Old" : "", "New" : ""};
  
    // Parse the html string and find its root node:
    var parser = new DOMParser();
    var wikiHtml = parser.parseFromString(diffHtml, "text/html");
    if (VERBOSE) {console.log(wikiHtml);}
    var rootNode = wikiHtml.getElementsByTagName("pre")[0]
    if (VERBOSE) {console.log(rootNode);}
  
    // loop through all the child nodes 
    // and add their text content to text A and/or text B
    // depending on the class:
    for (var i = 0; i < rootNode.childNodes.length; i++) {
      var c = rootNode.childNodes[i];
  
      if (VERBOSE) {console.log(c);}
      if (c.nodeType === Node.TEXT_NODE){  
        // unmarked text => substring present in both A and B
  
        if (VERBOSE) {console.log("UNMARKED: COMMON TEXT "+c.textContent);}
  
        // finalize the changes recorded in the pos_changes dictionary:
        // refine the WikEdDiff output for those changes and add them to the aHtml and bHtml strings:
        if (VERBOSE) {console.log(pos_changes);}
        [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, c.textContent, intoRows, arChars, refine_n);
  
        // reset the pos_changes dictionary:
        pos_changes = {"Old" : "", "New" : ""};
  
        // add the common text to both xHtml strings:
        aHtml += '<span class="common">' + c.textContent + '</span>';
        bHtml += '<span class="common">' + c.textContent + '</span>';
  
      } else if (c.classList.contains("wikEdDiffInsert")) { 
        // => substring only present in text B ("Inserted" in B)
  
        if (VERBOSE) {console.log("MARK IN B (INSERTION)");}
  
        // Add the text content of all child nodes to the list of changes in the new text (text B):
        var children = Array.from(c.childNodes);
        children.forEach(function(child){
          if (child.classList && child.classList.contains("wikEdDiffNewline")){
            pos_changes["New"] += "¶"  // "<br>";
          } else {
            pos_changes["New"] += child.textContent;
          }
        });
  
      } else if (c.classList.contains("wikEdDiffDelete")) {  
        // =>  substring only present in text A ("Deleted" in B)
  
        if (VERBOSE) {console.log("MARK IN A (DELETION) "+c.textContent);}
  
        // Add the text content of all child nodes to the list of changes in the old text (text A):
        var children = Array.from(c.childNodes);
        children.forEach(function(child){
          if (child.classList && child.classList.contains("wikEdDiffNewline")){
            pos_changes["Old"] += "¶"  // "<br>";
          } else {
            pos_changes["Old"] += child.textContent;
          }
        });
  
      } else if (c.classList.contains("wikEdDiffBlock")) {  
        // =>  position in text B of a text block that is in both texts but in a different location
  
        if (VERBOSE) {console.log("MOVED, B "+c.textContent);}
  
        if (c.textContent.length > 1){
          // finalize the changes recorded in the pos_changes dictionary:
          // refine the WikEdDiff output for those changes and add them to the aHtml and bHtml strings:
          [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, c.textContent, intoRows, arChars, refine_n);
          // reset the pos_changes dictionary:
          pos_changes = {"Old" : "", "New" : ""};
          bHtml += '<span class="moved">'+c.textContent+'</span>';
        }
  
      } else if (c.classList.contains("wikEdDiffMarkRight") || c.classList.contains("wikEdDiffMarkLeft")) { 
        // =>  position in text A of a text block that is in both texts but in a different location
  
        if (VERBOSE) {console.log("MOVED, A "+c.getAttribute('title'));}
        
        // in this case, the text content is not enclosed as a child in the node 
        // but in the title attribute of the node:
        if (c.getAttribute('title').length > 1){ 
          // finalize the changes recorded in the pos_changes dictionary:
          // refine the WikEdDiff output for those changes and add them to the aHtml and bHtml strings:
          [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, c.getAttribute('title'), intoRows, arChars, refine_n);
          // reset the pos_changes dictionary:
          pos_changes = {"Old" : "", "New" : ""};
          aHtml += '<span class="moved">'+c.getAttribute('title')+'</span>';
        }
      }
    }
  
    // add the remaining changes to the aHtml and bHtml strings:
    var [aHtml, bHtml] = refine(pos_changes["Old"], pos_changes["New"], aHtml, bHtml, " ", intoRows, arChars, refine_n);

    // final cleanup of the html code (remove empty spans etc.):
    aHtml = cleanDiffHtml(aHtml);
    bHtml = cleanDiffHtml(bHtml);
  
    return [aHtml, bHtml]; 
  }
  
  /** Calculate the diff between two input texts
  *  (based on the wikEdDiff algorithm and refined using the Heckel algorithm)
  *  @param {String} a:         first input text
  *  @param {String} b:         second input text
  *  @param {Boolean} intoRows: if true, the diff text will be divided into rows for easier comparison
  *  @param {Number} arChars:   Minimum number of shared characters per line before starting new row
  *  @param {Number} refine_n:  N-grams to use for refining the wikEdDiff output. Default: 3 (that is, use character trigrams)
  *  @return {Array}            (diffHtml, aHtml, bHtml: the original wikEdDiff output + split into two separate strings)
  */
  async function kitabDiff(a, b, intoRows=false, arChars=20, refine_n=3) {
    // create the diff using the WikEdDiff algorithm:
    var wikEdDiff = new WikEdDiff();

    // experiment with special regexes for Arabic words and characters (none really works):
    //wikEdDiff.config.regExp.split.word = arTokExtRegex;
    //wikEdDiff.config.regExp.countWords = arTokExtRegex;
    //wikEdDiff.config.regExp.split.character = arCharExtRegex;
    var diffHtml =  wikEdDiff.diff(a, b);
    if (VERBOSE) {console.log(diffHtml);}
  
    // split the output of the WikEdDiff algorithm into two separate html strings:
    var [aHtml, bHtml] = parseDiffHtml(diffHtml, intoRows, arChars, refine_n);

    return [diffHtml, aHtml, bHtml];
  }