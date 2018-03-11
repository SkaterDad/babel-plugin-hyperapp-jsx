const Assert = require('assert')
const Path = require('path')
const Fs = require('fs')

const Babel = require('babel-core')

const fixturesDirectory = Path.join(__dirname, 'fixtures')

const babelOptions = options => ({
  presets: ['env'],
  plugins: [
    require('babel-plugin-external-helpers'),
    [require('../src'), options],
  ],
})

Fs.readdirSync(fixturesDirectory).forEach(testDirectory)

function testDirectory(name) {
  const options = {}
  const testDirectory = Path.join(fixturesDirectory, name)
  const actualCode = Fs.readFileSync(
    Path.join(testDirectory, 'actual.js'),
    'utf8'
  )
  const expectedCode = Fs.readFileSync(
    Path.join(testDirectory, 'expected.js'),
    'utf8'
  )

  if (Fs.existsSync(Path.join(testDirectory, 'options.json'))) {
    Object.assign(
      options,
      JSON.parse(
        Fs.readFileSync(Path.join(testDirectory, 'options.json'), 'utf8')
      )
    )
  }

  it(name, () => {
    const transformedCode = Babel.transform(actualCode, babelOptions(options))
      .code
    Assert.equal(transformedCode + '\n', expectedCode)
  })
}
