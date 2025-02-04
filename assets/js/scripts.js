import {analysis, fileInputValidator} from "./utils.js";

const uploadButton = document.querySelector("#uploadButton");
const fileInput = document.querySelector("#myTextFile");
const cleanButton = document.querySelector("#cleanButton");
const processButton = document.querySelector("#processButton");
const textArea = document.querySelector("#myText");
const resultSection = document.querySelector("#resultSection");

uploadButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", fileInputValidator);

cleanButton.addEventListener("click",()=>{
  textArea.value="";
  textArea.focus();
})

processButton.addEventListener("click",()=>{
  const text = textArea.value;
  const minLength = document.querySelector('input[name="triple-radio"]:checked').value;
  const accentSensitive = document.querySelector('input[name="double-radio"]:checked').value;
  analysis(text,minLength,accentSensitive,resultSection);
})
