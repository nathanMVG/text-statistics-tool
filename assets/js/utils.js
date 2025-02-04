import {renderTotalAndUniqueChart,renderLetterFrequency,renderWordsFrequency} from "./renderCharts.js";

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

function wordsInfo(wordsArray) {
  // Objeto de contagem.
  const wordCount = {};
  
  for (const word of wordsArray) {
      if (wordCount.hasOwnProperty(word)) {
          wordCount[word] += 1;
      } else {
          wordCount[word] = 1;
      }
  }
  // Obtem a lista de palavras e ocorrência do objeto de contagem criado acima.
  const words = Object.keys(wordCount);
  const occurrences = Object.values(wordCount);

  // Ordena as duas listas em ordem decrescente de ocorrências.
  const sorted = words.map((word, i) => ({ word, occurrence: occurrences[i] }))
      .sort((a, b) => b.occurrence - a.occurrence);

  const sortedWords = sorted.map(item => item.word).slice(0, 20);
  const sortedOccurrences = sorted.map(item => item.occurrence).slice(0, 20);

  return { words: sortedWords, occurrences: sortedOccurrences };
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
  const wordsInformation = wordsInfo(wordsArray);
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
      totalParagraphs: countParagraphs(text),
      sortedWordsList: wordsInformation.words,
      sortedOccurrencesList:wordsInformation.occurrences
  };
}

function renderResults(metrics, resultSection) {
  const { totalWords, totalWordsLengths, uniqueWords, uniqueWordsLengths, totalLetters, lettersFrequency,
         totalCharacters, totalSentences, totalParagraphs, sortedWordsList, sortedOccurrencesList} = metrics;

  resultSection.innerHTML = `
      <h2>Resultados</h2>
      <p>Número de palavras: ${totalWords}</p>
      <p>Número de palavras únicas: ${uniqueWords}</p>
      <p>Diversidade lexical (Razão entre palavras únicas e total de palavras): ${(uniqueWords*100/totalWords).toFixed(1) + "%"}</p>
      <p>Número de letras: ${totalLetters}</p>
      <p>Número de caracteres: ${totalCharacters}</p>
      <p>Número de frases: ${totalSentences}</p>
      <p>Número de parágrafos: ${totalParagraphs}</p>
      <p>Número de parágrafos: ${totalParagraphs}

      <div class="graph">
        <p>Palavras mais frequentes (Máximo: 20 palavras mais frequentes):</p>
        <canvas id="wordsFrequency" style="width: 600px; height: 300px;"></canvas>
      </div>
      <div class="graph">
        <p>Distribuição de palavras por número de letras (Máximo: Palavras de 20 letras):</p>
        <canvas id="totalAndUniqueChart" style="width: 600px; height: 300px;"></canvas>
      </div>
      <div class="graph">
        <p>Ocorrências das letras:</p>
        <canvas id="lettersFrequency" style="width: 600px; height: 300px;"></canvas>
      </div>  
  `;
  renderWordsFrequency(sortedWordsList,sortedOccurrencesList);
  renderTotalAndUniqueChart(totalWordsLengths, uniqueWordsLengths);
  renderLetterFrequency(lettersFrequency);
  
  resultSection.style.visibility = "visible";
  window.scrollTo({ top: resultSection.offsetTop, behavior: "smooth" });
}

export function fileInputValidator(event) {
  const fileInput = event.target;
  const textArea = document.querySelector("#myText");
  const file = fileInput.files[0];
  if (!file) return;

  const allowedExtensions = ["txt"];
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const maxSize = 10 * 1024 * 1024; // 10MB em bytes

  if (!allowedExtensions.includes(fileExtension)) {
    alert("Formato de arquivo não suportado!");
    fileInput.value = "";
    return;
  }

  if (file.size > maxSize) {
    alert("O arquivo não pode exceder 10MB!");
    fileInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = (readerEvent) => {
    textArea.value = readerEvent.target.result;
    fileInput.value = ""
  };

  reader.readAsText(file);
}


export function analysis(text, minLength, accentSensitive, resultSection) {
  if (!validateInput(text)) return;

  const metrics = calculateMetrics(text, parseInt(minLength), accentSensitive === "true");
  renderResults(metrics, resultSection);
}