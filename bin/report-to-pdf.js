#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const nodeFlag = require('node-flag')
const pdf = require('pdf-creator-node')

const fileArg = process.argv[2]
const outputArg = process.argv[3]
const filterArg = nodeFlag.get('filter')
const isVerbose = nodeFlag.isset('v')

let logStep = 0
function logHeader (first, ...args) {
  if (isVerbose) {
    console.log(`\n\n${++logStep}) ${first}`, ...args)
  }
}
function logContent () {
  if (isVerbose) {
    console.log(...arguments)
  }
}

logHeader('Called with:')
logContent(`- file: ${fileArg}`)
logContent(`- output: ${outputArg}`)
logContent(`- filter: ${filterArg}`)

if (!fileArg || !outputArg) {
  console.log('Missing file')
  process.exit()
}

const html = fs.readFileSync(path.resolve(__dirname, '..', 'template.html'), 'utf8')

logHeader('Read template html')

const reg = /[:<>]/
const filters = filterArg.split(',').map(filter => {
  const match = filter.match(reg)
  const type = match[0]
  const key = filter.substring(0, match.index).trim()
  const value = filter.substring(match.index + 1, filter.length).trim()

  return {
    operation: type,
    key,
    value
  }
})

logHeader('Filters:')
logContent(filters)

const filePath = path.resolve(process.cwd(), process.argv[2])

const fileContent = fs.readFileSync(filePath, 'utf8').trim()

const data = parse(fileContent, {
  columns: ['Project', 'Client', 'Title', 'Duration'],
  from_line: 2
})

logHeader('Data:')
logContent(data)

const filteredData = filters.reduce((last, filter) => {
  switch (filter.operation) {
    case '<':
      return last.filter(item => item[filter.key] < filter.value)
    case '>':
      return last.filter(item => item[filter.key] > filter.value)
    case ':':
      return last.filter(item => item[filter.key] === filter.value)
  }
}, data)

logHeader('Filtered data:')
logContent(filteredData)

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
  footer: {
    height: '28mm',
    contents: {
      default: '<center><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></center>'
    }
  }
}

const document = {
  html: html,
  data: {
    entries: filteredData
  },
  path: path.resolve(process.cwd(), outputArg)
}

pdf.create(document, options)
  .then(res => {
    console.log(`Wrote report to ${outputArg}`)
  })
  .catch(error => {
    console.error(error)
  })
