import * as d3Array from 'd3-array'

export const getLinearSteps = ({ domain, step }) => {
  const [minValue, maxValue] = domain
  const rangeStart = getBase(minValue)
  const precision = countDecimals(step)

  let range = d3Array
    .range(rangeStart, maxValue + step, step)
    .reduce((memo, value, index, array) => {
      if (value >= minValue) {
        const formattedValue = precisionFormatter(value, precision)
        
        memo.push(parseFloat(formattedValue))
      }
            
      if (index === array.length - 1 && value !== maxValue) {
        memo.push(maxValue)
      }
      
      return memo
    }, [])

  if (rangeStart !== minValue) {
    range = prepend(minValue, range)
  }
  
  return range
}

export const getExponentialSteps = ({
  domain,
  quantize = 5,
  precision = 0
}) => {
  quantize = precision ? 10 : quantize
  const [minValue, maxValue] = domain
  const rangeStep = precision ? Math.pow(10, -precision) : getBase(minValue)
  const rangeStart = getBase(minValue)
  const rangeStop = maxValue + clamp(0, 1, rangeStep)

  let range = d3Array
    .range(rangeStart, rangeStop, rangeStep)
    .reduce((memo, value, index, array) => {
      if (value >= minValue) {
        const formattedValue = precisionFormatter(value, precision)
        
        memo.push(parseFloat(formattedValue))
      }
      
      if (index === array.length - 1 && value !== maxValue) {
        memo.push(maxValue)
      }

      return memo
    }, [])
  
  if (rangeStart !== minValue) {
    range = prepend(minValue, range)
  }

  let step, remainder, precisionCorrection

  return range.filter((number, index) => {
    step = precisionRound({ number: getBase(number) / quantize, precision })
    precisionCorrection = Math.pow(10, precision)
    remainder = (number * precisionCorrection) % (step * precisionCorrection)
    
    return index === 0 || number === maxValue || !remainder
  })
}

const clamp = (min, max, value) => 
  value < min ? min :
  value > max ? max :
  value
  
const prepend = (item, array) => [item].concat(array)
const apend = (item, array) => array.concat([item])

const precisionFormatter = (value , precision) => value.toFixed(precision)


export const findClosestInArray = ({ array, value }) =>
  array.reduce(
    (prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  )
  
const isFractional = number => number % 1 !== 0

const countDecimals = value =>
  value % 1 != 0 ? value.toString().split('.')[1].length : 0
  
const getNumberOfDigits = number =>
  (Math.log(number) * Math.LOG10E + 1) | 0

const getBase = number => {
  if (number === 0) return 1
  
  return isFractional(number) && number < 1
    ? Math.pow(10, -countDecimals(number))
    : Math.pow(10, getNumberOfDigits(number) - 1)
}

const precisionRound = ({ number, precision }) => {
  const factor = Math.pow(10, precision)

  return Math.round(number * factor) / factor
}
