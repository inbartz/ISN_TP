const fs = require('fs')
const path = require('path')

exports.toJSON = (results, name) => {
  const filename = path.join('data', `${name}.JSON`)
  const writeStream = fs.createWriteStream(filename)

  writeStream.write(`'${JSON.stringify(results)}'`)

  writeStream.on('finish', () => {
    console.log('File export complete')
  })

  writeStream.end()
}

exports.toCSV = (keys, results, name) => {
  const filename = path.join('data', `${name}.csv`)
  const writeStream = fs.createWriteStream(filename)

  /* Write Headers to File */
  keys.forEach(key => {
    writeStream.write(`${key}\t`)
  })
  writeStream.write('\n')

  /* Write Results to File */
  results.forEach((result) => {
    keys.forEach((key) => {
      /* Write the key if it exists */
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        writeStream.write(`${result[key]}`)
      }
      /* Delimit with a Tab */
      writeStream.write('\t')
    })

    writeStream.write('\n')
  })

  writeStream.on('finish', () => {
    console.log('File export complete')
  })

  writeStream.end()
}
