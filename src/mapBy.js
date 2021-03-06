/*
 * MapBy
 * Take a list and reduce it into an object
 */

export default function mapBy (array, fn) {
  return array.reduce(function(memo, next) {
    memo[next] = fn(next)
    return memo
  }, {})
}
