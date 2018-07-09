// @flow

import { css } from 'emotion'

css({
  color: 'green',
})

const styles = css({
  color: 'red',
})

const Div = <div className={styles} />
