module.exports = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/spec/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}