import React, { forwardRef } from 'react'
import { HighlightText } from 'react-native-highlight-text'

const Highlight = forwardRef((props, ref) => (
  <HighlightText {...props} ref={ref} />
))

export default Highlight
