import { configure, processCLIArgs, run } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { expect } from '@japa/expect'

processCLIArgs(process.argv.splice(2))
configure({
  suites: [
    {
      name: "unit",
      files: "tests/unit/**/*.spec.js",
    },
    {
      name: "e2e",
      files: "tests/e2e/**/*.spec.js",
    },
  ],
  plugins: [expect(), apiClient('http://localhost:4000')],
})

run()
