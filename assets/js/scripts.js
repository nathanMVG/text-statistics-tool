import {analysis} from "./utils.js";

const uploadButton = document.querySelector("#uploadButton");
const fileInput = document.querySelector("#myTextFile");
const cleanButton = document.querySelector("#cleanButton");
const processButton = document.querySelector("#processButton");
const textArea = document.querySelector("#myText");
const resultSection = document.querySelector("#resultSection");

uploadButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    const file = fileInput.files[0];
    if (file) {
      const allowedExtensions = ['txt', 'pdf'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        alert('Formato de arquivo não suportado!');
        event.target.value = '';
      }
      else{
        alert(`Arquivo selecionado: ${file.name}`);
      }
    }
});

cleanButton.addEventListener("click",()=>{
  textArea.value="";
})

processButton.addEventListener("click",()=>{
  const text = textArea.value;
  const minLength = document.querySelector('input[name="triple-radio"]:checked').value;
  const accentSensitive = document.querySelector('input[name="double-radio"]:checked').value;
  analysis(text,minLength,accentSensitive,resultSection);
})



