# react-native-weighted-slider
An enhanced slider component for react-native that distributes values disproportionally for a better UX, with support for non-linear step generation. Uses [d3](https://d3js.org/ "D3 Website") for step generation and quantization.

# Instalation
```npm install react-native-weighted-slider```

# Props
Accepts regular react-native slider props + the ones below

| Prop         | Default Value      | Description  |
|--------------|--------------------|--------------|
| minValue     | 0                  |Slider minimum value.|
| maxValue     | 100                |Slider maximum value.|
| weight       | 1                  |This determines how disproportionately the steps are distributed. Values between 1 and 2 are enough for most uses.
| useLinearSteps | true             |If the slider should distribute the steps linearly or non-linearly. If set to true, the slider will generate steps uniformly for the given min/max e.g. a domain of 0-100 with a step of 25 will generate [0, 25, 50, 75, 100] steps. If set to false, it will generate non-linearly increasing steps based on the current base e.g 0-1000 with a quantize value of 2 will generate [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 10, 15, 20, 25 ... 95, 100, 150, 200, 250 ... 900, 950, 1000] steps.
| quantize     | 5                  | Each non-linear base step will increase by 10/quantize amount e.g. with a quantize level of 5, the non-linear steps generated for [0 - 100] would be [0, 1, ...9, 10, 12, 14, 16 .... 96, 98, 100]. With a quantize level of 2, the non-linear steps generated will be [0, 1, ... 9, 10, 15, 20, 25 ... 90, 95, 100]. Applies only when useLinearSteps is set to false.
| step         | 1                  | Space between linear steps. Applies only when useLinearSteps is set to true.

## TODO:
- [ ] Add a brief demonstration gif
- [ ] Add runable example
