import { test } from '@japa/runner'

test.group('Sanity Test', () => {
  test('Adding two numbers', ({ expect }) => {
    // Test logic goes here
    expect(1 + 1).toBe(2)
  })
})
