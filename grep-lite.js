const fs = require('fs');
const path = require('path');


const args = process.argv.slice(2);

const params = {};

args.forEach(arg => {
    if (arg.startsWith('--file=')){
        params.file = arg.split('=')[1];
    } else if (arg.startsWith('--search=')) {
        params.search = arg.split('=')[1];
    } else if (arg == '--ignore-case') {
        params.ignoreCase = true;
    }
})


if (!params.file || !params.search){
    console.error('Используйте: node grep-lite.js --file=<path> --search=<string> [--ignore-case]')
    process.exit(1);
}


function searchInFile(content, searchString, ignoreCase = false){
    lines = content.split('\n');

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        const isMatch = ignoreCase
            ? line.toLowerCase().includes(searchString.toLowerCase())
            : line.includes(searchString);

        if (isMatch) {
            console.log(`Cовпадение: строка № ${lineNumber} ${line}`)
        }
    });
}

const filePath = path.resolve(params.file);

fs.readFile(filePath, 'utf8', (err, data) =>{
    if (err) {
        if (err.code === 'ENOENT') {
            console.error(`Ошибка: файл не найден: ${filePath}`);
        } else {
            console.error(`Ошибка чтения файла: ${err.message}`);
        }
        process.exit(1);
    }

    searchInFile(data, params.search, params.ignoreCase)
});


