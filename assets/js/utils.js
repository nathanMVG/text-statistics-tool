import {renderTotalAndUniqueChart,renderLetterFrequency} from "./renderCharts.js";

function stringToWordsArray(textString, minLengthDetection, accentSensitive = true) {
    const initialWordsArray = textString
        .replace(/[^\w\sáéíóúãõàèìòùâêîôûäëïöüç"]/g, " ") // Substitui todos os caracteres que não são letras, números, espaços ou caracteres acentuados listados por um espaço. 
        .replace(/[\d]/g, "") // Remove números.
        .replace(/\s+/g, " ")  // Remove caracteres que representam espaços em branco.
        .trim()  // Remove espaços extras no começo e no fim.
        .split(" ")  // Divide o texto em palavras.
        .filter(word => word.length > 0) // Remove palavras vazias.
        .map(word => word.toLowerCase())  // Bota tudo em minúsculo.
        .map(word => word.replace(/"$/, ""));  // Remove apóstrofos apenas no final da palavra.

    const midWordsArray = filterByLength(initialWordsArray, minLengthDetection);

    const finalWordsArray = accentSensitive ? midWordsArray : removeAccents(midWordsArray);

    return finalWordsArray;
}

function removeAccents(wordsArray) {
  return wordsArray.map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c"));
}


function filterByLength(array, minLength) {
    return array.filter((element) => element.length >= minLength);
}

function wordsOccurrences(wordsArray) {
    const wordCount = {};
  
    wordsArray.forEach(word => {
      if (wordCount.hasOwnProperty(word)) {
        wordCount[word] += 1;
      } else {
        wordCount[word] = 1;
      }
    });
  
    const palavras = Object.keys(wordCount);  // Lista das palavras únicas.
    const ocorrencias = Object.values(wordCount);  // Lista com as ocorrências.
  
    return { palavras, ocorrencias };
}

function lettersInfo(array) {
  let contador = 0;
  let frequency = Array(27).fill(0);
  const alphabet = "abcdefghijklmnopqrstuvwxyzç";

  array.forEach((word) => {
      contador += word.length;
      word.split("").forEach((char) => {
          let index = alphabet.indexOf(char);
          if (index !== -1) {
              frequency[index] += 1;
          }
      });
  });
  return { contador, frequency };
}


function countSentences(text) {
  const sentences = text
      .split(/(?<=[.!?])(?=\s*[A-Z])/)
      .filter(sentence => sentence.trim() !== "");

  return sentences.length > 0 ? sentences.length : 1;
}

function countParagraphs(text) {
  const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim() !== "");
  return paragraphs.length;
}

function lenghtProfile(wordsArray){
  const maxLength = 20;
  const lengths = Array(maxLength).fill(0);

  wordsArray.forEach(word => {
      const length = word.length;
      if (length > 0 && length <= maxLength) {
          lengths[length - 1]++;
      }
  });
  return lengths;
}

function validateInput(text) {
  if (text.trim().length === 0) {
      alert("Digite algum texto.");
      return false;
  }
  return true;
}

function calculateMetrics(text, minLength, accentSensitive) {
  const wordsArray = stringToWordsArray(text, minLength, accentSensitive);
  const uniqueWordsArray = new Set(wordsArray);
  const lettersInformation = lettersInfo(wordsArray);

  return {
      totalWords: wordsArray.length,
      totalWordsLengths: lenghtProfile(wordsArray),
      uniqueWords: uniqueWordsArray.size,
      uniqueWordsLengths: lenghtProfile(Array.from(uniqueWordsArray)),
      totalLetters: lettersInformation.contador,
      lettersFrequency: lettersInformation.frequency,
      totalCharacters: text.length,
      totalSentences: countSentences(text),
      totalParagraphs: countParagraphs(text)
  };
}

function renderResults(metrics, resultSection) {
  const { totalWords, totalWordsLengths, uniqueWords, uniqueWordsLengths, totalLetters, lettersFrequency,
         totalCharacters, totalSentences, totalParagraphs } = metrics;

  resultSection.innerHTML = `
      <h2>Resultados</h2>
      <p>Número de palavras: ${totalWords}</p>
      <p>Número de palavras únicas: ${uniqueWords}</p>
      <p>Número de letras: ${totalLetters}</p>
      <p>Número de caracteres: ${totalCharacters}</p>
      <p>Número de frases: ${totalSentences}</p>
      <p>Número de parágrafos: ${totalParagraphs}</p>
      <canvas id="totalAndUniqueChart" style="width: 600px; height: 300px;"></canvas>
      <canvas id="lettersFrequency" style="width: 600px; height: 300px;"></canvas>
  `;
  renderTotalAndUniqueChart(totalWordsLengths, uniqueWordsLengths);
  renderLetterFrequency(lettersFrequency);
  
  resultSection.style.visibility = "visible";
  window.scrollTo({ top: resultSection.offsetTop, behavior: "smooth" });
}

export function analysis(text, minLength, accentSensitive, resultSection) {
  if (!validateInput(text)) return;

  const metrics = calculateMetrics(text, parseInt(minLength), accentSensitive === "true");
  renderResults(metrics, resultSection);
}