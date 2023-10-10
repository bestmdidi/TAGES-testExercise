const fs = require('fs');
const { promisify } = require('util');
const readline = require('readline');

const fileSize = 1024 * 1024 * 500;
const inputFilePath = 'text.txt';
const outputFilePath = 'result.txt';

const inputFile = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
const outputFile = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

const rl = readline.createInterface({
  input: inputFile,
});

const readLines = promisify(async () => {
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
});

const sortAndWriteLines = async () => {
  const lines = await readLines();
  lines.sort();
  for (const line of lines) {
    outputFile.write(`${line}\n`);
  }
};

const sortFile = async () => {
  let currentSize = 0;
  for await (const line of rl) {
    currentSize += line.length;
    if (currentSize >= fileSize) {
      await sortAndWriteLines();
      currentSize = 0;
    }
  }

  if (currentSize > 0) {
    await sortAndWriteLines();
  }

  rl.close();
  outputFile.close();
  console.log('Sort completed');
};

sortFile();
