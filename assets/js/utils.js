function stringToWordsArray(textString, minLengthDetection, accentSensitive = true) {
    const initialWordsArray = textString
        .replace(/[^\w\sáéíóúãõàèìòùâêîôûäëïöü']/g, ' ')  // Substitui sinais de pontuação por espaço (mantendo apóstrofo).
        .replace(/\s+/g, ' ')  // Remove caracteres que representam espaços em branco.
        .trim()  // Remove espaços extras no começo e no fim.
        .split(' ')  // Divide o texto em palavras.
        .filter(word => word.length > 0) // Remove palavras vazias.
        .map(word => word.toLowerCase())  // Bota tudo em minúsculo.
        .map(word => word.replace(/'$/, ''));  // Remove apóstrofos apenas no final da palavra.

    const midWordsArray = filterByLength(initialWordsArray, minLengthDetection);

    const finalWordsArray = accentSensitive ? midWordsArray : removeAccents(midWordsArray);

    return finalWordsArray;
}

    
function removeAccents(wordsArray) {
    return wordsArray.map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
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
  
    const palavras = Object.keys(wordCount);  // Lista das palavras únicas
    const ocorrencias = Object.values(wordCount);  // Lista com as ocorrências
  
    return { palavras, ocorrencias };
}

function lettersNumber(array){
    let contador = 0;
    array.forEach((word) => {contador += word.length});
    return contador;
}

function countSentences(text) {
    const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
    return sentences.length > 0 ? sentences.length : 1;
}

export function analysis(text,minLength,accentSensitive,resultSection){
    resultSection.innerHTML="<h2>Resultados</h2>";

    if(text.length === 0){
        alert("Digite algum texto.");
        return
    }

    const booleanValue = accentSensitive === "true";
    const wordsArray = stringToWordsArray(text,parseInt(minLength),booleanValue);

    resultSection.innerHTML += `<p>Número de palavras: ${wordsArray.length}</p>`;
    resultSection.innerHTML += `<p>Número de palavras únicas: ${[...new Set(wordsArray)].length}</p>`;
    resultSection.innerHTML += `<p>Número de letras: ${lettersNumber(wordsArray)}</p>`;
    resultSection.innerHTML += `<p>Número de frases: ${countSentences(text)}</p>`;
    
    
    resultSection.style.visibility = "visible";
    window.scrollTo({top: resultSection.offsetTop,behavior: "smooth"});
}
  

/*const ocurrences = wordsOccurrences(stringToWordsArray("eu não vou negar, que ainda te amo, mas você merece o meu abandono ámo, amô",3,true));
const ctx = document.getElementById("myChart");
const data = {
    labels: ocurrences.palavras,
    datasets: [{
      label: '# of Ocurrences',
      data: ocurrences.ocorrencias,
      borderWidth: 1
    }]
  };
const options = {
    responsive: true,
    scales: {
      y: {
        ticks:{stepSize: 1},
        beginAtZero: true
      }
    }
  }
const config = {type: 'bar', data: data, options:options}
new Chart(ctx,config)*/