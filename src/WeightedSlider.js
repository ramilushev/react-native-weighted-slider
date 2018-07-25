import React, { PureComponent } from 'react'
import { Slider } from 'react-native'
import * as d3 from 'd3-scale'
import { getExponentialSteps, getLinearSteps, findClosestInArray } from './utils'

export default class WeightedSlider extends PureComponent<Props> {
  static defaultProps = {
    weight: 1,
    initialValue: 1,
    step: 1,
    precision: 0,
    useLinearSteps: true,
    quantize: 5,
    onSlidingComplete: () => null,
    onValueChange: () => null
  }

  steps = null
  scale = d3.scalePow()
  steppedScale = d3.scaleQuantize()

  state = {
    value: 0
  }

  componentDidMount() {
    const { initialValue } = this.props

    this.setScales()
    this.setValue(initialValue)
    this.setNativeValue(initialValue)
  }

  componentDidUpdate({
    initialValue: prevInitialValue,
    minValue: prevMinValue,
    maxValue: prevMaxValue
  }) {
    const { minValue, maxValue, initialValue } = this.props
    const { value } = this.state

    if (
      minValue !== prevMinValue ||
      maxValue !== prevMaxValue
    ) {      
      this.setScales()
      setTimeout(() => this.setNativeValue(value), 0)
    }

    if (prevInitialValue !== initialValue) {
      this.setNativeValue(initialValue)
    }
  }

  // Creates an exponentiated scale and a stepped scale.
  setScales = () => {
    const { minValue, maxValue, weight, step, steps, useLinearSteps, precision, quantize } = this.props
    const domain = [minValue, maxValue]

    this.steps = steps || (useLinearSteps
      ? getLinearSteps({ domain, step })
      : getExponentialSteps({ domain, precision, quantize }))
        
    this.scale
      .domain(domain)
      .range(domain)
      .exponent(weight)

    this.steppedScale
      .domain(domain)
      .range(this.steps)
  }

  setValue = value =>
    this.setState(() => ({ value }))

  setNativeValue = value =>
    // Used for setting correct slider position after user input
    // without triggering any callbacks
    this.slider &&
    this.slider.setNativeProps({ value: this.getInvertedValue(value) })
  
  onSlidingComplete = value => {
    const { onSlidingComplete } = this.props
    const scaledValue = this.getScaledValue(value)
        
    this.setValue(scaledValue)
    onSlidingComplete(scaledValue)
  }

  onValueChange = value => {
    const { onValueChange } = this.props
    const scaledValue = this.getScaledValue(value)
        
    this.setValue(scaledValue)
    onValueChange(scaledValue)
  }

  // Returns the value with an exponent applied to it.
  // Optionally rounds it to the nearest step if steps are passed.
  getScaledValue = value => {    
    return this.steppedScale(this.scale(value))
  }

  getInitialValue = () => {
    const { value } = this.props

    return this.getInvertedValue(value)
  }

  getInvertedValue = value => {
    const closestStep = findClosestInArray({ array: this.steps, value })
    const closestValues = this.steppedScale.invertExtent(closestStep)
    // invertExtent returns the two closest steps to the value provided.
    // e.g. value 15 -> [10, 20]
    
    return this.scale.invert(
      findClosestInArray({ array: closestValues, value: closestStep })
    )
  }

  render() {
    const { disabled, minValue, maxValue, initialValue } = this.props

    return (
      <Slider
        {...this.props}
        minimumValue={minValue}
        maximumValue={maxValue}
        ref={slider => (this.slider = slider)}
        onValueChange={this.onValueChange}
        onSlidingComplete={this.onSlidingComplete}
      />
    )
  }
}

type Props = {
  weight: number,
  quantize: number,
  precision: number,
  minValue: number,
  maxValue: number,
  disabled: boolean,
  onSlidingComplete: Function,
  onValueChange: Function
}
