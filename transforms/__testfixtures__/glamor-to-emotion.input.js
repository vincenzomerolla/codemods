// @flow

import { css } from 'glamor'

css({
  color: 'green',
}).toString()

const styles = css({
  color: 'red',
})

const Div = <div {...styles} />
