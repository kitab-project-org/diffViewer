/*
Functions and variables for dealing with Arabic-script texts
*/

export { ARCHARS, noise, arCharsStr, arCharRegex, arTokRegex, arCharsExtStr, arCharExtRegex, arTokExtRegex, tokenize, countWords, countChars};

// define regular expression to define Arabic characters and tokens:
var ARCHARS = [
  "ء	ARABIC LETTER HAMZA",
  "آ	ARABIC LETTER ALEF WITH MADDA ABOVE",
  "أ	ARABIC LETTER ALEF WITH HAMZA ABOVE",
  "ؤ	ARABIC LETTER WAW WITH HAMZA ABOVE",
  "إ	ARABIC LETTER ALEF WITH HAMZA BELOW",
  "ئ	ARABIC LETTER YEH WITH HAMZA ABOVE",
  "ا	ARABIC LETTER ALEF",
  "ب	ARABIC LETTER BEH",
  "ة	ARABIC LETTER TEH MARBUTA",
  "ت	ARABIC LETTER TEH",
  "ث	ARABIC LETTER THEH",
  "ج	ARABIC LETTER JEEM",
  "ح	ARABIC LETTER HAH",
  "خ	ARABIC LETTER KHAH",
  "د	ARABIC LETTER DAL",
  "ذ	ARABIC LETTER THAL",
  "ر	ARABIC LETTER REH",
  "ز	ARABIC LETTER ZAIN",
  "س	ARABIC LETTER SEEN",
  "ش	ARABIC LETTER SHEEN",
  "ص	ARABIC LETTER SAD",
  "ض	ARABIC LETTER DAD",
  "ط	ARABIC LETTER TAH",
  "ظ	ARABIC LETTER ZAH",
  "ع	ARABIC LETTER AIN",
  "غ	ARABIC LETTER GHAIN",
  "ـ	ARABIC TATWEEL",
  "ف	ARABIC LETTER FEH",
  "ق	ARABIC LETTER QAF",
  "ك	ARABIC LETTER KAF",
  "ل	ARABIC LETTER LAM",
  "م	ARABIC LETTER MEEM",
  "ن	ARABIC LETTER NOON",
  "ه	ARABIC LETTER HEH",
  "و	ARABIC LETTER WAW",
  "ى	ARABIC LETTER ALEF MAKSURA",
  "ي	ARABIC LETTER YEH",
  "ً	ARABIC FATHATAN",
  "ٌ	ARABIC DAMMATAN",
  "ٍ	ARABIC KASRATAN",
  "َ	ARABIC FATHA",
  "ُ	ARABIC DAMMA",
  "ِ	ARABIC KASRA",
  "ّ	ARABIC SHADDA",
  "ْ	ARABIC SUKUN",
  "٠	ARABIC-INDIC DIGIT ZERO",
  "١	ARABIC-INDIC DIGIT ONE",
  "٢	ARABIC-INDIC DIGIT TWO",
  "٣	ARABIC-INDIC DIGIT THREE",
  "٤	ARABIC-INDIC DIGIT FOUR",
  "٥	ARABIC-INDIC DIGIT FIVE",
  "٦	ARABIC-INDIC DIGIT SIX",
  "٧	ARABIC-INDIC DIGIT SEVEN",
  "٨	ARABIC-INDIC DIGIT EIGHT",
  "٩	ARABIC-INDIC DIGIT NINE",
  "ٮ	ARABIC LETTER DOTLESS BEH",
  "ٰ	ARABIC LETTER SUPERSCRIPT ALEF",
  "ٹ	ARABIC LETTER TTEH",
  "پ	ARABIC LETTER PEH",
  "چ	ARABIC LETTER TCHEH",
  "ژ	ARABIC LETTER JEH",
  "ک	ARABIC LETTER KEHEH",
  "گ	ARABIC LETTER GAF",
  "ی	ARABIC LETTER FARSI YEH",
  "ے	ARABIC LETTER YEH BARREE",
  "۱	EXTENDED ARABIC-INDIC DIGIT ONE",
  "۲	EXTENDED ARABIC-INDIC DIGIT TWO",
  "۳	EXTENDED ARABIC-INDIC DIGIT THREE",
  "۴	EXTENDED ARABIC-INDIC DIGIT FOUR",
  "۵	EXTENDED ARABIC-INDIC DIGIT FIVE",
  "۶	EXTENDED ARABIC-INDIC DIGIT SIX",
  "۷	EXTENDED ARABIC-INDIC DIGIT SEVEN",
  "۸	EXTENDED ARABIC-INDIC DIGIT EIGHT",
  "۹	EXTENDED ARABIC-INDIC DIGIT NINE",
  "۰	EXTENDED ARABIC-INDIC DIGIT ZERO"
];
var noise = [
  "◌ّ    | # Tashdīd / Shadda",
  "◌َ    | # Fatḥa",
  "◌ً    | # Tanwīn Fatḥ / Fatḥatān",
  "◌ُ    | # Ḍamma",
  "◌ٌ    | # Tanwīn Ḍamm / Ḍammatān",
  "◌ِ    | # Kasra",
  "◌ٍ    | # Tanwīn Kasr / Kasratān",
  "◌ْ    | # Sukūn",
  "◌ۡ    | # Quranic Sukūn",
  "◌ࣰ    | # Quranic Open Fatḥatān",
  "◌ࣱ    | # Quranic Open Ḍammatān",
  "◌ࣲ    | # Quranic Open Kasratān",
  "◌ٰ    | # Dagger Alif",
  "◌ـ   | # Taṭwīl / Kashīda",
];
var arCharsStr = "";
ARCHARS.forEach(el => arCharsStr += el[0]);
var arCharRegex = new RegExp("(["+arCharsStr+"])", "g");
var arTokRegex = new RegExp("(["+arCharsStr+"]+)", "g");

var arCharsExtStr = arCharsStr;
noise.forEach(el => arCharsExtStr += el[1]);
var arCharExtRegex = new RegExp("(["+arCharsExtStr+"])", "g");
var arTokExtRegex = new RegExp("(["+arCharsExtStr+"]+)", "g");


// tokenize a string using a regex that defines a token:

function tokenize(s, tokRegex){
  let m = s.match(tokRegex);
  return m;
}

// count the number of times each token is present in a string
// using a regex that defines a token:

function countWords(s, tokRegex){
  return tokenize(s, tokRegex)
    .reduce(
      function(n,r){return n.hasOwnProperty(r)?++n[r]:n[r]=1,n},
      {}
    )
}

// count characters in a string using a regex
// that defines what characters should be considered

function countChars(s, charRegex){
   let chars = s.match(charRegex)
   if (chars) {
     return chars.length;
   } else {
     return 0;
   }
}
